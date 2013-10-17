function redactorInit() {    
    //perform flickr search
    $('#flickr').submit(function() {
        //unbind any previous functions associated with the next and previous buttons for flickr
        $("#flickrPrev").unbind('click');
        $("#flickrNext").unbind('click');

        if ($('#tags').val() === "") {
            //prompt user for search terms
            $('#searchControl').addClass("error");
        } else {
            $('#searchControl').removeClass("error");
            //do a search
            var tags = $('#tags').val();
            var sort = $('#sort').val();
            var licence = $('#flickrLicence').val();
            var flickrReader = new FlickrReader(tags, sort, licence);
            flickrReader.buildQuery();
        }
        return false;
    });

//redact button
    $('#redactBtn').click(function() {
        if (!$('#redactBtn').hasClass("disabled")) {
            var redactor = $('#redactBtn').data("redactor");
            redactor.commitChanges();
        }
    });

//overview button
    $('#overviewBtn').click(function() {
        if (!$('#overviewBtn').hasClass("disabled")) {
            var redactor = $('#redactBtn').data("redactor");

            //disable buttons
            $('.imageButtons').addClass("disabled");

            $('.hasFocus').fadeOut(400, function() {
                //remove whatever did have focus
                $('.hasFocus').removeClass('hasFocus');
                $('#overview').addClass('hasFocus');
                $('#overview').fadeIn(400);
            });
        }
    });

//placeholder button
    $('#placeholderBtn').click(function() {
        if (!$('#placeholderBtn').hasClass("disabled")) {
            var pptImage = $('#imageOverview').data("image");

            //show old image
            $('#placeholderOld').empty();
            var oldImg = document.createElement('img');
            $(oldImg).addClass("ppt-image placeholderImage");
            $(oldImg).attr("src", pptImage.url);
            $('#placeholderOld').append($(oldImg));

            //show pixelated image                    
            var image = new Image();
            image.src = pptImage.url;
            var pixelatedFileName = "_pixelated_" + pptImage.name + pptImage.format;
            image.onload = function() {
                var options;
                var newimg = Pixastic.process(image, "mosaic", {blockSize: 20}, function(mosaicImage) {
                    newimg = Pixastic.process(mosaicImage, "blurfast", {amount: 2.5}, function(blurImage) {
                        var dataURL = blurImage.toDataURL("image/jpeg");
                        $('#placeholderPixelated').attr("src", dataURL);

                        //save pixelated image to server
                        var postURL = (dataURL.substr(dataURL.lastIndexOf('base64') + 7));

                        var fd = new FormData();
                        fd.append('fname', pixelatedFileName);
                        fd.append('data', postURL);
                        $.ajax({
                            type: 'POST',
                            url: 'php/imagewriter.php',
                            data: fd,
                            processData: false,
                            contentType: false
                        });
                    });
                });
            };


            $('.hasFocus').fadeOut(400, function() {
                //ensure save button is present and undo button is absent
                $('#placeholderUndo').hide();
                $('#placeholderSave').show();

                //remove whatever did have focus
                $('.hasFocus').removeClass('hasFocus');
                $('#placeholderOverview').addClass('hasFocus');
                $('#placeholderOverview').fadeIn(400);
            });
        }
    });

//placeholder save
    $('#placeholderSave').click(function() {
        var pptImage = $('#imageOverview').data("image");
        var newSrc = "_pixelated_" + pptImage.name + pptImage.format;

        var placeholderChange = new Change("placeholder", pptImage, newSrc, "CC0");
        var redactor = $('#redactBtn').data("redactor");

        var oldChange = redactor.getImageChange(pptImage);

        if (oldChange !== false) {
            switch (oldChange.type) {
                case "cc":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("ccChange");
                    break;
                case "placeholder":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("placeholderChange");
                    break;
                case "flickr":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("flickrChange");
                    break;
            }
            redactor.removeChange(oldChange);
        }

        redactor.addChange(placeholderChange);
        $('#redactBtn').data("redactor", redactor);

        updateOverview(redactor);

        $('#' + pptImage.name + ' .changeIcon').addClass("placeholderChange");

        $('#placeholderOverview').removeClass('hasFocus');
        $('#placeholderOverview').fadeOut('400', function() {
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn(400);
        });
    });

//placeholder undo
    $('#placeholderUndo').click(function() {
        var redactor = $('#redactBtn').data("redactor");
        var pptImage = $('#imageOverview').data("image");
        var oldChange = redactor.getImageChange(pptImage);
        if (oldChange !== false) {
            redactor.removeChange(oldChange);
        }
        $('#redactBtn').data("redactor", redactor);

        updateOverview(redactor);

        $('#' + pptImage.name + ' .changeIcon').removeClass("placeholderChange");

        $('#placeholderOverview').removeClass('hasFocus');
        $('#placeholderOverview').fadeOut('400', function() {
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn(400);
        });
    });

//flickr button
    $('#flickrBtn').click(function() {
        if (!$('#flickrBtn').hasClass("disabled")) {
            $('.hasFocus').fadeOut(400, function() {
                //remove whatever did have focus
                $('.hasFocus').removeClass('hasFocus');
                $('#flickrSearch').addClass('hasFocus');
                $('#flickrSearch').fadeIn(400);
            });
        }
    });

//cropping back button (from cropper to search results)
    /*
     $('#cropperBack').click(function(){
     $('#flickrCropper').fadeOut(400, function() {
     //remove whatever did have focus
     $('#flickrCropper').removeClass('hasFocus');
     $('#flickrSearch').addClass('hasFocus');
     $('#flickrSearch').fadeIn(400);
     });                
     });
     */
//flickrBack button (from overview to search results)
    $('#flickrBack').click(function() {
        $('#flickrOverview').fadeOut(400, function() {
            //remove whatever did have focus
            $('#flickrOverview').removeClass('hasFocus');
            $('#flickrSearch').addClass('hasFocus');
            $('#flickrSearch').fadeIn(400);
        });
    });

//flickrSave button
    $('#flickrSave').click(function() {
        var pptImage = $('#imageOverview').data("image");
        var flickrImage = $('#flickrOverview').data("flickrImage");

        var flickrChange = new Change("flickr", pptImage, flickrImage.getMediumUrl(), flickrImage.textLicence);
        flickrChange.setTitle(flickrImage.title);
        flickrChange.setAuthor(flickrImage.author);

        var redactor = $('#redactBtn').data("redactor");

        var oldChange = redactor.getImageChange(pptImage);
        if (oldChange !== false) {
            switch (oldChange.type) {
                case "cc":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("ccChange");
                    break;
                case "placeholder":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("placeholderChange");
                    break;
                case "flickr":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("flickrChange");
                    break;
            }
            redactor.removeChange(oldChange);
        }

        redactor.addChange(flickrChange);
        $('#redactBtn').data("redactor", redactor);

        updateOverview(redactor);

        $('#' + pptImage.name + ' .changeIcon').addClass("flickrChange");

        $('#flickrOverview').removeClass('hasFocus');
        $('#flickrOverview').fadeOut('400', function() {
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn(400);
        });
    });

//flickr undo
    $('#flickrUndo').click(function() {
        var redactor = $('#redactBtn').data("redactor");
        var pptImage = $('#imageOverview').data("image");
        var oldChange = redactor.getImageChange(pptImage);
        if (oldChange !== false) {
            redactor.removeChange(oldChange);
        }
        $('#redactBtn').data("redactor", redactor);

        updateOverview(redactor);

        $('#' + pptImage.name + ' .changeIcon').removeClass("flickrChange");

        $('#flickrOverview').removeClass('hasFocus');
        $('#flickrOverview').fadeOut('400', function() {
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn(400);
        });
    });

//cc button
    $('#ccBtn').click(function() {
        if (!$('#ccBtn').hasClass("disabled")) {
            var pptImage = $('#imageOverview').data("image");

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

            $('.hasFocus').fadeOut(400, function() {
                //ensure save button is present and undo button is absent
                $('#ccUndo').hide();
                $('#ccSave').show();

                //remove whatever did have focus
                $('.hasFocus').removeClass('hasFocus');
                $('#ccOverview').addClass('hasFocus');
                $('#ccOverview').fadeIn(400);
            });
        }
    });

//cc save
    $('#ccSave').click(function() {
        var pptImage = $('#imageOverview').data("image");
        var newSrc = pptImage.name + pptImage.format;

        var selector = document.getElementById("ccSelector");
        var licence = selector.options[selector.selectedIndex].text;

        var ccChange = new Change("cc", pptImage, newSrc, licence);
        var redactor = $('#redactBtn').data("redactor");

        var oldChange = redactor.getImageChange(pptImage);
        if (oldChange !== false) {
            switch (oldChange.type) {
                case "cc":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("ccChange");
                    break;
                case "placeholder":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("placeholderChange");
                    break;
                case "flickr":
                    $('#' + pptImage.name + ' .changeIcon').removeClass("flickrChange");
                    break;
            }
            redactor.removeChange(oldChange);
        }

        redactor.addChange(ccChange);
        $('#redactBtn').data("redactor", redactor);

        updateOverview(redactor);

        $('#' + pptImage.name + ' .changeIcon').addClass("ccChange");

        $('#ccOverview').removeClass('hasFocus');
        $('#ccOverview').fadeOut('400', function() {
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn(400);
        });
    });

//cc undo
    $('#ccUndo').click(function() {
        var redactor = $('#redactBtn').data("redactor");
        var pptImage = $('#imageOverview').data("image");
        var oldChange = redactor.getImageChange(pptImage);
        if (oldChange !== false) {
            redactor.removeChange(oldChange);
        }
        $('#redactBtn').data("redactor", redactor);

        updateOverview(redactor);

        $('#' + pptImage.name + ' .changeIcon').removeClass("ccChange");

        $('#ccOverview').removeClass('hasFocus');
        $('#ccOverview').fadeOut('400', function() {
            $('#overview').addClass('hasFocus');
            $('#overview').fadeIn(400);
        });
    });

    function updateOverview(redactor) {
        //get initial numbers
        var viewer;
        if (redactor instanceof PowerPointRedactor) {
            viewer = new PowerPointViewer(redactor.ppt);
        } else {
            if (redactor instanceof WordRedactor) {
                viewer = new WordViewer(redactor.word);
            }
        }
        var licenceNumbers = viewer.getNoLicencedImages();
        var totalNull = licenceNumbers.none;
        var totalOther = licenceNumbers.other;
        var totalCC = licenceNumbers.cc;

        var changeArray = redactor.changeArray;
        for (var i = 0; i < changeArray.length; i++) {
            var oldLicence = changeArray[i].pptImage.licence;
            totalCC++;
            if (oldLicence === "CC0" ||
                    oldLicence === "Attribution (CC BY)" ||
                    oldLicence === "NoDerivs (CC BY-ND)" ||
                    oldLicence === "NonCommercial, NoDerivs (CC BY-NC-ND)" ||
                    oldLicence === "NonCommercial (CC BY-NC)" ||
                    oldLicence === "NonCommercial, ShareAlike (CC BY-NC-SA)" ||
                    oldLicence === "ShareAlike (CC BY-SA)") {
                totalCC--;
            } else {
                if (typeof oldLicence !== "undefined" && oldLicence !== "null" && oldLicence !== null) {
                    totalOther--;
                } else {
                    totalNull--;
                }
            }
        }

        var totalLicenced = totalOther + totalCC;
        $('#licencedImages').empty();
        $('#licencedImages').append(totalLicenced);

        //overall licence
        var imageLicences = new Array();
        var images = viewer.getDocument().getImageArray();
        for (var j = 0; j < images.length; j++) {
            var image = images[j];
            //console.log(image);
            var imageChange = redactor.getImageChange(image);
            //console.log(imageChange);
            if (imageChange !== false) {
                imageLicences.push(imageChange.licence);
            } else {
                imageLicences.push(image.licence);
            }
        }

        var lowestLicence = viewer.getLowestLicence(totalNull, totalOther, imageLicences);
        $('#overallLicence').empty();
        $('#overallLicence').append(lowestLicence); //need to work this out somehow

        var totalImages = images.length;
        var progressCC = (totalCC / totalImages) * 100;
        var progressOther = (totalOther / totalImages) * 100;
        var progressNull = (totalNull / totalImages) * 100;

        $('#progressCC').attr("style", "width:" + progressCC + "%");
        $('#progressOther').attr("style", "width:" + progressOther + "%");
        $('#progressNull').attr("style", "width:" + progressNull + "%");
    }


    $(document).ready(function() {
        $('#mycarousel').jcarousel({
            size: 0
        });
    });

    $(function() {
        // Bootstrap Arrows
        $('.arrow, [class^=arrow-]').bootstrapArrows();
    });

    $(window).on('beforeunload', function() {

        var phpUrl = "php/imagedeleter.php";
        $.get(phpUrl);

    });
}
            