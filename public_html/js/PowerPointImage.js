function PowerPointImage(name, format, data) {

    var self = this;
    self.name = name;
    self.format = format;
    self.data = data;
    self.url = getImageURL(data);
    self.licence = getImageLicence(self.url, data);
}

function getImageURL(file) {
    if (window.webkitURL) {
        return window.webkitURL.createObjectURL(file);
    } else if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(file);
    } else {
        return null;
    }
}

function getImageLicence(url, data) {
    var img = document.createElement('img');
    $(img).attr("src", url);
    $('#imageList').append(img);

    var reader = new FileReader();    
    reader.onload = function (oFREvent) {
        var string = oFREvent.target.result;
        var binaryFile = new BinaryFile(string);
        var exif = EXIF.readFromBinaryFile(binaryFile);
        //console.log(exif);
        //console.log(exif.Artist);
        //console.log(self.name + "..." + self.format + "..." + exif.Artist);
        
    }; 
    reader.readAsBinaryString(data);
}
    







