/*
 * A WordReader reads a Word document and extracts all the headers
 * and the contents between any two headers, such that whole sections
 * of a document can be redacted.
 */

function WordReader(name, wordFile) {

    var PICTURE_FORMAT = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
    var IMAGE_REL_TYPE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

    var self = this;
    self.wordFile = wordFile;
    self.noEntries = 0;
    self.totalEntries;
    self.word = new Word(name, wordFile);

    //variables to represent tags in word xml
    self.r = "w\\:r";
    self.p = "w\\:p";
    self.t = "w\\:t";
    self.page = "w\\:lastRenderedPageBreak";
    self.pStyle = "w\\:pStyle";
    self.val = "w:val"; //attribute for self.pStyle
    self.hyper = "w\\:hyperlink";
    self.anchor = "w:anchor";
    self.bookmark = "w\\:bookmarkStart";
    self.name = "w\\:name";
    self.pic = "pic\\:pic";
    self.blip = "a\\:blip";
    self.xmlnsPic = "xmlns:pic"; //attribute for self.pic
    self.embed = "r:embed"; //atrribute for self.blip

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
                    if (window.webkitURL) {
                        self.r = "r";
                        self.p = "p";
                        self.t = "t";
                        self.page = "lastRenderedPageBreak";
                        self.pStyle = "pStyle";
                        self.hyper = "hyperlink";
                        self.bookmark = "bookmarkStart";
                        self.name = "name";
                        self.pic = "pic";
                        self.blip = "blip";
                    }
                    
                    var xmlDoc = $.parseXML(text);

                    var id = 0;
                    var level = 0; //the level of headings - useful to create a hierarchy
                    var newLevel = 0;                  
                    var wordRootSection = new WordSection(id++, 0, null);
                    var currentSection = wordRootSection;
                    var parentSection = null;                    
                    
                    var paras = $(xmlDoc).find(self.p);                    
                    var contents = false;
                    paras.each(function(key) {
                        var para = paras[key];
                        var wordParagraph = new WordParagraph();
                        var section = false;
                        var caption = false;
                        //is this para a new heading or text?
                        //look for a pStyle tag to find if this para is a heading
                        var styles = $(para).find(self.pStyle);
                        
                        //check the paragraphs style for indication to its purpose
                        if (styles.length > 0) {
                            //style tag has been found, check if one matches a heading
                            styles.each(function(key) {
                                var style = styles[key];
                                var styleVal = $(style).attr(self.val);
                                //check if style is a heading and if so get heading level
                                if (styleVal.indexOf("Heading") !== -1) {
                                    if (styleVal.indexOf("TOC") !== -1){
                                        //table of contents
                                        contents = true;                               
                                        section = false;
                                    }else{
                                        //normal heading
                                        newLevel = parseInt(styleVal.substr(7)); //strip off the word heading
                                        section = true;
                                        contents = false;
                                    }                            
                                }else{
                                    section = false;
                                }
                                if (styleVal.indexOf("Caption") !== -1){
                                    wordParagraph.setCaption(true);
                                }
                            });
                        }
                        
                        //a new section?                        
                        if (section) {
                            //is the new section on a new level
                            if (newLevel > level){ //a level deeper in the hierarachy
                                parentSection = currentSection;
                                currentSection = new WordSection(id++, newLevel, parentSection);
                                level = newLevel;
                            }else{                                                      
                                if (newLevel < level){ //up one level in the hierarachy                                
                                    while (newLevel <= level){     
                                        currentSection.closeSection();
                                        parentSection = currentSection.getParentSection();
                                        currentSection = parentSection;
                                        level = currentSection.getLevel();
                                    }                      
                                    currentSection = new WordSection(id++, newLevel, parentSection);
                                    level = newLevel;
                                }else{
                                    if (newLevel === level){
                                        currentSection.closeSection();                               
                                        currentSection = new WordSection(id++, newLevel, currentSection.getParentSection());
                                    }
                                }
                            }
                        }
                        var rs = $(para).find(self.r);                        
                        rs.each(function(key) {                        
                            var r = rs[key];
                            var pics = $(r).find(self.pic); //check if this r block contains a pictur                            
                            if (pics.length > 0) {       
                                var pic = pics[0];
                                var picVal = $(pic).attr(self.xmlnsPic);
                                //check if style is a heading and if so get heading level
                                if (picVal.indexOf(PICTURE_FORMAT) !== -1) {
                                    //get rel id
                                    var blips = $(pic).find(self.blip);                                    
                                    var blip = blips[0];    
                                    wordParagraph.addPicture($(blip).attr(self.embed));
                                }                                
                            }else{
                                //not a picture so add text
                                var texts = $(r).find(self.t);
                                wordParagraph.addText(texts.text());  
                            }
                        });                        
                                        
                        //add the paragraph to the current section
                        if (section){
                            //add title for section                           
                            currentSection.addTitle(wordParagraph);
                            
                            //add anchor for section
                            var bookmarks = $(para).find(self.bookmark);
                            if (bookmarks.length > 0){
                                //bookmark found
                                bookmarks.each(function(key){
                                    var anchor = $(bookmarks[key]).attr(self.name);
                                    currentSection.setAnchor(anchor);
                                });
                            }
                        }else{
                            if (!contents)
                                currentSection.addPara(wordParagraph);
                        }                                            
                    });
                    
                    //close the last working section and everything depending on it
                    while(currentSection.closeSection()){
                        currentSection = currentSection.getParentSection();
                    }

                    self.word.setRootWordSection(currentSection);
                    
                    i++;
                    if (i === self.totalEntries) {
                        self.displayWord();
                    } else {
                        processEntries(entries, i);
                    }
                    
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
                            var filename, xmlDoc, rels, target, relID, imageName;
                            filename = entry.filename;
                            xmlDoc = $.parseXML(text);
                            rels = $(xmlDoc).find("Relationship");
                            if (rels.length) {
                                for (var j = 0; j < rels.length; j++) {
                                    if ($(rels[j]).attr("Type") === IMAGE_REL_TYPE) {
                                        target = $(rels[j]).attr("Target");
                                        relID = $(rels[j]).attr("Id");
                                        imageName = target.substring(target.lastIndexOf("/") + 1, target.lastIndexOf("."));
                                        slideImageRel = new SlideImageRel(relID, -1, imageName, false);
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
        var wordViewer = new WordViewer(self.word);
        wordViewer.displayOverview(self.word);
        wordViewer.displayImages(self.word);
        wordViewer.displayHeadingSections(self.word);
    };

}