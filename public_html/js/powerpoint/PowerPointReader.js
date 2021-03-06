function PowerPointReader(name, pptFile) {

    var self = this;
    self.pptFile = pptFile;
    self.noEntries = 0;
    self.totalEntries;
    self.powerpoint = new PowerPoint(name, pptFile);
        
    var IMAGE_REL_TYPE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

    self.readPowerPoint = function() {
        // use a BlobReader to read the zip from a Blob object
        zip.createReader(new zip.BlobReader(self.pptFile), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
                if (entries.length){
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

            //if media file then create a PowerPointImage
            if ((entry.filename).indexOf("ppt/media/") !== -1) {
                //get the data for that media
                entry.getData(new zip.BlobWriter(), function(data, entry) {
                    var filename, pptImage, name, format;
                    filename = entry.filename;
                    name = filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf("."));
                    format = filename.substr(filename.lastIndexOf("."));
                    pptImage = new PowerPointImage(name, format, data, function(pptImage) {
                        self.powerpoint.addImage(pptImage);
                        i++;
                        if (i === self.totalEntries) {
                            self.displayPpt();
                        } else {
                            processEntries(entries, i);
                        }
                    });
                }, function(current, total) {
                    // onprogress callback
                });
            } else {
                //if a slides rel file
                if ((entry.filename).indexOf("ppt/slides/_rels") !== -1) {
                    entry.getData(new zip.TextWriter('utf-8'), function(text, entry) {
                        var filename, slideNo, xmlDoc, rels, relID, target, imageName;
                        filename = entry.filename;
                        slideNo = filename.substring(filename.lastIndexOf("/") + 1, filename.indexOf("."));
                        xmlDoc = $.parseXML(text);
                        rels = $(xmlDoc).find("Relationship");
                        if (rels.length) {
                            for (var j = 0; j < rels.length; j++) {
                                if ($(rels[j]).attr("Type") === IMAGE_REL_TYPE) {
                                    target = $(rels[j]).attr("Target");
                                    relID = $(rels[j]).attr("Id");
                                    imageName = target.substring(target.lastIndexOf("/") + 1, target.lastIndexOf("."));
                                    slideImageRel = new SlideImageRel(relID, slideNo, imageName, false);
                                    self.powerpoint.addSlideImageRel(slideImageRel);
                                }
                            }
                        }

                        i++;
                        if (i === self.totalEntries) {
                            self.displayPpt();
                        } else {
                            processEntries(entries, i);
                        }

                        //self.increment();
                    }, function(current, total) {
                        //onprogress callback
                    });
                } else {
                    //if slideMasters rels (for getting background images which have been applied to multiple slides)
                    if ((entry.filename).indexOf("ppt/slideMasters/_rels") !== -1){
                        entry.getData(new zip.TextWriter('utf-8'), function(text, entry) {
                            
                            var filename, slideNo, xmlDoc, rels, relID, target, imageName;
                            filename = entry.filename;                            
                            xmlDoc = $.parseXML(text);
                            rels = $(xmlDoc).find("Relationship");
                            if (rels.length) {
                                for (var j = 0; j < rels.length; j++) {
                                    if ($(rels[j]).attr("Type") === IMAGE_REL_TYPE) {
                                        target = $(rels[j]).attr("Target");
                                        relID = $(rels[j]).attr("Id");
                                        imageName = target.substring(target.lastIndexOf("/") + 1, target.lastIndexOf("."));
                                        slideImageRel = new SlideImageRel(relID, -1, imageName, true);
                                        self.powerpoint.addSlideImageRel(slideImageRel);
                                    }
                                }
                            }

                            i++;
                            if (i === self.totalEntries) {
                                self.displayPpt();
                            } else {
                                processEntries(entries, i);
                            }
                                                        
                        }, function(current, total){
                            //onprogress callback
                        });              
                    }else{                    
                        //if presentation.xml
                        if ((entry.filename).indexOf("ppt/presentation.xml") !== -1) {
                            entry.getData(new zip.TextWriter('utf-8'), function(text, entry) {
                                var xmlDoc;
                                xmlDoc = $.parseXML(text);

                                //get tag format depending on browser
                                var sldSz = "p\\:sldSz";
                                if (window.webkitURL) {
                                    sldSz = "sldSz";
                                }

                                size = $(xmlDoc).find(sldSz);
                                if (size.length) {
                                    self.powerpoint.setSlideHeight($(size[0]).attr("cy"));
                                }
                                i++;
                                if (i === self.totalEntries) {
                                    self.displayPpt();
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
                                self.displayPpt();
                            } else {
                                processEntries(entries, i);
                            }
                        }
                    }
                }
            }
        }
    };
         
    self.callbackTest = function() {
        console.log("Job Done...");
    };

    self.displayPpt = function() {
        $('#redactBtn').data("redactor").setPpt(self.powerpoint);
        
        $('#redactBtn').addClass("disabled");
        //console.log($('#download a'));
        $('#download a').attr('href', '')
            .attr('download', '')
            .empty();
                
        
        
        var powerPointViewer = new PowerPointViewer(self.powerpoint);
        powerPointViewer.displayOverview(self.powerpoint);
        powerPointViewer.displayImages(self.powerpoint);
    };

}