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
                $('#' + slide + "-accordion-inner").append(self.imageViewer(self.powerpoint.getPptImage(imageName)));               
            }else{
                //a collapsible component does not yet exist
                var accordion = document.createElement("div");
                $(accordion).addClass("accordion");
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
                $(collapse).addClass("accordion-body collapse in");
                
                var accordionInner = document.createElement("div");
                $(accordionInner).addClass("accordion-inner");
                $(accordionInner).attr("id", slide + "-accordion-inner");

                //add them all together                
                $(accordionToggle).append(slide);
                $(accordionInner).append(self.imageViewer(self.powerpoint.getPptImage(imageName)));
                
                $(accordionHeading).append($(accordionToggle));
                
                $(collapse).append($(accordionInner));
                
                $(accordionGroup).append($(accordionHeading));
                $(accordionGroup).append($(collapse));
                
                $(accordion).append(accordionGroup);     
                
                $("#imageList").append($(accordion));
            }
        }
    };
    
    //creates a box for showing images
    self.imageViewer = function(pptImage){
        var container = document.createElement("div");
        $(container).addClass("image-viewer");
        
        //image side
        var imageContainer = document.createElement("div");
        $(imageContainer).addClass("image-container");
        
        var img = document.createElement('img');
        $(img).addClass("ppt-image");
        $(img).attr("src", pptImage.url);
        
        var helper = document.createElement('span');
        $(helper).addClass("helper");
        
        $(imageContainer).append($(helper));
        $(imageContainer).append($(img));
        $(container).append($(imageContainer));
        
        //button side
        var buttonContainer = document.createElement("div");
        
        var replaceBtn = document.createElement("button");
        $(replaceBtn).addClass("replace-button btn btn-primary");
        $(replaceBtn).append("Flickr Image");
        $(replaceBtn).click({param1: pptImage}, function(event){           
            myHandler(event.data.param1);
        });
        
        $(buttonContainer).append($(replaceBtn));
        
        $(container).append($(buttonContainer));
        
        return $(container);
    };
    
    function myHandler(pptImage){
        console.log(pptImage);
        console.log(pptImage.licence);
        console.log(pptImage.name);
    }
}
