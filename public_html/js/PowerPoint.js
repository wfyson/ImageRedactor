function PowerPoint(pptFile){

    var self = this;
    self.pptImageArray = new Array();
    self.slideImageRelArray = new Array();  
    self.pptFile = pptFile;

    self.setImageRelArray = function(slideImageRelArray){
        self.slideImageRelArray = slideImageRelArray;
    };
    
    self.getImageRelArray = function(){
        return self.slideImageRelArray;
    };

    self.addImage = function(pptImage){
        self.pptImageArray.push(pptImage);
    };
    
    self.addSlideImageRel = function(slideImageRel){
        self.slideImageRelArray.push(slideImageRel);
    };
    
    self.getPptImageArray = function(){
        return self.pptImageArray;
    };
    
    self.getPptImage = function(imageName){
        for (var i = 0; i < self.pptImageArray.length; i++){
            if (self.pptImageArray[i].name === imageName){
                return self.pptImageArray[i];
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

}


