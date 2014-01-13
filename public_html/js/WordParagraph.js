function WordParagraph(){
    
    var self = this;
    self.entries = new Array();
    
    //adds the contents of a <w:t> tag
    self.addText = function(text){
        self.entries.push(text);
    };
    
    //puts the various text entries together to display the paragraph
    self.getParaText = function(){
        var result = null;
        for (var i = 0; i < self.entries.length; i++) {
            result = result + self.entries[i];
        }
        return result;
    };
}