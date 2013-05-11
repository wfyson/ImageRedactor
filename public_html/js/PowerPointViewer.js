function PowerPointViewer(powerpoint){

    var self = this;
    self.ppt = powerpoint;
    
    self.displayImages = function(){
        var rels = self.ppt.slideImageRelArray;
        console.log(rels);
        var images = self.ppt.pptImageArray;
        for (var i = 0 ; i < images.length; i++){
            var img = document.createElement('img');
            $(img).attr("src", images[i].url);
            $('#imageList').append(img);
        }
    };
    
}