function SlideImageRel(relID, slide, image) {
    var self = this;
    self.relID = relID;
    self.slide = slide;
    self.image = image; //this is just the name, not a PPT image
    self.change = null;

    self.setChange = function(change){
        self.change = change;
    };
    
    self.hasChange = function(){
        if (self.change !== null)
            return true;
        else
            return false;
    };
    
    self.getChange = function(){
        return self.change;
    };
    
    self.removeChange = function(){
        self.change = null;
    };
}