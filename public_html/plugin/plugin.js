(function($) {

    $.fn.redact = function(action) {

        return this.each(function(action) {

            //add a modal with an iframe            
            
            
//$('body').append("<div id=\"redact-modal\"><iframe width=\"100%\" height=\"100%\" src=\"http://users.ecs.soton.ac.uk/rwf1v07/redactor/plugin.php?doc=" + this.href + "></iframe></div>");
    
            var url = "http://users.ecs.soton.ac.uk/rwf1v07/redactor/plugin.php?doc=" + this.href;
            console.log(url);
            url = encodeURI(url);
            console.log(url);
            $('body').append('<div id=\"redact-modal\"><iframe width=\"100%\" height=\"100%\" src=\"' + url + '"></iframe></div>');


            $('#redact-modal').dialog({
                autoOpen: false,
                width: 1200,
                height: 700,
                show: {
                    effect: "blind",
                    duration: 1000
                },
                hide: {
                    effect: "blind",
                    duration: 1000
                },
                modal: true
            });

            $(this).click(function(e) {
                e.preventDefault();
                $('#redact-modal').dialog("open");

            });

            return this;

        });
    };
}(jQuery));
