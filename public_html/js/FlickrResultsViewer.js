function FlickrResultsViewer(){

    var self = this;
    
    self.displayResults = function(flickrImages){
        for (var i = 0; i < flickrImages.length; i++){
            var img = document.createElement("img");
            var flickrImage = flickrImages[i]; 
            $(img).attr("src", flickrImage.getResultsUrl);
            
            //remve the old img and place the new one
            $("#flickr" + i).empty();
            $("#flickr" + i).append($(img));
        }
    };
    
}



