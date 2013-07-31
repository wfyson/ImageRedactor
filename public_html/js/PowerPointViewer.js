function PowerPointViewer(powerpoint){

    var self = this;
    self.powerpoint = powerpoint;
    
    
    self.displayOverview = function(powerpoint){
        //name
        $('#pptName').empty();       
        $('#pptName').append(powerpoint.pptFile.name); 
        
        //total images
        $('#totalImages').empty();
        var totalImages = powerpoint.pptImageArray.length;
        $('#totalImages').append(totalImages);
        
        //licenced images
        var licenceNumbers = self.getNoLicencedImages(powerpoint);    
        var totalNull = licenceNumbers.none;
        var totalOther = licenceNumbers.other;
        var totalCC = licenceNumbers.cc;
        var totalLicenced = totalOther + totalCC;        
        
        $('#licencedImages').empty(); 
        $('#licencedImages').append(totalLicenced); 
        
        //overall licence
        $('#overallLicence').empty();
        $('#overallLicence').append("TODO..."); //need to work this out somehow
        
        //calculate progress
        console.log(totalCC); //1
        console.log(totalOther); //1
        console.log(totalNull); //2
        console.log(totalImages); //4
        
        var progressCC = (totalCC / totalImages) * 100;
        var progressOther = (totalOther / totalImages) * 100;
        var progressNull = (totalNull / totalImages) * 100;
        
        $('#progressCC').attr("style", "width:" + progressCC + "%");
        $('#progressOther').attr("style", "width:" + progressOther + "%");
        $('#progressNull').attr("style", "width:" + progressNull + "%");
        
        $('#overview').addClass('hasFocus');
        $('#overview').fadeIn('slow');
    };
    
    self.displayImages = function(powerpoint){
       
        //update reference to powerpoint
        self.powerpoint = powerpoint;
        
        var pptImages = powerpoint.getPptImageArray();
        var carousel = $('#mycarousel').data('jcarousel');                
        for (var i = 0; i < pptImages.length; i++){
            //generate html for the image
            var pptImage = pptImages[i];
            var html = '<img id="image' + i + '" src="' + pptImage.url + '" width="110" height="110" alt="' + pptImage.url + '" />';
            
            carousel.add(i+1, html);
            
            $('#image' + i).click({param1: i, param2: pptImage}, function(event){
                var pptImage = event.data.param2;
                
                //clear previous info
                $('#pptImage').empty();
                $('#imageLicence').empty();
                $('#imageAuthor').empty();
                $('#imageSlides').empty();
                $('#imageSize').empty();                 
                
                //attach image to the div to get later
                $('#imageOverview').data("pptImage", pptImage);
                
                //make buttons work
                $('.imageButtons').removeClass("disabled");
                
                //add the span helper for centering images
                var span = document.createElement('span');
                $(span).addClass("helper");
                $('#pptImage').append($(span));                
                
                //display the image                
                var img = document.createElement('img');
                $(img).addClass("ppt-image");
                $(img).attr("src", pptImage.url);
                $(img).attr("style", "display: none");
                $('#pptImage').append($(img));
                $(img).fadeIn('slow');

                //display the slide numbers - TODO: ensure slides are in correct order!
                var rels = self.powerpoint.getImageRels(pptImage.name);
                var slides = "";
                for (var i = 0; i < rels.length-1; i++){
                    var slideString = rels[i].slide;
                    //substring here removes the word "slide" from the rel's slide property                   
                    slides = slides + slideString.substring(5) + ", "; 
                }                
                slides = slides + rels[rels.length-1].slide.substring(5);
                $('#imageSlides').append(slides);
                
                //display image licence
                var width = pptImage.width;
                var height = pptImage.height;
                $('#imageSize').append(width + "x" + height);
                
                //display image licence
                var licence = pptImage.licence;
                if (typeof licence === "undefined")
                    licence = "Unknown";
                $('#imageLicence').append(licence);

                //display image author
                var author = pptImage.author;
                if (typeof author === "undefined")
                    author = "Unknown";
                $('#imageAuthor').append(author);
                
                //enable/disable buttons where appropriate
                console.log(pptImage.format);
                if (pptImage.format === ".png"){
                    $('#ccBtn').addClass("disabled");
                }else{
                    $('#ccBtn').removeClass("disabled");
                }                

                if ($('.hasFocus').length === 0){
                    //nothing in focus
                    $('#pptImage').addClass('hasFocus');
                    $('#pptImage').fadeIn('slow'); 
                }else{ //something has the focus
                    if ($('#pptImage').hasClass('hasFocus')){ //already has focus
                        $('#pptImage').fadeIn('slow');
                    }else{
                        $('.hasFocus').fadeOut('400', function(){
                            $('.hasFocus').removeClass("hasFocus");
                            $('#pptImage').addClass('hasFocus');
                            $('#pptImage').fadeIn('slow');                        
                        });
                    }  
                }
            });
        }
        carousel.size(pptImages.length);
        
        
        /*
        //first remove everything
        $('#imageList').empty();
        
        var rels = self.powerpoint.slideImageRelArray;

        //populate page with collapsible components to represent each slide
        for (var i = 0; i < rels.length; i++){
            var rel = rels[i];
            var slide = rel.slide;
            var imageName = rel.image;

            if ($('#' + slide + "-accordion").length > 0){
                //a collapsible component exists for this slide
                $('#' + slide + "-accordion-inner").append(self.pptImageViewer(self.powerpoint.getPptImage(imageName)));  
                $('#' + slide + "-accordion-inner").append(self.changeImageViewer(rel.getChange()));                      
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
                $(accordionInner).append(self.pptImageViewer(self.powerpoint.getPptImage(imageName)));
                $(accordionInner).append(self.changeImageViewer(rel.getChange()));                    
                
                $(accordionHeading).append($(accordionToggle));
                
                $(collapse).append($(accordionInner));
                
                $(accordionGroup).append($(accordionHeading));
                $(accordionGroup).append($(collapse));
                
                $(accordion).append(accordionGroup);     
                
                $("#imageList").append($(accordion));
            }
        }*/
    };
    
    //creates a box for showing images
    self.pptImageViewer = function(pptImage){
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
        
        //button for flickr
        var replaceBtn = document.createElement("button");
        $(replaceBtn).addClass("replace-button btn btn-primary");
        $(replaceBtn).append("Flickr Image");
        $(replaceBtn).click({param1: pptImage}, function(event){           
            flickr(event.data.param1);
        });        
        $(buttonContainer).append($(replaceBtn));
        
        //button for placeholder images
        var placeholderBtn = document.createElement("button");
        $(placeholderBtn).addClass("placeholder-button btn btn-primary");
        $(placeholderBtn).append("Placeholder");
        $(placeholderBtn).click({param1: pptImage}, function(event){           
            placeholder(event.data.param1);
        });
        $(buttonContainer).append($(placeholderBtn));
        
        
        $(container).append($(buttonContainer));
        
        return $(container);
    };
    
    //creates a box for showing images
    self.changeImageViewer = function(changeImage){
        if (changeImage !== null){
        var container = document.createElement("div");

        var img = document.createElement('img');
        $(img).attr("src", changeImage.newImageSrc);

        $(container).append($(img));

        return $(container);
        }
    };
    
    self.getNoLicencedImages = function(powerpoint){
        pptImageArray = powerpoint.pptImageArray;
        var totalCC = 0;
        var totalOther = 0;
        var totalNull = 0;
        for (var i=0; i<pptImageArray.length; i++){
            var pptImage = pptImageArray[i];
            var licence = pptImage.licence; 
            console.log(pptImage);
            console.log(licence);
            if (licence === "CC0" ||
                licence === "Attribution (CC BY)" ||
                licence === "NoDerivs (CC BY-ND)" ||
                licence === "NonCommercial, NoDerivs (CC BY-NC-ND)" ||
                licence === "NonCommercial (CC BY-NC)" ||
                licence === "NonCommercial, ShareAlike (CC BY-NC-SA)" ||
                licence === "ShareAlike (CC BY-SA)") {
                totalCC++;
            }else{
                if (typeof licence !== "undefined" && licence !== "null" && licence !== null){
                    console.log(licence);
                    totalOther++;
                }else{
                    totalNull++;
                }
            }            
        }
        return new licenceNumbers(totalNull, totalOther, totalCC);        
    };
    
    function licenceNumbers(none, other, cc){
        var self = this;
        self.none = none;
        self.other = other;
        self.cc = cc;
    }
  
}
