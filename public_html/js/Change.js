/* 
 * A Change is a record of an alteration that a user 
 * has made to the PowerPoint, but a new PowerPoint has
 * yet to be written.
 */

function Change(type, pptImage, newImageSrc, licence) {
    var self = this;
    self.type = type;
    self.pptImage = pptImage;
    self.newImageSrc = newImageSrc;
    self.licence = licence;
    self.author = null;
    
    self.setAuthor = function(author){
        self.author = author;
    };
    
    self.setTitle = function(title){
        self.title = title;
    };
    
    self.getType = function(){
        return self.type;
    };
    
    self.getAuthor = function(){
        return self.author;
    };      
    
    self.getTitle = function(){
        return self.title;
    };
            
};
