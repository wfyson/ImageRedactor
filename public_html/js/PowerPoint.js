function PowerPoint(){

    var self = this;
    self.pptImageArray = new Array();
    self.slideImageRelArray = new Array();    

    self.addImage = function(pptImage){
        self.pptImageArray.push(pptImage);
    }
    
    self.addSlideImageRel = function(slideImageRel){
        self.slideImageRelArray.push(slideImageRel);
    }
    
    self.getPptImageArray = function(){
        return self.pptImageArray;
    }

}


