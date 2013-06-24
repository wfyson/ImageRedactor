function PowerPointWriter(ppt) {

    var self = this;
    self.ppt = ppt;
    self.entries = new Array();
    self.entriesCount = 0;



    self.readPowerPoint = function() {

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
                            if (files[fileIndex].name.indexOf("image1.jpeg") !== -1) {
                                
                                console.log("hello");

                                var img = new Image();
                                img.src = 'img/placeholder.jpg';
                                img.onload = function() {
                                    
                                    //some of this may be deletable
                                    
                                    var canvas = document.createElement("canvas");
                                    canvas.width = this.width;
                                    canvas.height = this.height;

                                    var ctx = canvas.getContext("2d");
                                    ctx.drawImage(this, 0, 0);

                                    var dataURL = canvas.toDataURL("image/jpeg");

                                    zipWriter.add(files[fileIndex].name, new zip.Data64URIReader(dataURL), function() {
                                        add(fileIndex + 1);
                                    }, onProgress);
                                }
                            } else {
                                console.log("world");
                                zipWriter.add(files[fileIndex].name, new zip.BlobReader(files[fileIndex].data), function() {
                                    add(fileIndex + 1); /* [1] add the next file */
                                }, onProgress);
                            }
                        } else {
                            callback() /* [2] no more files to add: callback is called */;
                        }
                    }

                    zip.createWriter(new zip.BlobWriter(), function(writer) {
                        zipWriter = writer;
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
                $('#download').attr('href', blobURL);
                $('#download').attr('download', "super.pptx");
                console.log("done");
            });
        });
    }
}

function EntryData(data, name) {

    var self = this;
    self.data = data;
    self.name = name;
}


