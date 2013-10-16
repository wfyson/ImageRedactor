(function($){
    
    var shade = "#556b2f";
    
    $.fn.redact = function(action){
        
        return this.each(function(action){
            
            console.log($(this).attr('href'));

            return this;        
        });
    };
}(jQuery));
