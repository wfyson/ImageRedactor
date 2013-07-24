function PowerPointWriter(ppt) {

    var self = this;
    self.ppt = ppt;
    self.entries = new Array();
    self.entriesCount = 0;
    self.rels = ppt.getImageRelArray();



    self.readPowerPoint = function() {
        console.log("reading...");
        //read all powerpoint entries
        zip.createReader(new zip.BlobReader(self.ppt.pptFile), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
                if (entries.length) {
                    self.totalEntries = entries.length;
                    for (var i = 0; i < entries.length; i++) {
                        entries[i].getData(new zip.BlobWriter(), function(data, entry) {
                            self.entries.push(new EntryData(data, entry.filename));
                            if (self.entries.length === entries.length) {
                                self.writePowerPoint(self.entries);
                            }
                        });
                    }
                }
            });
        });
    };

    self.writePowerPoint = function(contents) {

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
                            if (fileName.indexOf("ppt/media") !== -1) {
                                //in the media directory

                                //record image as having yet to be changed
                                var imageChanged = false;

                                //now get all the rels relating to this file
                                var imageName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.lastIndexOf("."));
                                var imageRels = self.ppt.getImageRels(imageName);

                                for (var i = 0; i < imageRels.length; i++) {
                                    var imageRel = imageRels[i];
                                    if (imageRel.hasChange()) {
                                        //write the change to the powerpoint
                                        var change = imageRel.getChange();

                                        //image has yet to be changed, so write the change...
                                        if (!imageChanged) {
                                            imageChanged = true;
                                            var img = new Image();
                                            img.src = change.newImageSrc;
                                            img.onload = function() {
                                                if (change.getType() === "placeholder") {

                                                    //some of this may be deletable                                    
                                                    var canvas = document.createElement("canvas");
                                                    canvas.width = this.width;
                                                    canvas.height = this.height;

                                                    var ctx = canvas.getContext("2d");
                                                    ctx.drawImage(this, 0, 0);

                                                    var dataURL = canvas.toDataURL("image/jpg");

                                                    zipWriter.add(fileName, new zip.Data64URIReader(dataURL), function() {
                                                        add(fileIndex + 1);
                                                    }, onProgress);
                                                }
                                                if (change.getType() === "flickr") {
                                                    console.log("flickrChange");
                                                }
                                            };
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
                                zipWriter.add(fileName, new zip.BlobReader(files[fileIndex].data), function() {
                                    //update the global writer
                                    $('#download').data("writer", zipWriter);
                                    add(fileIndex + 1); /* [1] add the next file */
                                }, onProgress);
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
                //in the real thing a download link will be made available
                $('#download').removeClass('disabled');
                $('#download').attr('href', blobURL);
                $('#download').attr('download', "super.pptx");
                console.log("done");
            });
        });
    };
}

function EntryData(data, name) {

    var self = this;
    self.data = data;
    self.name = name;
}


/*
function myCallbackFunction(data) {
    console.log("jsonp");

    var img = new Image();
    img.src = data.sizes.size[0].source;
    img.onload = function() {

        var zipWriter = $('#download').data("writer");
        var fileName = $('#download').data("filename");
        var fileIndex = $('#download').data("fileindex");
        //some of this may be deletable                                    
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(dataURL);

        zipWriter.add(fileName, new zip.Data64URIReader(dataURL), function() {
            //update the global writer
            $('#download').data("writer", zipWriter);
            add(fileIndex + 1);
        }, function() {
        });


    }
}*/