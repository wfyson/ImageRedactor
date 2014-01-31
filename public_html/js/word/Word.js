function Word(name, wordFile){

    var self = this;
    self.name = name;
    self.rootWordSection = null;
    self.contentsSection = null;
    self.wordImageArray = new Array();
    self.slideImageRelArray = new Array();  
    self.wordFile = wordFile;
    self.captionArray = new Array();

    self.getRootWordSection = function(){
        return self.rootWordSection;
    };

    self.setRootWordSection = function(wordSection){
        self.rootWordSection = wordSection;
    };
    
    self.getContentsSection = function(){
        return self.contentsSection;
    };

    self.setContentsSection = function(contentsSection){
        self.contentsSection = contentsSection;
    };

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
    
    //gets an image from a given rel
    self.getRelImage = function(relID){
        var rels = self.slideImageRelArray;
        var imageName = false;
        for (var i = 0; i < rels.length; i++){
            if (rels[i].relID === relID)
                imageName = rels[i].image;
        }
        if (imageName){
            return self.getWordImage(imageName);
        }else{
            return false;
        }
    };
    
    self.getImageArray = function(){
        return self.wordImageArray;
    };
    
    self.addCaption = function(relID, text){
        
        console.log("geronimo");
        console.log(relID);
        console.log(text);
        var rels = self.captionArray;
        var relIDs = new Array();
        var captionUnset = true;
        for (var i = 0; i < rels.length; i++){
            if (rels[i].relID === relID){
                rels[i].setCaption(text);
                captionUnset = false;
                break;
            } 
        }
        if (captionUnset){
            var captionRel = new CaptionRel(relID);
            captionRel.addCaption(text);
            self.captionArray.push(captionRel);s
        }
    };

}


