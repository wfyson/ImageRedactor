function PowerPointWriter() {

    var self = this;

    self.writePowerPoint = function() {
        console.log("hello");
        // use a BlobWriter to store the zip into a Blob object
        zip.createWriter(new zip.BlobWriter(), function(writer) {

            // use a TextReader to read the String to add
            writer.add("filename.txt", new zip.TextReader("test!"), function() {
                // onsuccess callback

                // close the zip writer
                writer.close(function(blob) {
                    // blob contains the zip file as a Blob object
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
                    $('#download').attr('download', "super.zip");
                    console.log("done");
                });
            }, function(currentIndex, totalIndex) {
                // onprogress callback
            });
        }, function(error) {
            // onerror callback
        });

    };
}


