function WordViewer(word){

    var self = this;
    self.word = word;
    
    self.getDocument = function(){
        return self.word;
    };
    
    self.displayOverview = function(word){
        $('.hasFocus').fadeOut(400, function() {
            //remove whatever did have focus
            $('.hasFocus').removeClass('hasFocus');
        
            //name
            $('#pptName').empty();       
            $('#pptName').append(word.name); 
        
            //total images
            $('#totalImages').empty();
            //calculate total number of images that actually appear in the powerpoint (rather than are present in the file)
            var wordImages = word.getWordImageArray();
            var totalImages = 0;
            for (var i = 0; i < wordImages.length; i++){
                var wordImage = wordImages[i];
                if (self.word.getImageRels(wordImage.name).length > 0){
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
            var images = self.word.wordImageArray;
            for (var i = 0; i < images.length; i++){
                imageLicences.push(images[i].licence);
            }
            var lowest = self.getLowestLicence(totalNull, totalOther, imageLicences);        
            $('#overallLicence').empty();
            $('#overallLicence').append(lowest); //need to work this out somehow
        
            //calculate progress
            //console.log(totalCC);
            //console.log(totalOther);
            //console.log(totalNull);
            //console.log(totalImages);
        
            var progressCC = (totalCC / totalImages) * 100;
            var progressOther = (totalOther / totalImages) * 100;
            var progressNull = (totalNull / totalImages) * 100;
        
            $('#progressCC').attr("style", "width:" + progressCC + "%");
            $('#progressOther').attr("style", "width:" + progressOther + "%");
            $('#progressNull').attr("style", "width:" + progressNull + "%");
        
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn('slow');
     
            //$('#headings').addClass('hasFocus');
            //$('#headings').fadeIn('slow');
            
        });
    };
    
    //displays the contents of all headings and their paragraphs so that they 
    //can be redacted
    self.displayHeadingSections = function(word){
        var rootSection = word.getRootWordSection();
        var inner = $('#innerRoot');
        var count = 1;
        if (rootSection !== null){            
            //get sections
            var entries = rootSection.getEntries();
            for (var i = 0; i < entries.length; i++){
                var entry = entries[i];              
                if(entry instanceof WordSection){
                    //add a new collapisible section
                    //add a new entry to the navigation hierarchy
                    self.newCollapsible(entry, inner, count);            
                    count++;
                }else{ //instance of WordParagraph
                    self.newParagraph(entry, inner);
                }
            }
            
        }
    };
    
    //ann an entry to the navigation hierarchy
    self.newNavigation = function(entry, $accordion){                
        var link = document.createElement("a");
        var $link = $(link);
        var level = entry.getLevel();
        $link.addClass("hierarchyEntry indent" + level);
        $link.attr('href', '#' + $accordion.attr('id'));
        $link.append(entry.getTitle());
        $('#headingHierarchy').append($link);   
        
        //ensure selected accordion is open
        $link.click({param1: $accordion}, function(event){
            var $accordion = event.data.param1;
            var $toggle= $accordion.children(".accordion-group")
                    .children(".accordion-heading")
                    .children(".accordion-toggle");            
            if ($toggle.hasClass("collapsed")){
                $toggle.trigger("click");                        
            }
            //check parents
            openParent($accordion); 
        });
        
        function openParent($accordion){
            if ($accordion.parent().hasClass("accordion-inner")){
                //inside another accordion element
                var $toggle = $accordion.parent().parent().prev().children(".accordion-toggle");
                if ($toggle.hasClass("collapsed")){
                    $toggle.trigger("click");
                }
                //check next entry
                openParent($toggle.parent().parent().parent());
            }
        }
        
    };
       
    
    //add a collapsible section within another
    self.newCollapsible = function(entry, parent, count){
        var subCount = 1;

        var $accordion =  $('<div></div>');
        $accordion.addClass("accordion");
        $accordion.attr("id", "accordion" + count + subCount);
     
        var $accordionGroup = $('<div></div>');
        $accordionGroup.addClass("accordion-group");
        
        var $accordionHeading = $('<div></div>');
        $accordionHeading.addClass("accordion-heading");        
        
        var $toggle = $('<a></a>');
        $toggle.addClass("accordion-toggle");
        $toggle.addClass("heading" + entry.getLevel());
        $toggle.attr("data-toggle", "collapse");
        $toggle.attr("data-parent", ("#accordion" + count + subCount));
        $toggle.attr("href", ("#collapse" + count + subCount));        
        $toggle.append(entry.getTitle());
        
        var $redactBtn = $('<button></button>');
        $redactBtn.addClass("heading-redact btn btn-danger");
        $redactBtn.data("redact", true);
        $redactBtn.data("id", entry.getID()); //the id so its redaction can be recorded by WordRedactor
        $redactBtn.data("anchor", entry.getAnchor());
        $redactBtn.append("Redact");
        
        $redactBtn.click(function(event) {            
            var $this = $(this);            
            var redact = event.redact; //redact indicates if the click is a redact or "unredact" command            
            if (redact === undefined){
                redact = $this.data("redact");
            }
            
            if ($this.data("redact") && redact){                
                $this.removeClass("btn-danger");
                $this.addClass("btn-success");
                $this.addClass("btn-success");
                $this.empty();
                $this.append("Redacted");
                $this.data("redact", false); 
                
                //mark section for redaction
                var redactor = $('#redactBtn').data("redactor");
                redactor.addSectionChange($this.data("id"), $this.data("anchor"));
                
            }else{
                if (!($this.data("redact")) && !(redact)){
                    $this.removeClass("btn-success");
                    $this.addClass("btn-danger");
                    $this.empty();
                    $this.append("Redact");
                    $this.data("redact", true);   
                    
                    //unmark section for redaction
                    var redactor = $('#redactBtn').data("redactor");
                    redactor.removeSectionChange($this.data("id"), $this.data("anchor"));
                }
            }
            
            var newEvent = $.Event("click");
            newEvent.redact = redact;
            var $body = $($this.parent().parent().children(".accordion-body"));
            var $inner = $body.children(".accordion-inner")
                    .children(".accordion")
                    .children(".accordion-group")
                    .children(".accordion-heading")
                    .children(".heading-redact")
                    .trigger(newEvent);
        });
        
        $accordionHeading.append($toggle);
        $accordionHeading.append($redactBtn);
        $accordionGroup.append($accordionHeading);
        
        var $accordionBody = $('<div></div>');
        $accordionBody.attr("id", ("collapse" + count + subCount));
        $accordionBody.addClass("accordion-body collapse in");
        
        var $accordionInner = $('<div></div>');
        $accordionInner.attr("id", ("inner" + count + subCount));
        $accordionInner.addClass("accordion-inner");
        
        $accordionBody.append($accordionInner);
        $accordionGroup.append($accordionBody);
        
        $accordion.append($accordionGroup);
        $(parent).append($accordion);
        
        self.newNavigation(entry, $accordion);
        
        var entries = entry.getEntries();
        for (var i = 0; i < entries.length; i++){
            var entry = entries[i];
            if(entry instanceof WordSection){
                //add a new collapisible section
                var countStr = "";
                countStr = countStr + count + subCount;                
                self.newCollapsible(entry, $accordionInner, countStr);                  
                subCount++;
            }else{ //instance of WordParagraph
                self.newParagraph(entry, $accordionInner);
            }
        }   };
    
    //add a paragraph within a collapsible section
    self.newParagraph = function(entry, parent){
        var $panel = $('<p></p>');       
        
        if (entry.getCaption()){
            $panel.attr("style", "font-weight:bold");
        }
        
        var paraText = "";
        var paraEntries = entry.getEntries();
        for (var i = 0; i < paraEntries.length; i++){
            var paraEntry = paraEntries[i];
            if (paraEntry instanceof RelID){
                //get image url and create image tag
                var image = self.word.getRelImage(paraEntry.getRelID());                
                var imgHtml = '<img src="' + image.url + '" alt="' + image.url + '" />';
                paraText = paraText + imgHtml;
            }else{
                paraText = paraText + paraEntry;
            }            
        }
        $panel.append(paraText);
        $(parent).append($panel);        
    };
    
    self.displayImages = function(word){
       
        //update reference to powerpoint
        self.word = word;
        
        var wordImages = word.getWordImageArray();
        var carousel = $('#wordCarousel').data('jcarousel');  
        var carouselCount = 0;
        
        //add an icon for getting to the headings display
        //var headingsIcon = '<div class="carouselDiv" id="headingsIcon"><img class="carouselImage" src="img/headingsIcon.png" alt="Redact Headings" /><span class="changeIcon"/></div>';
        //carouselCount++;
        //carousel.add(carouselCount, headingsIcon);                
        
        for (var i = 0; i < wordImages.length; i++){
            
            //generate html for the image
            var wordImage = wordImages[i];
            
            //only add an image to the carousel if it appears in the word doc (that is to say it has rels)  
            if ((self.word.getImageRels(wordImage.name)).length > 0){
                
                var html = '<span id="' + wordImage.name + '"><img id="img' + i + '" class="carouselImg" src="' + wordImage.url + '" width="110" height="110" alt="' + wordImage.url + '" /><span class="changeIcon"/></span>';
                carouselCount++;
                carousel.add(carouselCount, html);

                $('#img' + i).click({param1: i, param2: wordImage}, function(event) {
                    var wordImage = event.data.param2;
                    
                    //display appropriate panel
                    if($('#headingPanel').css('display') === "block"){
                        $('#headingPanel').fadeOut(400, function(){
                            $('#imagePanel').fadeIn(400);
                        });
                    }
                                        
                    //clear previous info
                    $('#pptImage').empty();
                    $('#imageLicence').empty();
                    $('#imageAuthor').empty();
                    $('#imageSlides').empty();
                    $('#imageSize').empty();
                    $('#imageFormat').empty();
                    $('#imageCaption').empty();

                    //attach image to the div to get later
                    $('#imageOverview').data("image", wordImage);

                    //make buttons work
                    $('.imageButtons').removeClass("disabled");

                    //add the span helper for centering images
                    var span = document.createElement('span');
                    $(span).addClass("helper");
                    $('#pptImage').append($(span));

                    //display the slide numbers - TODO: ensure slides are in correct order!
                    var rels = self.word.getImageRels(wordImage.name);
                    var slides = "N/A";
                    //for (var i = 0, length = rels.length-1; i < length; i++){
                    //    var slideString = rels[i].slide;
                    //substring here removes the word "slide" from the rel's slide property                   
                    //    slides = slides + slideString.substring(5) + ", "; 
                    //}                

                    //slides = slides + rels[rels.length-1].slide.substring(5);
                    $('#imageSlides').append(slides);

                    //display image size
                    var width = wordImage.width;
                    var height = wordImage.height;
                    $('#imageSize').append(width + " x " + height);

                    //display image licence
                    var licence = wordImage.licence;
                    if (typeof licence === "undefined")
                        licence = "Unknown";
                    $('#imageLicence').append(licence);

                    //display image author
                    var author = wordImage.author;
                    if (typeof author === "undefined")
                        author = "Unknown";
                    $('#imageAuthor').append(author);

                    //display image format
                    var format = wordImage.format;
                    if (typeof format === "undefined")
                        format = "Unknown";
                    $('#imageFormat').append(format);

                    //display image caption
                    var caption= "";
                    var imageRels = self.word.getImageRels(wordImage.name);
                    for (var i = 0; i < imageRels.length; i++){                        
                        caption = caption + self.word.getCaption(imageRels[i].relID);                        
                    }
                    $('#imageCaption').append(caption);

                    //enable/disable buttons where appropriate
                    if (wordImage.format === ".png") {
                        $('#ccBtn').addClass("disabled");
                    } else {
                        $('#ccBtn').removeClass("disabled");
                    }

                    //display the image  
                    var redactor = $('#redactBtn').data("redactor");
                    var imageChange = redactor.getImageChange(wordImage);
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
                                    $(oldImg).attr("src", wordImage.url);
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
                                    $(oldImg).attr("src", wordImage.url);
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
                                    $(oldImg).attr("src", wordImage.url);
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
                        $(img).attr("src", wordImage.url);
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
        var wordImageArray = self.word.wordImageArray;
        var totalCC = 0;
        var totalOther = 0;
        var totalNull = 0;
        var total = 0;
        for (var i=0; i<wordImageArray.length; i++){
            var wordImage = wordImageArray[i];
            if (self.word.getImageRels(wordImage.name).length > 0){
                total++;
                var licence = wordImage.licence; 
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
