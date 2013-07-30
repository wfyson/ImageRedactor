/* 
 * A FlickrReader creates FlickrImages to send to a FlickrViewer
 * A FlickrImage details info, licence and possible sizes, along with URLs for
 * each size.
 */

function FlickrImage(imageID) {
    var self = this;
    self.imageID = imageID;
    self.author;
    self.title;
    self.sizes;
    self.licence;
    self.textLicence;
    
    self.setAuthor = function(author){
        self.author = author;
    };
    
    self.setTitle = function(title){
        self.title = title;
    };
    
    self.setLicence = function(licence){
        self.licence = licence;
        console.log("licencing");
        self.setTextLicence(licence);
    };
    
    //an array of all the sizes
    self.setSizes = function(sizes){
        self.sizes = sizes;
    };
    
    self.getResultsUrl = function(){
        for (var i = 0; i < self.sizes.length; i++){
            var size = self.sizes[i];
            if (size.label === "Thumbnail")
                return size.source;
        }
    };
    
    //may not be available so may need to accomodate this
    self.getMediumUrl = function(){
        for (var i = 0; i < self.sizes.length; i++){
            var size = self.sizes[i];
            if (size.label === "Medium")
                return size.source;
        }
    };
    
    self.getBiggestImage = function(){
        return self.sizes[self.sizes.length-1];
    };
    
    self.setTextLicence = function(licence){
      var intLicence = parseInt(licence);
      switch (intLicence) {
            case 4:
                self.textLicence = "Attribution (CC BY)";
                break;
            case 6:
                self.textLicence = "NoDerivs (CC BY-ND)";
                break;
            case 3:
                self.textLicence = "NonCommercial, NoDerivs (CC BY-NC-ND)";
                break;
            case 2:
                self.textLicence = "NonCommercial (CC BY-NC)";
                break;
            case 1:
                self.textLicence = "NonCommercial, ShareAlike (CC BY-NC-SA)";
                break;
            case 5:
                self.textLicence = "ShareAlike (CC BY-SA)";
                break;
        }
    };
}
