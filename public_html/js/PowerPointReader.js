function PowerPointReader(pptFile) {

    var self = this;
    self.pptFile = pptFile;

    var IMAGE_REL_TYPE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.BlobReader(self.pptFile), function(reader) {
        // get all entries from the zip
        reader.getEntries(function(entries) {
            if (entries.length) {
                var pptImageArray = new Array();
                for (var i = 0; i < entries.length; i++) {
                    //if media file then create a PowerPointImage
                    if ((entries[i].filename).indexOf("ppt/media/") !== -1) {                         
                        //get the data for that media
                        entries[i].getData(new zip.BlobWriter(), function(data, entry) {                         
                            var filename, pptImage, name, format;
                            filename = entry.filename;
                            name = filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf("."));
                            format = filename.substr(filename.lastIndexOf("."));
                            pptImage = new PowerPointImage(name, format, data);
                            pptImageArray.push(pptImage);
                            reader.close();
                        }, function(current, total) {
                            // onprogress callback
                        });
                    }
                    //if a slides rel file
                    if ((entries[i].filename).indexOf("ppt/slides/_rels") !== -1) {                        
                        entries[i].getData(new zip.TextWriter(), function(text, entry) {
                            var filename, slideNo, xmlDoc, rels, target, imageName;
                            filename = entry.filename;
                            slideNo = filename.substring(filename.lastIndexOf("/") + 1, filename.indexOf("."));                            
                            xmlDoc = $.parseXML(text);
                            rels = $(xmlDoc).find("Relationship");
                            if (rels.length) {
                                for (var j = 0; j < rels.length; j++) {
                                    if($(rels[j]).attr("Type") === IMAGE_REL_TYPE){
                                        target = $(rels[j]).attr("Target");
                                        imageName = target.substring(target.lastIndexOf("/") + 1, target.lastIndexOf("."));
                                        console.log(slideNo + "..." + imageName);
                                    }
                                }
                            }
                            reader.close();
                        }, function(current, total) {
                            //onprogress callback
                        });
                    }
                    //if a slide's rels file, get the images found in that file
                }
            }
        });
    }, function(error) {
        // onerror callback
    });
}