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
    
    self.setAuthor = function(author){
        self.author = author;
    };
    
    self.setTitle = function(title){
        self.title = title;
    };
    
    //an array of all the sizes
    self.setSizes = function(sizes){
        self.sizes = sizes;
    };
    
    self.getResultsUrl = function(){
        for (var i = 0; i < self.sizes.length; i++){
            var size = self.sizes[i];
            if (size.label === "Small")
                return size.source;
        }
    };
    
    self.getBiggestImage = function(){
        return self.sizes[self.sizes.length-1];
    };
}
