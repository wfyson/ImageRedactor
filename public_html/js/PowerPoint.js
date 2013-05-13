function PowerPoint(){

    var self = this;
    self.pptImageArray = new Array();
    self.slideImageRelArray = new Array();    

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

}


