/*
 * A WordReader reads a Word document and extracts all the headers
 * and the contents between any two headers, such that whole sections
 * of a document can be redacted.
 */

function WordReader(name, wordFile) {

    var self = this;
    self.wordFile = wordFile;
    self.noEntries = 0;
    self.totalEntries;
    self.word = new Word(name, wordFile);

    //variables to represent tags in word xml
    self.p = "w\\:p";
    self.t = "w\\:t";
    self.page = "w\\:lastRenderedPageBreak";
    self.pStyle = "w:\\pStyle";
    self.val = "w:val";

    var IMAGE_REL_TYPE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

    self.readWord = function() {
        // use a BlobReader to read the zip from a Blob object
        zip.createReader(new zip.BlobReader(self.wordFile), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
                if (entries.length) {
                    self.totalEntries = entries.length;
                    processEntries(entries, 0);
                }
            });
        }, function(error) {
            console.log(error);
        });

        function processEntries(entries, i) {
            var entry = entries[i];
            var entries = entries;
            var i = i;


            if ((entry.filename).indexOf("word/document.xml") !== -1) {

                entry.getData(new zip.TextWriter('utf-8'), function(text, entry) {
                    var xmlDoc;
                    var level = 0; //the level of headings - useful to create a hierarchy
                    xmlDoc = $.parseXML(text);

                    if (window.webkitURL) {
                        self.p = "p";
                        self.t = "t";
                        self.page = "lastRenderedPageBreak";
                        self.pStyle = "pStyle";
                    }
                    
                    var level = 0;
                    var newLevel = 0;
                    var wordRootSection = new WordSection(0, null);
                    var currentSection = wordRootSection;
                    var parentSection = null;
                    
                    var paras = $(xmlDoc).find(self.p);
                    paras.each(function(key) {
                        var para = paras[key];
                        var wordParagraph = new WordParagraph();
                        var section = false;
                        //is this para a new heading or text?
                        //look for a pStyle tag to find if this para is a heading
                        var styles = $(para).find(self.pStyle);
                        if (styles.length > 0) {
                            //style tag has been found, check if one matches a heading
                            styles.each(function(key) {
                                var style = styles[key];
                                var styleVal = $(style).attr(self.val);
                                //check if style is a heading and if so get heading level
                                if (styleVal.indexOf("Heading") !== -1) {
                                    newLevel = parseInt(styleVal.substr(7)); //strip off the word heading
                                    section = true;
                                }
                            });
                        }
                        //a new section?                        
                        if (section) {
                            //is the new section on a new level
                            if (newLevel > level){ //a level deeper in the hierarachy
                                parentSection = currentSection;
                                currentSection = new WordSection(newLevel, parentSection);
                                level = newLevel;
                            }else{                                                      
                                if (newLevel < level){ //up one level in the hierarachy                                
                                    while (newLevel <= level){     
                                        currentSection.closeSection();
                                        parentSection = currentSection.getParentSection();
                                        currentSection = parentSection;
                                        level = currentSection.getLevel();
                                    }                      
                                    currentSection = new WordSection(newLevel, parentSection);
                                    level = newLevel;
                                }else{
                                    if (newLevel === level){
                                        currentSection.closeSection();                               
                                        currentSection = new WordSection(newLevel, currentSection.getParentSection());
                                    }
                                }
                            }
                        }
                        var texts = $(para).find(self.t);
                        wordParagraph.addText(texts.text());                  
                        //add the paragraph to the current section
                        if (section){
                            currentSection.addTitle(wordParagraph);
                        }else{
                            currentSection.addPara(wordParagraph);
                        }                                            
                    });
                    
                    //close the last working section and everything depending on it
                    while(currentSection.closeSection()){
                        currentSection = currentSection.getParentSection();
                    }

                    self.word.setRootWordSection(currentSection);
                    
                    
                }, function(current, total) {
                    // onprogress callback
                });
            } else {

                //if media file then create a PowerPointImage
                if ((entry.filename).indexOf("word/media/") !== -1) {
                    //get the data for that media
                    entry.getData(new zip.BlobWriter(), function(data, entry) {
                        var filename, wordImage, name, format;
                        filename = entry.filename;
                        name = filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf("."));
                        format = filename.substr(filename.lastIndexOf("."));
                        wordImage = new WordImage(name, format, data, function(wordImage) {
                            self.word.addImage(wordImage);
                            i++;
                            if (i === self.totalEntries) {
                                self.displayWord();
                            } else {
                                processEntries(entries, i);
                            }
                        });
                    }, function(current, total) {
                        // onprogress callback
                    });
                } else {
                    //if a slides rel file
                    if ((entry.filename).indexOf("word/_rels") !== -1) {
                        entry.getData(new zip.TextWriter('utf-8'), function(text, entry) {
                            var filename, xmlDoc, rels, target, imageName;
                            filename = entry.filename;
                            xmlDoc = $.parseXML(text);
                            rels = $(xmlDoc).find("Relationship");
                            if (rels.length) {
                                for (var j = 0; j < rels.length; j++) {
                                    if ($(rels[j]).attr("Type") === IMAGE_REL_TYPE) {
                                        target = $(rels[j]).attr("Target");
                                        imageName = target.substring(target.lastIndexOf("/") + 1, target.lastIndexOf("."));
                                        slideImageRel = new SlideImageRel(-1, -1, imageName, false);
                                        self.word.addSlideImageRel(slideImageRel);
                                    }
                                }
                            }

                            i++;
                            if (i === self.totalEntries) {
                                self.displayWord();
                            } else {
                                processEntries(entries, i);
                            }

                            //self.increment();
                        }, function(current, total) {
                            //onprogress callback
                        });
                    } else {
                        i++;
                        if (i === self.totalEntries) {
                            self.displayWord();
                        } else {
                            processEntries(entries, i);
                        }
                    }
                }
            }
        }
    };

    self.callbackTest = function() {
        console.log("Job Done...");
    };

    self.displayWord = function() {
        $('#redactBtn').data("redactor").setWord(self.word);

        $('#redactBtn').addClass("disabled");
        //console.log($('#download a'));
        $('#download a').attr('href', '')
                .attr('download', '')
                .empty();

        console.log()

        var wordViewer = new WordViewer(self.word);
        wordViewer.displayOverview(self.word);
        wordViewer.displayImages(self.word);
    };

}