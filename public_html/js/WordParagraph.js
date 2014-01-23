function WordParagraph(){
    
    var self = this;
    self.entries = new Array();
    self.caption = false;

    //adds the contents of a <w:t> tag
    self.addText = function(text){
        self.entries.push(text);
    };
    
    //puts the various text entries together to display the paragraph
    self.getParaText = function(){
        var result = "";
        for (var i = 0; i < self.entries.length; i++) {
            result = result + self.entries[i];
        }
        return result;
    };
    
    self.getEntries = function(){
        return self.entries;
    };
    
    self.addPicture = function(relID){        
        self.entries.push(new RelID(relID));
    };
    
    self.setCaption = function(caption){
        self.caption = caption;
    };
    
    self.getCaption = function(){
        return self.caption;
    };
}

//a rel objectthat can be checked when iterating over entries
function RelID(relID){        
    var self = this;
    self.RelID = relID;
    
    self.getRelID = function(){
        return self.RelID;
    };    
}