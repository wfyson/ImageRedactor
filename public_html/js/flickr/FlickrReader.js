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

function FlickrReader(search, tags, sort, commercial, derivative) {

    var self = this;
    self.search = search;
    self.tags = tags;
    self.sort = sort;
    self.commercial = commercial;
    self.derivative = derivative;
    self.page = 1;
    self.perPage = 15;
    self.totalPages = 0;
    self.totalResults = 0;
    self.results = new Array();
    self.noResults = 0;

    var API_KEY = "7493f1b9adc9c0e8e55d5be46f60ddb7";

    //assign next and previous functionality    
    $("#flickrPrev").click(function() {
        if (!$('#flickrPrev').hasClass('disabled')){
            if (self.page > 1) {
                self.page--;
                self.buildQuery(self.search);
            }
        }
    });
    
    $("#flickrNext").click(function() {
        if (!$('#flickrNext').hasClass('disabled')){
            if (self.page < self.totalPages) {
                self.page++;
                self.buildQuery(self.search);
            }
        }
    });

    //ensure both buttons are disabled initially
    $("#flickr-prev").addClass("disabled");
    $("#flickr-next").addClass("disabled");
    
    self.buildQuery = function(search){
        switch (search) {
            case "flickr":
                self.buildFlickrQuery();
                break;
            case "google":
                self.buildGoogleQuery();
                break;
            case "clipart":
                self.buildClipartQuery();
                break;            
        }
    };
    
    self.buildFlickrQuery = function(){
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
        var licence;
        if ((commercial === true) && (derivative === true)){
            licence = "4,5,7";
        }else{
            if (commercial === true){
                licence = "4,5,6,7";
            }else{
                if (derivative === true){
                    licence="1,2,4,5,7";
                }else{
                    licence="1,2,3,4,5,6,7";
                }
            }
        }
        
        url = url + "&license=" + licence;
        
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
        $.getJSON(url, self.getFlickrPhotos);
        $('#flickr-results').hide();
        $('#flickr-loading').show();        
    };
    
    //from the list of photos return by the search, get the photos
    //may want to read and store max page count from this too!
    self.getFlickrPhotos = function(data){
        self.totalPages = data.photos.pages;
        self.totalResults = data.photos.total;
        self.page = data.photos.page;
        self.results = new Array();

        if (self.page < self.totalPages) {
            $("#flickrNext").removeClass("disabled");
        }
        if (self.page === self.totalPages) {
            $("#flickrNext").addClass("disabled");
        }
        if (self.page > 1) {
            $("#flickrPrev").removeClass("disabled");
        }
        if (self.page === 1) {
            $("#flickrPrev").addClass("disabled");
        }
        var photos = data.photos.photo;
        self.noResults = photos.length;
        var imageID, flickrImage;
        for (var i = 0; i < photos.length; i++) {
            imageID = photos[i].id;
            flickrImage = new FlickrImage(imageID);
            self.getFlickrPhotoInfo(flickrImage);
        }
    };
    
    self.getFlickrPhotoInfo = function(flickrImage) {
        var photoInfoUrl;
        photoInfoUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=";
        photoInfoUrl = photoInfoUrl + API_KEY;
        photoInfoUrl = photoInfoUrl + "&photo_id=" + flickrImage.imageID;
        photoInfoUrl = photoInfoUrl + "&format=json&nojsoncallback=1";
        $.getJSON(photoInfoUrl, function(data) {
            flickrImage.setAuthor(data.photo.owner.username);
            flickrImage.setTitle(data.photo.title._content);
            flickrImage.setLicence(data.photo.license);
            self.getFlickrPhotoSizes(flickrImage);
        });
    };
    
    self.getFlickrPhotoSizes = function(flickrImage) {
        var photoSizesUrl;
        photoSizesUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=";
        photoSizesUrl = photoSizesUrl + API_KEY;
        photoSizesUrl = photoSizesUrl + "&photo_id=" + flickrImage.imageID;
        photoSizesUrl = photoSizesUrl + "&format=json&nojsoncallback=1";
        //photoSizesUrl = photoSizesUrl + "&jsoncallback=myCallbackFunction";
        //console.log(photoSizesUrl);
        // $.ajax({url: photoSizesUrl,
        //     dataType: 'jsonp'
        // });
      
        $.getJSON(photoSizesUrl, function(data) {
            flickrImage.setSizes(data.sizes.size);
            self.results.push(flickrImage);
            if (self.results.length === self.noResults) {
                //all results have been generated, send array to a results viewer
                var flickrResultsViewer = new FlickrResultsViewer();                
                flickrResultsViewer.displayResults(self.results);
            }
        });
    };
    
    self.buildClipartQuery = function(){
        //initialise URL
        var url;
        url = "http://openclipart.org/search/json/";
        

        //get search tags
        var tagArray = self.tags.split(" ");
        url = url + "?query=";
        for (var i = 0; i < tagArray.length - 1; i++) {
            url = url + tagArray[i] + "+";
        }
        url = url + tagArray[tagArray.length - 1];

        //add the page no
        url = url + "&page=" + self.page;

        //add the per page
        url = url + "&amount=" + self.perPage;        
        url = url + "&callback=?";
        console.log(url);
        //set the format
        $.getJSON(url, null, function(data){            
            //self.getClipartPhotos(data);
        });
        $('#flickr-results').hide();
        $('#flickr-loading').show();        
    };
    
    //from the list of photos return by the search, get the photos
    //may want to read and store max page count from this too!
    self.getClipartPhotos = function(data){
        self.totalPages = data.info.pages;
        self.totalResults = data.info.results;
        self.page = data.info.current_page;
        self.results = new Array();
        if (self.page < self.totalPages) {
            $("#flickrNext").removeClass("disabled");
        }
        if (self.page === self.totalPages) {
            $("#flickrNext").addClass("disabled");
        }
        if (self.page > 1) {
            $("#flickrPrev").removeClass("disabled");
        }
        if (self.page === 1) {
            $("#flickrPrev").addClass("disabled");
        }
        var photos = data.payload;
        self.noResults = photos.length;
        var imageID, clipartImage;
        for (var i = 0; i < photos.length; i++) {
            imageID = photos[i].title;
            clipartImage = new FlickrImage(imageID);
            clipartImage.setTitle(photos[i].title);
            clipartImage.setAuthor(photos[i].uploader);
            clipartImage.setLicence("CC0");
            
            var thumbnail = new Size("Thumbnail", photos[i].tbUrl);
            var medium = new Size("Medium", photos[i].url);
            var sizes = [thumbnail, medium];
            
            clipartImage.setSizes(sizes);
                                        
            self.results.push(clipartImage);
            if (self.results.length === self.noResults) {
                //all results have been generated, send array to a results viewer
                var flickrResultsViewer = new FlickrResultsViewer();                
                flickrResultsViewer.displayResults(self.results);
            }        
        }
    };    
    
    self.buildGoogleQuery = function(){
        //initialise URL
        var url;
        url = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0";

        //get search tags
        var tagArray = self.tags.split(" ");
        url = url + "&q=";
        for (var i = 0; i < tagArray.length - 1; i++) {
            url = url + tagArray[i] + "%20";
        }
        url = url + tagArray[tagArray.length - 1];

        //add the licence
        var licence;
        if ((commercial === true) && (derivative === true)){
            licence = "(cc_publicdomain|cc_attribute|cc_sharealike).-(cc_noncommercial|cc_nonderived)";
        }else{
            if (commercial === true){
                licence = "(cc_publicdomain|cc_attribute|cc_sharealike|cc_nonderived).-(cc_noncommercial)";
            }else{
                if (derivative === true){
                    licence="(cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercial).-(cc_nonderived)";
                }else{
                    licence="";
                }
            }
        }
        
        url = url + "&as_rights=" + licence;

        //add the per page
        url = url + "&rsz=8";

        //add the page no
        url = url + "&start=" + ((self.page-1) * 8);
        
        url = url + "&callback=?";
 

        //set the format
        //url = url + "&format=json&nojsoncallback=1";
        console.log(url);
        
        $.getJSON(url, null, function(data){
           self.getGooglePhotos(data);
        });
        $('#flickr-results').hide();
        $('#flickr-loading').show();        
    };
    
    //from the list of photos return by the search, get the photos
    //may want to read and store max page count from this too!
    self.getGooglePhotos = function(data){
        self.totalPages = data.responseData.cursor.pages.length;
        self.results = new Array();
        if (self.page < self.totalPages) {
            $("#flickrNext").removeClass("disabled");
        }
        if (self.page === self.totalPages) {
            $("#flickrNext").addClass("disabled");
        }
        if (self.page > 1) {
            $("#flickrPrev").removeClass("disabled");
        }
        if (self.page === 1) {
            $("#flickrPrev").addClass("disabled");
        }
        var photos = data.responseData.results;
        self.noResults = photos.length;
        var imageID, googleImage;
        for (var i = 0; i < photos.length; i++) {
            imageID = photos[i].imageId;
            googleImage = new FlickrImage(imageID);      
            
            //strip html tags from title of image
            var div = document.createElement("div");
            div.innerHTML = photos[i].title;
            googleImage.setTitle(div.innerText);
            
            googleImage.setAuthor(photos[i].originalContextUrl);
            googleImage.setLicence(self.getLicence(commercial, derivative));
            
            var thumbnail = new Size("Thumbnail", photos[i].tbUrl);
            var medium = new Size("Medium", photos[i].url);
            var sizes = [thumbnail, medium];
            
            googleImage.setSizes(sizes);
            //console.log(googleImage);                            
            self.results.push(googleImage);
            if (self.results.length === self.noResults) {
                //all results have been generated, send array to a results viewer
                var flickrResultsViewer = new FlickrResultsViewer();                
                flickrResultsViewer.displayResults(self.results);
            }
            
            
            
        }
    };
    
    //a function for returning a licence when licence is not intrinsically associated with the picture
    //provies an estimate licence based on the search criteria
    self.getLicence = function(commercial, derivative){
        var licence;
        if ((commercial === true) && (derivative === true)){
            licence = "Attribute";
        }else{
            if (commercial === true){
                licence = "Attribute, Non-derivatives";
            }else{
                if (derivative === true){
                    licence="Attribute, Non-commercial";
                }else{
                    licence="Attribute, Non-commercial, Non-derivatives";
                }
            }
        } 
        return licence;
    };
    
}

function Size(label, source){
    var self = this;
    self.label = label;
    self.source = source;        
}

