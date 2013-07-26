function PowerPointImage(name, format, data) {

    var self = this;
    self.name = name;
    self.format = format;
    self.data = data;
    self.url = getImageURL(data);
    self.licence = null;
    getImageLicence(data);


    function getImageURL(file) {
        if (window.webkitURL) {
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    }

    function getImageLicence(data) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var string = e.target.result;
            var binaryFile = new BinaryFile(string);
            var exif = EXIF.readFromBinaryFile(binaryFile);
            //console.log(exif.Artist);
            //console.log(exif.Copyright);
            self.licence = exif.Artist;
            console.log(self.name + "..." + self.format + "..." + exif.Artist + "..." + exif.ImageDescription + "..." + exif.Copyright);

        };
        reader.readAsBinaryString(data);
    }
    
}





