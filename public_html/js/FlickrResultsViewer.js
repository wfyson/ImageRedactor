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

                //if it has already been selected, unselect it
                if ($("#flickr" + i).hasClass("flickr-selected")){
                    $("#flickr-modal").data("selectedImage", null);
                    $("#flickr" + i).removeClass("flickr-selected");
                    $("#flickr-save").addClass("disabled");
                }else{ //hasn't been selected
                    //remove anything that may have been selected
                    $(".flickr-selected").removeClass("flickr-selected");
                    //and select the new one
                    $("#flickr-modal").data("selectedImage", event.data.param2);
                    $("#flickr" + i).addClass("flickr-selected");
                    $("#flickr-save").removeClass("disabled");
                }
            });
            
            $('#flickr-loading').hide();
            $('#flickr-results').show();
        }
    };
    
}



