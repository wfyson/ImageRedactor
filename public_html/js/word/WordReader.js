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
    self.relID = null;

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

                    self.id = 0;
                    self.level = 0; //the level of headings - useful to create a hierarchy
                    self.newLevel = 0;                  
                    self.wordRootSection = new WordSection(self.id++, 0, null);
                    self.currentSection = self.wordRootSection;
                    self.parentSection = null;                    
                    
                    self.paras = $(xmlDoc).find(self.p);                    
                    self.contents = false;
                    self.paras.each(function(key) {
                        var para = self.paras[key];
                        self.readPara(para);                                                              
                    });
                    
                    //close the last working section and everything depending on it
                    while(self.currentSection.closeSection()){
                        self.currentSection = self.currentSection.getParentSection();
                    }
                    self.word.setRootWordSection(self.currentSection);
                    
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
    
    self.readPara = function(para){               
        
        var wordParagraph = new WordParagraph();
        var section = false;
        var caption = false;
        var captionText = "";
        var relID;
        //is this para a new heading or text?
        //look for a pStyle tag to find if this para is a heading
        var styles = $(para).children("w\\:pPr").find(self.pStyle);

        //check the paragraphs style for indication to its purpose
        if (styles.length > 0) {
            //style tag has been found, check if one matches a heading
            styles.each(function(key) {
                var style = styles[key];
                var styleVal = $(style).attr(self.val);
                //check if style is a heading and if so get heading level
                if (styleVal.indexOf("Heading") !== -1) {
                    if (styleVal.indexOf("TOC") !== -1) {
                        //table of contents
                        self.contents = true;
                        section = false;
                    } else {
                        //normal heading
                        self.newLevel = parseInt(styleVal.substr(7)); //strip off the word heading
                        section = true;
                        self.contents = false;
                    }
                } else {
                    section = false;
                }
                if (styleVal.indexOf("Caption") !== -1) {
                    caption = true;
                    wordParagraph.setCaption(true);
                }
            });
        }

        //a new section?                        
        if (section) {
            //is the new section on a new level
            if (self.newLevel > self.level) { //a level deeper in the hierarachy
                self.parentSection = self.currentSection;
                self.currentSection = new WordSection(self.id++, self.newLevel, self.parentSection);
                self.level = self.newLevel;
            } else {
                if (self.newLevel < self.level) { //up one level in the hierarachy                                
                    while (self.newLevel <= self.level) {
                        self.currentSection.closeSection();
                        self.parentSection = self.currentSection.getParentSection();
                        self.currentSection = self.parentSection;
                        self.level = self.currentSection.getLevel();
                    }
                    self.currentSection = new WordSection(self.id++, self.newLevel, self.parentSection);
                    self.level = self.newLevel;
                } else {
                    if (self.newLevel === self.level) {
                        self.currentSection.closeSection();
                        self.currentSection = new WordSection(self.id++, self.newLevel, self.currentSection.getParentSection());
                    }
                }
            }
        }
        //console.log($(para).children());
        var rs = $(para).children("w\\:r");
        rs.each(function(key) {
            var r = rs[key];
            var pics = $(r).find(self.pic); //check if this r block contains a picture                            
            if (pics.length > 0) {
                var pic = pics[0];
                var picVal = $(pic).attr(self.xmlnsPic);                              
                if (picVal.indexOf(PICTURE_FORMAT) !== -1) {
                    //get rel id
                    var blips = $(pic).find(self.blip);
                    var blip = blips[0];
                    self.relID = $(blip).attr(self.embed);
                    wordParagraph.addPicture(self.relID);
                }
            }
            
            //add the text
            var texts = $(r).children("w\\:t");
            wordParagraph.addText(texts.text());    
            captionText = captionText + texts.text();
        });
        
        //add caption if paragraph is one
        if ((caption) && (self.relID !== null)){            
            self.word.addCaption(self.relID, captionText);
            self.relID = null;
        }
        

        //add the paragraph to the current section
        if (section) {
            //add title for section                           
            self.currentSection.addTitle(wordParagraph);

            //add anchor for section
            var bookmarks = $(para).find(self.bookmark);
            if (bookmarks.length > 0) {
                //bookmark found
                bookmarks.each(function(key) {
                    var anchor = $(bookmarks[key]).attr(self.name);
                    self.currentSection.setAnchor(anchor);
                });
            }
        } else {
            if (!self.contents)
                self.currentSection.addPara(wordParagraph);
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