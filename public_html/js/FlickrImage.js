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
}
