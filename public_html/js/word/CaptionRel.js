function CaptionRel(relID) {
    var self = this;
    self.relID = relID;
    self.caption = new Array();
    
    self.addCaption = function(text){
        self.caption.push(text);
    };

    self.getText = function(){
        var result = "";
        for (var i = 0; i < self.caption.length; i++) {
            result = result + self.caption[i];
        }
        return result;
    };
}