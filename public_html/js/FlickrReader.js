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
 * http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4cb26b7f09f917e2f9154d48087de93d&tags=northern+lights&per_page=10&page=1&format=json&nojsoncallback=1&auth_token=72157633370337990-07d618a50f8017a0&api_sig=c2211ce15821c974a9733691b418feaa
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
    
    var API_KEY = "7493f1b9adc9c0e8e55d5be46f60ddb7";
    
    self.buildQuery = function(){
        //initialise URL
        var url;
        url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
        url = url + API_KEY;
        
        //get search tags
        var tagArray = self.tags.split(" ");
        url = url + "&tags="
        for (var i = 0; i < tagArray.length-1; i++){
            url = url + tagArray[i] + "+";
        }
        url = url + tagArray[tagArray.length-1];
        
        //add the per page
        url = url + "&per_page=" + self.perPage;
        
        //add the page no
        url = url + "&page=" + self.page;
        
        //set the format
        url = url + "&format=json&nojsoncallback=1";
        
        console.log(url);
        //$.getJSON("http://www.example.com/yourjsonfeed.json", callback);
        
    }


    function callback(data){
        
    } 
}
    

