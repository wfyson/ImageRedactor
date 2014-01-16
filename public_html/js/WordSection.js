function WordSection(id, level, parentSection) {

    var self = this;
    self.id = id;
    self.level = level;
    self.title = null;
    self.parentSection = parentSection;
    self.entries = new Array();
    self.page = null;
    
    self.getID = function(){
        return self.id;
    };
    
    self.getLevel = function(){
        return self.level;
    };
    
    self.addTitle = function(wordParagraph){
        self.title = wordParagraph;
    };
    
    self.getTitle = function(){
        return self.title.getParaText();
    };
    
    //add another section if one heading sits within another
    self.addSection = function(section){
        self.entries.push(section);         
    };

    //adds the contents of a <w:p> tag
    self.addPara = function(para){
        self.entries.push(para);
    };
    
    self.getEntries = function(){
        return self.entries;
    };
    
    self.getParentSection = function(){
        return self.parentSection;
    };
    
    //everything in this section has been accounted for, add it to it's parent
    self.closeSection = function(){
        if (self.parentSection !== null){
            self.parentSection.addSection(this);
            return true;
        }else{
            return false;
        }        
    };
    
    self.hasParent = function(){
        if (self.parentSection !== null){
            return true;
        }else{
            return false;
        }
    };
}





