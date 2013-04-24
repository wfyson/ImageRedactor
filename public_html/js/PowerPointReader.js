function PowerPointReader(pptFile) {

    var self = this;
    self.pptFile = pptFile;

    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.BlobReader(self.pptFile), function(reader) {
        // get all entries from the zip
        reader.getEntries(function(entries) {
            if (entries.length) {
                var pptImageArray = new Array();
                var pptImage, filename, name, format, slideNo;
                for (var i = 0; i < entries.length; i++) {                    
                    filename = entries[i].filename;
                    //if media file then create a PowerPointImage
                    if (filename.indexOf("ppt/media/") !== -1) {
                        //get the name for that media
                        name = filename.substring(10, filename.lastIndexOf("."));
                        format = filename.substr(filename.lastIndexOf("."));
                        //get the data for that media
                        entries[i].getData(new zip.BlobWriter(), function(data) {
                            reader.close();
                            pptImage = new PowerPointImage(name, format, data);
                            pptImageArray.push(pptImage);
                        }, function(current, total) {
                            // onprogress callback
                        });
                    }
                    //if a slides rel file
                    if (filename.indexOf("ppt/slides/_rels") !== -1){
                        slideNo = filename.substring(filename.lastIndexOf("/")+1, filename.indexOf("."));
                        entries[i].getData(new zip.TextWriter(), function(text){
                            reader.close();
                        }, function(current, total){
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