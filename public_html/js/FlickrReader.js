/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * api key = 7493f1b9adc9c0e8e55d5be46f60ddb7
 * secret = 4ea911f344f696ca
 */

/* 
 * example search
 * http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4810df9779c8f27f9c850c7c86115fe4&tags=northern+lights&license=0&sort=date-posted-asc&format=json&nojsoncallback=1&auth_token=72157633357072263-d14651d613bef358&api_sig=a1f16b19a7621d065b19ffdb11420a9a
 */

/*
 * example getInfo for a photo with an ID
 * http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=4cb26b7f09f917e2f9154d48087de93d&photo_id=8688199672&format=json&nojsoncallback=1&auth_token=72157633370337990-07d618a50f8017a0&api_sig=4b100aec61865ab07e46030837e59ed8
 */

/*
 * example getSizes for a photo with an ID
 * http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=4cb26b7f09f917e2f9154d48087de93d&photo_id=8040813531&format=json&nojsoncallback=1&auth_token=72157633370337990-07d618a50f8017a0&api_sig=5cb1a90eb0bcd81abe69059741ed5fab
 */

function FlickrReader(tags, sort, licence) {

    var self = this;
    self.tags = tags;
    self.sort = sort;
    self.licence = licence;
    self.page = 1;
    self.perPage = 10;
    self.totalPages = 0;
    self.totalResults = 0;
    
    var API_KEY = "7493f1b9adc9c0e8e55d5be46f60ddb7";
    
    self.buildQuery = function() {
        //initialise URL
        var url;
        url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
        url = url + API_KEY;
        
        //get search tags
        var tagArray = self.tags.split(" ");
        url = url + "&tags=";
        for (var i = 0; i < tagArray.length - 1; i++) {
            url = url + tagArray[i] + "+";
        }
        url = url + tagArray[tagArray.length - 1];
        
        //add the licence
        //some sort of case statement
        var licenceID;
        switch (self.licence) {
            case "Attribution":
                licenceID = 4;
                break;
            case "NoDerivs":
                licenceID = 6;
                break;
            case "NonCommercial, NoDerivs":
                licenceID = 3;
                break;
            case "NonCommercial":
                licenceID = 2;
                break;
            case "NonCommercial, ShareAlike":
                licenceID = 1;
                break;
            case "ShareAlike":
                licenceID = 5;
                break;
        }        
        url = url + "&license=" + licenceID;
        
        //add the sort parameter        
        //some sort of case statement
        var sortFormat;
        switch (self.sort) {
            case "Relevant":
                sortFormat = "relevance";
                break;
            case "Recent":
                sortFormat = "date-posted-asc";
                break;
            case "Interesting":
                sortFormat = "interestingness-asc";
                break;
        }        
        url = url + "&sort=" + sortFormat;
        
        //add the per page
        url = url + "&per_page=" + self.perPage;
        
        //add the page no
        url = url + "&page=" + self.page;
        
        //set the format
        url = url + "&format=json&nojsoncallback=1";
                
        $.getJSON(url, self.getPhotos);
    };
    
    //from the list of photos return by the search, get the photos
    //may want to read and store max page count from this too!
    self.getPhotos = function(data) {
        self.totalPages = data.photos.pages;
        self.totalResults = data.photos.total;
        self.page = data.photos.page;
        var photos = data.photos.photo;
        var getPhotoInfoUrl;
        for (var i = 0; i < photos.length; i++){
            getPhotoInfoUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=";
            getPhotoInfoUrl = getPhotoInfoUrl + API_KEY;
            
            //http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=4cb26b7f09f917e2f9154d48087de93d&photo_id=8688199672&format=json&nojsoncallback=1&auth_token=72157633370337990-07d618a50f8017a0&api_sig=4b100aec61865ab07e46030837e59ed8
        }
    };
    
    self.decrementPage = function(){
        if (self.page > 1){
            self.page--;
        }
    };
    
}


