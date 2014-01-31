function CaptionRel(relID) {
    var self = this;
    self.relID = relID;
    self.caption = new Array();
    
    self.addCaption = function(text){
        self.caption.push(text);
    };
}