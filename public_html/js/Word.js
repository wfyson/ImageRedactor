function Word(wordFile){

    var self = this;
    self.wordImageArray = new Array();
    self.slideImageRelArray = new Array();  
    self.wordFile = wordFile;

    self.setImageRelArray = function(slideImageRelArray){
        self.slideImageRelArray = slideImageRelArray;
    };
    
    self.getImageRelArray = function(){
        return self.slideImageRelArray;
    };

    self.addImage = function(pptImage){
        self.wordImageArray.push(pptImage);
    };
    
    self.addSlideImageRel = function(slideImageRel){
        self.slideImageRelArray.push(slideImageRel);
    };
    
    self.getWordImageArray = function(){
        return self.wordImageArray;
    };
    
    self.getWordImage = function(imageName){
        for (var i = 0; i < self.wordImageArray.length; i++){
            if (self.wordImageArray[i].name === imageName){
                return self.wordImageArray[i];
            }
        }
        return false;
    };
    
    //gets all the rels that pertain to a particular image
    self.getImageRels = function(imageName){
        var rels = self.slideImageRelArray;
        var returnArray = new Array();
        for (var i = 0; i < rels.length; i++){
            if (rels[i].image === imageName){
                returnArray.push(rels[i]);
            }
        }
        return returnArray;        
    };
    
    self.getImageArray = function(){
        return self.wordImageArray;
    };

}


