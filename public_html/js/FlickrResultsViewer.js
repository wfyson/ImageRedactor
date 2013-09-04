function FlickrResultsViewer(){

    var self = this;
    
    self.displayResults = function(flickrImages){
        //ensure no image is currently selected
        $("#flickr-modal").data("selectedImage", null);
        $("#flickr-save").addClass("disabled");
        
        for (var i = 0; i < flickrImages.length; i++){
            var img = document.createElement("img");
            var flickrImage = flickrImages[i]; 
            $(img).attr("src", flickrImage.getResultsUrl);
            
            //remve the old img and place the new one
            $("#flickr" + i).empty();
            $("#flickr" + i).unbind('click');
            $("#flickr" + i).removeClass("flickr-selected");
            $("#flickr" + i).append($(img));
            
            $("#flickr" + i).click({param1: i, param2: flickrImage}, function(event){
                var i = event.data.param1;
                var flickrImage = event.data.param2;
                var pptImage = $('#imageOverview').data("pptImage");

                //save flickr image
                $('#flickrOverview').data("flickrImage", flickrImage);

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
                $(newImg).attr("src", flickrImage.getMediumUrl());
                $('#flickrNew').append($(newImg));

                //ensure undo button is absent and save button is visible
                $('#flickrUndo').hide();
                $('#flickrSave').show();
                console.log("test");

                $('#flickrSearch').fadeOut(400, function() {
                    //remove whatever did have focus
                    $('#flickrSearch').removeClass('hasFocus');
                    $('#flickrOverview').addClass('hasFocus');
                    $('#flickrOverview').fadeIn(400);
                });                
            });
            
            $('#flickr-loading').hide();
            $('#flickr-results').show();
        }
    };
    
}



