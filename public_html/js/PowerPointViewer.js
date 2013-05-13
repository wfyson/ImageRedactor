function PowerPointViewer(powerpoint){

    var self = this;
    self.powerpoint = powerpoint;
    
    //a function which takes the rels array and gets appropriate images
    
    self.displayImages = function(){
        var rels = self.powerpoint.slideImageRelArray;
        //populate page with collapsible components to represent each slide
        for (var i = 0; i < rels.length; i++){
            var rel = rels[i];
            var slide = rel.slide;
            var imageName = rel.image;
            if ($('#' + slide + "-accordion").length > 0){
                //a collapsible component exists for this slide
                //add the image
                var img = document.createElement('img');
                var pptImage = self.powerpoint.getPptImage(imageName);
                $(img).attr("src", pptImage.url);
                $('#' + slide + "-accordion-inner").append(img);               
            }else{
                //a collapsible component does not yet exist
                var accordion = document.createElement("div");
                $(accordion).attr("class", "accordion");
                $(accordion).attr("id", slide + "-accordion");
                
                var accordionGroup = document.createElement("div");
                $(accordionGroup).attr("class", "accordion-group");
                
                var accordionHeading = document.createElement("div");
                $(accordionHeading).attr("class", "accordion-heading");
                
                var accordionToggle = document.createElement("a");
                $(accordionToggle).attr("class", "accordion-toggle");
                $(accordionToggle).attr("data-toggle", "collapse");
                $(accordionToggle).attr("data-parent", "#" + slide + "-accordion");
                $(accordionToggle).attr("href", "#" + slide + "-collapse");
                                
                var collapse = document.createElement("div");
                $(collapse).attr("id", slide + "-collapse");
                $(collapse).attr("class", "accordion-body collapse in");
                
                var accordionInner = document.createElement("div");
                $(accordionInner).attr("class", "accordion-inner");
                $(accordionInner).attr("id", slide + "-accordion-inner");
                
                //get image
                var img = document.createElement('img');
                var pptImage = self.powerpoint.getPptImage(imageName);
                $(img).attr("src", pptImage.url);
                

                //add them all together                
                $(accordionToggle).append(slide);
                $(accordionInner).append($(img));
                
                $(accordionHeading).append($(accordionToggle));
                
                $(collapse).append($(accordionInner));
                
                $(accordionGroup).append($(accordionHeading));
                $(accordionGroup).append($(collapse));
                
                $(accordion).append(accordionGroup);     
                
                $("#imageList").append($(accordion));
            }
        }
    };
}
