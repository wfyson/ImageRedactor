function PowerPointImage(name, format, data) {

    var self = this;
    self.name = name;
    self.format = format;
    self.data = data;
    self.url = getImageURL(data);
    self.licence = null;
    self.author = null;
    self.width = null;
    self.height = null;
    getImageMetaData(data);


    function getImageURL(file) {
        if (window.webkitURL) {
            return window.webkitURL.createObjectURL(file);
        } else if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    }

    function getImageMetaData(data) {        
        //get sizes
        var img = new Image();
        img.src = self.url;
        img.onload = function(){
            self.width = this.width;
            self.height = this.height;
        };
        
        
        var reader = new FileReader();
        reader.onload = function(e) {
            var string = e.target.result;
            var binaryFile = new BinaryFile(string);
            var exif = EXIF.readFromBinaryFile(binaryFile);
            self.licence = exif.Copyright;
            self.author = exif.Artist;
            //console.log(self.name + "..." + self.format + "..." + exif.Artist + "..." + exif.ImageDescription + "..." + exif.Copyright);

        };
        reader.readAsBinaryString(data);
    }
    
}





