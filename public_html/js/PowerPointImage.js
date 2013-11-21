function PowerPointImage(name, format, data, callback) {
    var self = this;
    self.name = name;
    self.format = format;
    self.data = data;
    self.url = getImageURL(data);
    self.licence = null;
    self.author = null;
    self.width = null;
    self.height = null;
    getImageMetaData(data, format);
    //self.callback = callback;


    function getImageURL(file) {
        if (window.webkitURL) {
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    }

    function getImageMetaData(blob, format) {
        if (self.format === ".jpeg" || self.format === ".jpg"){    //or perhaps others???
            //upload the images
            
            var filename = self.name + self.format;
            //console.log(filename);  //may want to make this somewhat random and keep a reference to avoid conflicts

            var img = new Image();
            img.src = self.url;
            img.onload = function() {
                //some of this may be deletable                                    
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);

                var dataURL = canvas.toDataURL("image/jpeg");

                var postURL = (dataURL.substr(dataURL.lastIndexOf('base64') + 7));

                var fd = new FormData();
                fd.append('fname', filename);
                fd.append('data', postURL);
                $.ajax({
                    type: 'POST',
                    url: 'php/imagewriter.php',
                    data: fd,
                    processData: false,
                    contentType: false
                });
            };
        }
        
        //get sizes
        var img = new Image();
        img.src = self.url;
        img.onload = function() {
            self.width = this.width;
            self.height = this.height;
        };
        
        //get exif
        if (self.format === ".jpeg" || self.format === ".jpg"){
            var reader = new FileReader();
            reader.onload = function(e) {
                var string = e.target.result;
                var binaryFile = new BinaryFile(string);
                var exif = EXIF.readFromBinaryFile(binaryFile);
                self.licence = exif.Copyright;
                self.author = exif.Artist;
                //console.log(self.name + "..." + self.format + "..." + exif.Artist + "..." + exif.ImageDescription + "..." + exif.Copyright);         
                callback(self);
            };
            reader.readAsBinaryString(data);
        }else{
            self.licence = "null";
            self.author = "null";
            callback(self);
        }
    }

}





