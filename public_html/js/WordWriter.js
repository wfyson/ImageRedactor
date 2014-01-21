/*
 * Writes a list of changes to the word document, replacing images with new ones
 * chosen by the user and removing text from redacted sections of the document.
 */

function WordWriter(word) {

    var REDACTED_HEADING = '<w:r><w:t>This section has been redacted</w:t></w:r>';
    var REDACTED_TEXT = '<w:r><w:t>Content redacted</w:t></w:r>';

    var self = this;
    self.word = word;
    self.redactor = $('#redactBtn').data("redactor");
    self.entries = new Array();
    self.entriesCount = 0;
    self.rels = word.getImageRelArray();
    
    //variables to represent tags in word xml
    self.p = "w\\:p";
    self.r = "w\\:r";
    self.t = "w\\:t";
    self.page = "w\\:lastRenderedPageBreak";
    self.pStyle = "w:\\pStyle";
    self.val = "w:val";
    self.hyper = "w\\:hyperlink";
    self.anchor = "w:anchor";
    self.bookmark = "w:\\bookmarkStart";
    
    self.readWord = function() {
        console.log("reading...");
         
         //read all word entries
        zip.createReader(new zip.BlobReader(self.word.wordFile), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
                self.totalEntries = entries.length;
                processEntries(entries, 0);
            });
        }, function(error) {
            console.log(error);
        });
        
        function processEntries(entries, i){
            var entry = entries[i];
            var entries = entries;            
            
            if (entry.filename.substr(entry.filename.lastIndexOf(".")) === ".xml") {
                entry.getData(new zip.TextWriter('utf-8'), function(text, entry){
                    self.entries.push(new EntryData(text, entry.filename));
                    i++;
                    if (i === self.totalEntries) {
                        self.writeWord(self.entries);
                    } else {
                        processEntries(entries, i);
                    }
                });
            } else {
                entry.getData(new zip.BlobWriter(), function(data, entry) {
                    self.entries.push(new EntryData(data, entry.filename));
                    i++;
                    if (i === self.totalEntries) {
                        self.writeWord(self.entries);
                    } else {
                        processEntries(entries, i);
                    }
                });
            }            
        }
    };

    self.writeWord = function(contents) {

        function onProgress(a, b) {
            //console.log("current", a, "end", b);
        }

        //zip.workerScriptsPath = "/js/zip/";
        //zip.useWebWorkers = false;

        var zipper = (function() {

            var zipWriter;

            return {
                addTexts: function(files, callback /* [2] new parameter */) {

                    function add(fileIndex) {
                        if (fileIndex < files.length) {
                            //console.log(files[fileIndex].name);
                            //console.log(files[fileIndex].name.indexOf("image1.jpeg"));

                            var fileName = files[fileIndex].name;
                          
                            
                            $('#download').data("filename", fileName);
                            $('#download').data("fileindex", fileIndex);
                            if (fileName.indexOf("word/document.xml") !== -1){
                                if (window.webkitURL) {
                                    self.p = "p";
                                    self.r = "r";
                                    self.t = "t";
                                    self.page = "lastRenderedPageBreak";
                                    self.pStyle = "pStyle";
                                    self.hyper = "hyperlink";
                                }
                                
                                var xmlDoc = $.parseXML(files[fileIndex].data);
                                var id = 0;
                                var redact = false;
                                
                                
                                var paras = $(xmlDoc).find(self.p);
                                var contents = false;
                                paras.each(function(key) {
                                    var $para = $(paras[key]);
                                    var section = false;
                                    //is this para a new heading or text?
                                    //look for a pStyle tag to find if this para is a heading
                                    var styles = $para.find(self.pStyle);
                                    if (styles.length > 0) {
                                        //style tag has been found, check if one matches a heading
                                        styles.each(function(key) {
                                            var style = styles[key];
                                            var styleVal = $(style).attr(self.val);
                                            //check if style is a heading and if so get heading level
                                            if (styleVal.indexOf("Heading") !== -1){
                                                if(styleVal.indexOf("TOC") !== -1){
                                                    //contents section
                                                    contents = true;
                                                }else{                                           
                                                    section = true;
                                                    contents = false;
                                                }
                                            }else{
                                                section = false;
                                            }
                                        });
                                    }
                                    //a new section?                        
                                    if (section) {                                        
                                        id++;                                        
                                        if (self.redactor.isSectionChange(id)){
                                            redact = true; //this section and its paragraphs need redacting                                                                                        
                                            
                                            //this section needs redacting, remove all <w:t> tags
                                            $para.find(self.t + ":first").text("Heading redacted");
                                            $para.find(self.t + ":gt(0)").remove(); 

                                        }else{
                                            redact = false; //this section and its paragraphs do not need redacting
                                        }
                                    } else {
                                        //normal paragraph, redact if necessary
                                        if (redact) {
                                            //this section needs redacting, remove all <w:t> tags
                                            $para.find(self.t + ":first").text("Content redacted");
                                            $para.find(self.t + ":gt(0)").remove();                                            
                                        }
                                    }
                                    //a contents section?
                                    if (contents){
                                        //get the anchor 
                                        var hyperlinks = $para.find(self.hyper);
                                        var anchor = null;
                                        if (hyperlinks.length > 0) {
                                            //hyperlink found                                 
                                            hyperlinks.each(function(key) {
                                                var hyper = hyperlinks[key];
                                                anchor = $(hyper).attr(self.anchor);
                                            });
                                        }
                                        if (self.redactor.isAnchorChange(anchor)) {
                                            $para.find(self.t + ":first").text("Content redacted");
                                            $para.find(self.t + ":gt(0)").remove();
                                        }
                                    }
                                });             
                                
                                
                                var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);   
                                //all changes made, write the file
                                zipWriter.add(fileName, new zip.TextReader(xmlString), function() {
                                        //update the global writer
                                        $('#download').data("writer", zipWriter);
                                        add(fileIndex + 1); /* [1] add the next file */
                                    }, onProgress);
                                
                                
                            }else{
                            
                            if (fileName.indexOf("word/media") !== -1) {                              
                                //in the media directory
                                //record image as having yet to be changed
                                var imageChanged = false;

                                //now get all the rels relating to this file
                                var imageName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.lastIndexOf("."));
                                var imageRels = self.word.getImageRels(imageName);
                                for (var i = 0; i < imageRels.length; i++) {                                    
                                    var imageRel = imageRels[i];
                                    if (imageRel.hasChange()) {

                                        //write the change to the powerpoint
                                        var change = imageRel.getChange();

                                        //image has yet to be changed, so write the change...
                                        if (!imageChanged) {
                                            imageChanged = true;
                                            if (change.getType() === "placeholder") {
                                                var newSrc = change.newImageSrc;
                                                var licence = change.licence;
                                                var phpUrl = "php/imagegrabber.php?callback=?";
                                                $.getJSON(phpUrl, {src: newSrc, licence: licence, changeType: "placeholder"},
                                                function(res) {
                                                    zipWriter.add(fileName, new zip.Data64URIReader(res.result), function() {
                                                        //update the global writer
                                                        $('#download').data("writer", zipWriter);
                                                        add(fileIndex + 1);
                                                    }, function() {
                                                    });
                                                });       
                                            }

                                            if (change.getType() === "cc") {
                                                var newSrc = change.newImageSrc;
                                                var licence = change.licence;
                                                var phpUrl = "php/imagegrabber.php?callback=?";
                                                $.getJSON(phpUrl, {src: newSrc, licence: licence, changeType: "cc"},
                                                function(res) {
                                                    zipWriter.add(fileName, new zip.Data64URIReader(res.result), function() {
                                                        //update the global writer
                                                        $('#download').data("writer", zipWriter);
                                                        add(fileIndex + 1);
                                                    }, function() {
                                                    });
                                                });
                                            }

                                            if (change.getType() === "flickr") {
                                                var newSrc = change.newImageSrc;
                                                var licence = change.licence;
                                                var phpUrl = "php/imagegrabber.php?callback=?";
                                                $.getJSON(phpUrl, {src: newSrc, licence: licence, changeType: "flickr"},
                                                function(res) {
                                                    zipWriter.add(fileName, new zip.Data64URIReader(res.result), function() {
                                                        //update the global writer
                                                        $('#download').data("writer", zipWriter);
                                                        add(fileIndex + 1);
                                                    }, function() {
                                                    });
                                                });
                                            }
                                        }

                                        //if the image format has changed then the powerpoint slide rels need to be updated
                                        //TODO!!!! (possibly)    

                                    } else {
                                        //there is no change to commit for this rel
                                        //just write the original image
                                        if (!imageChanged) {
                                            imageChanged = true;
                                            zipWriter.add(fileName, new zip.BlobReader(files[fileIndex].data), function() {
                                                //update the global writer
                                                $('#download').data("writer", zipWriter);
                                                add(fileIndex + 1); /* [1] add the next file */
                                            }, onProgress);
                                        }
                                    }
                                }
                            } else {
                                //not a media file, just write like normal
                                if (fileName.substr(fileName.lastIndexOf(".")) === ".xml"){
                                    zipWriter.add(fileName, new zip.TextReader(self.entries[fileIndex].data), function() {
                                        //update the global writer
                                        $('#download').data("writer", zipWriter);
                                        add(fileIndex + 1); /* [1] add the next file */
                                    }, onProgress);
                                }else{
                                    zipWriter.add(fileName, new zip.BlobReader(self.entries[fileIndex].data), function() {
                                        //update the global writer
                                        $('#download').data("writer", zipWriter);
                                        add(fileIndex + 1); /* [1] add the next file */
                                    }, onProgress);
                                }
                            }
                            }
                        } else {
                            callback() /* [2] no more files to add: callback is called */;
                        }
                    }

                    zip.createWriter(new zip.BlobWriter(), function(writer) {
                        zipWriter = writer;

                        //add the writer to the download button
                        $('#download').data("writer", zipWriter);

                        add(0); /* [1] add the first file */
                    });
                },
                getBlob: function(callback) {
                    zipWriter.close(callback);
                }
            };
        })();

        //all changes have been made to the document.. now write it
        zipper.addTexts(contents, function() {
            zipper.getBlob(function(blob) {
                var blobURL;
                if (window.webkitURL) {
                    blobURL = window.webkitURL.createObjectURL(blob);
                } else if (window.URL && window.URL.createObjectURL) {
                    blobURL = window.URL.createObjectURL(blob);
                } else {
                    blobURL = null;
                }
                $('#downloadLoading').hide();
                $('#downloadLabel').show();
                var a = document.createElement('a');
                
                var filename = word.name.substring(0, word.name.lastIndexOf(".docx")) + "_redacted.docx";
                $(a).attr('id', 'downloadLink');
                $(a).attr('href', blobURL);
                $(a).attr('download', filename);
                $(a).append(filename);
                $('#download').append($(a));            
                
                console.log("done");
            });
        });
    };

    self.increment = function() {
        self.entriesCount++;
        //console.log(self.entriesCount);
        if (self.entriesCount === self.totalEntries) {
            console.log("writing");
            self.writeWord(self.entries);
        }
    };
}

function EntryData(data, name) {

    var self = this;
    self.data = data;
    self.name = name;
}
