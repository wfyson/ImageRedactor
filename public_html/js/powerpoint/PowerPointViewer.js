function PowerPointViewer(powerpoint){

    var self = this;
    self.powerpoint = powerpoint;
    
    self.getDocument = function(){
        return self.powerpoint;
    };
    
    self.displayOverview = function(powerpoint){
        $('.hasFocus').fadeOut(400, function() {
            //remove whatever did have focus
            $('.hasFocus').removeClass('hasFocus');
        
            //name
            $('#pptName').empty();       
            $('#pptName').append(powerpoint.name); 
        
            //total images
            $('#totalImages').empty();
            //calculate total number of images that actually appear in the powerpoint (rather than are present in the file)
            var pptImages = powerpoint.getPptImageArray();
            var totalImages = 0;
            for (var i = 0; i < pptImages.length; i++){
                var pptImage = pptImages[i];
                if (self.powerpoint.getImageRels(pptImage.name).length > 0){
                    totalImages++;
                }
            }
            $('#totalImages').append(totalImages);
        
            //licenced images
            var licenceNumbers = self.getNoLicencedImages();    
            var totalNull = licenceNumbers.none;
            var totalOther = licenceNumbers.other;
            var totalCC = licenceNumbers.cc;
            var totalLicenced = totalOther + totalCC;   
        
            $('#licencedImages').empty(); 
            $('#licencedImages').append(totalLicenced); 
        
            //overall licence
            var imageLicences = new Array();
            var images = self.powerpoint.pptImageArray;
            for (var i = 0; i < images.length; i++){
                imageLicences.push(images[i].licence);
            }
            var lowest = self.getLowestLicence(totalNull, totalOther, imageLicences);        
            $('#overallLicence').empty();
            $('#overallLicence').append(lowest); //need to work this out somehow
        
            //calculate progress        
            var progressCC = (totalCC / totalImages) * 100;
            var progressOther = (totalOther / totalImages) * 100;
            var progressNull = (totalNull / totalImages) * 100;
        
            $('#progressCC').attr("style", "width:" + progressCC + "%");
            $('#progressOther').attr("style", "width:" + progressOther + "%");
            $('#progressNull').attr("style", "width:" + progressNull + "%");
        
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn('slow');
        });
    };
    
    self.displayImages = function(powerpoint){
       
        //update reference to powerpoint
        self.powerpoint = powerpoint;
        
        var pptImages = powerpoint.getPptImageArray();
        var carousel = $('#pptCarousel').data('jcarousel');    
        var carouselCount = 0;
        for (var i = 0; i < pptImages.length; i++){
            //generate html for the image
            var pptImage = pptImages[i];
            //only add an image to the carousel if it appears in the presentation (that is to say it has rels)            
            if (self.powerpoint.getImageRels(pptImage.name).length > 0){                
                
                var html = '<span id="' + pptImage.name + '"><img id="img' + i + '" class="carouselImg" src="' + pptImage.url + '" width="110" height="110" alt="' + pptImage.url + '" /><span class="changeIcon"/></span>';

                carouselCount++;
                carousel.add(carouselCount, html);
                
                $('#img' + i).click({param1: i, param2: pptImage}, function(event) {
                    var pptImage = event.data.param2;

                    //clear previous info
                    $('#pptImage').empty();
                    $('#imageLicence').empty();
                    $('#imageAuthor').empty();
                    $('#imageSlides').empty();
                    $('#imageSize').empty();
                    $('#imageFormat').empty();

                    //attach image to the div to get later
                    $('#imageOverview').data("image", pptImage);

                    //make buttons work
                    $('.imageButtons').removeClass("disabled");

                    //add the span helper for centering images
                    var span = document.createElement('span');
                    $(span).addClass("helper");
                    $('#pptImage').append($(span));

                    //display the slide numbers - TODO: ensure slides are in correct order!
                    var rels = self.powerpoint.getImageRels(pptImage.name);
                    var slides = "";

                    for (var i = 0, length = rels.length - 1; i < length; i++) {
                        if (rels[i].slide === -1) {
                            slides = "N/A";
                        } else {
                            var slideString = rels[i].slide;
                            //substring here removes the word "slide" from the rel's slide property                   
                            slides = slides + slideString.substring(5) + ", ";
                        }
                    }
                    if (rels[rels.length - 1].slide !== -1) {
                        slides = slides + rels[rels.length - 1].slide.substring(5);
                    }else{
                        if (rels[rels.length-1].background){
                            slides = "Background";
                        }
                    }
                    $('#imageSlides').append(slides);      

                    //display image size
                    var width = pptImage.width;
                    var height = pptImage.height;
                    $('#imageSize').append(width + " x " + height);

                    //display image licence
                    var licence = pptImage.licence;
                    if (typeof licence === "undefined")
                        licence = "Unknown";
                    var licenceSpan = document.createElement('span');
                    $(licenceSpan).attr("title", licence);
                    $(licenceSpan).append(licence);                    
                    $('#imageLicence').append(licenceSpan);

                    //display image author
                    var author = pptImage.author;
                    if (typeof author === "undefined")
                        author = "Unknown";
                    $('#imageAuthor').append(author);

                    //display image format
                    var format = pptImage.format;
                    if (typeof format === "undefined")
                        format = "Unknown";
                    $('#imageFormat').append(format);

                    //enable/disable buttons where appropriate
                    if (pptImage.format === ".png") {
                        $('#ccBtn').addClass("disabled");
                    } else {
                        $('#ccBtn').removeClass("disabled");
                    }

                    //display the image  
                    var redactor = $('#redactBtn').data("redactor");
                    var imageChange = redactor.getImageChange(pptImage);
                    if (imageChange !== false) {
                        //display the change appropriately.
                        switch (imageChange.type) {
                            case "cc":
                                $('.hasFocus').fadeOut(400, function() {
                                    //remove whatever did have focus
                                    $('.hasFocus').removeClass('hasFocus');
                                    $('#ccOverview').addClass('hasFocus');

                                    //show old image
                                    $('#ccOld').empty();
                                    var oldImg = document.createElement('img');
                                    $(oldImg).addClass("ppt-image");
                                    $(oldImg).attr("src", pptImage.url);
                                    $('#ccOld').append($(oldImg));

                                    //add the span helper for centering images
                                    var span = document.createElement('span');
                                    $(span).addClass("helper");
                                    $('#ccOld').append($(span));

                                    //set the licence
                                    $("#ccSelector").val(imageChange.licence);

                                    //hide the save button and show the undo button
                                    $('#ccSave').hide();
                                    $('#ccUndo').show();

                                    $('#ccOverview').fadeIn(400);
                                });
                                break;
                            case "placeholder":
                                $('.hasFocus').fadeOut(400, function() {
                                    //remove whatever did have focus
                                    $('.hasFocus').removeClass('hasFocus');
                                    $('#placeholderOverview').addClass('hasFocus');

                                    //show old image
                                    $('#placeholderOld').empty();
                                    var oldImg = document.createElement('img');
                                    $(oldImg).addClass("ppt-image placeholderImage");
                                    $(oldImg).attr("src", pptImage.url);
                                    $('#placeholderOld').append($(oldImg));

                                    $('#placeholderSave').hide();
                                    $('#placeholderUndo').show();

                                    $('#placeholderOverview').fadeIn(400);
                                });
                                break;
                            case "flickr":
                                $('.hasFocus').fadeOut(400, function() {
                                    //remove whatever did have focus
                                    $('.hasFocus').removeClass('hasFocus');
                                    $('#flickrOverview').addClass('hasFocus');

                                    //show old image
                                    $('#flickrOld').empty();
                                    var oldImg = document.createElement('img');
                                    $(oldImg).addClass("flickrImage");
                                    $(oldImg).attr("src", pptImage.url);
                                    $('#flickrOld').append($(oldImg));

                                    //show new image
                                    $('#flickrNew').empty();
                                    var newImg = document.createElement('img');
                                    $(newImg).addClass("flickrImage");
                                    $(newImg).attr("src", imageChange.newImageSrc);
                                    $('#flickrNew').append($(newImg));

                                    $('#flickrSave').hide();
                                    $('#flickrUndo').show();

                                    $('#flickrOverview').addClass('hasFocus');
                                    $('#flickrOverview').fadeIn(400);
                                });
                                break;
                        }
                    } else {
                        var img = document.createElement('img');
                        $(img).addClass("ppt-image");
                        $(img).attr("src", pptImage.url);
                        $('#pptImage').append($(img));

                        if ($('.hasFocus').length === 0) {
                            //nothing in focus
                            $('#pptImage').addClass('hasFocus');
                            $('#pptImage').fadeIn('slow');
                        } else { //something has the focus
                            if ($('#pptImage').hasClass('hasFocus')) { //already has focus
                                $('#pptImage').fadeIn('slow');
                            } else {
                                $('.hasFocus').fadeOut('400', function() {
                                    $('.hasFocus').removeClass("hasFocus");
                                    $('#pptImage').addClass('hasFocus');
                                    $('#pptImage').fadeIn('slow');
                                });
                            }
                        }
                    }
                });
            }
        }
        carousel.size(carouselCount);
    };
    
    self.getNoLicencedImages = function(){
        var pptImageArray = self.powerpoint.pptImageArray;
        var totalCC = 0;
        var totalOther = 0;
        var totalNull = 0;
        var total = 0;
        for (var i=0; i<pptImageArray.length; i++){
            var pptImage = pptImageArray[i];
            if (self.powerpoint.getImageRels(pptImage.name).length > 0){
                total++;
                var licence = pptImage.licence; 
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
                        totalOther++;
                    }else{
                        totalNull++;
                    }
                }            
            }
        }
        return new licenceNumbers(total, totalNull, totalOther, totalCC);        
    };
    
    self.getLowestLicence = function(totalNull, totalOther, imageLicences){
        if (totalNull > 0){
            return "Unknown Licence";
        }else{
            if (totalOther > 0){
                return "Custom Licence";
            }else{
                var lowest = 0;
                for (var i=0; i<imageLicences.length; i++){
                    var licence = imageLicences[i];
                    if (licence === "CC0" && lowest === 0){
                        lowest = 0;
                    }else{
                        if (licence === "Attribution (CC BY)" && lowest < 1){                            
                            lowest = 1;
                        }else{
                            if (licence === "ShareAlike (CC BY-SA)" && lowest < 2){
                            lowest = 2;
                            }else{
                                if (licence === "NoDerivs (CC BY-ND)" && lowest < 3){
                                    lowest = 3;
                                }else{
                                    if (licence === "NonCommercial (CC BY-NC)" && lowest < 4){
                                        lowest = 4;
                                    }else{
                                        if (licence === "NonCommercial, ShareAlike (CC BY-NC-SA)" && lowest < 5){
                                            lowest = 5;
                                        }else{
                                            if (licence === "NonCommercial, NoDerivs (CC BY-NC-ND)" && lowest < 6){
                                                lowest = 6;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var result;
                switch (lowest) {
                    case 0:
                        result = "CC0";
                    break;
                    case 1:
                        result = "Attribution (CC BY)";
                    break;
                    case 2:
                        result = "ShareAlike (CC BY-SA)";
                    break;
                    case 3:
                        result = "NoDerivs (CC BY-ND)";
                    break;
                    case 4:
                        result = "NonCommercial (CC BY-NC)";
                    break;
                    case 5:
                        result = "NonCommercial, ShareAlike (CC BY-NC-SA)";
                    break;
                    case 6:
                        result = "NonCommercial, NoDerivs (CC BY-NC-ND)";
                    break;
                }
                return result;              
            }
        }
    };
    
    function licenceNumbers(total, none, other, cc){
        var self = this;
        self.total = total;
        self.none = none;
        self.other = other;
        self.cc = cc;
    }
  
}
