(function($) {

    $.fn.redact = function(action) {

        return this.each(function(action) {

            if ($('#redact-modal').length === 0){
                $('body').append('<div id=\"redact-modal\"><iframe id=\"redact-modal-iframe\"></iframe></div>');

                $('#redact-modal').dialog({
                    autoOpen: false,
                    width: 1200,
                    height: 800,
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
                
            }

            $(this).click(function(e) {
                var url = "http://users.ecs.soton.ac.uk/rwf1v07/redactor/plugin.php?doc=" + this.href;            
                url = encodeURI(url);             
                $('#redact-modal-iframe').attr('src', url);
                $('#redact-modal-iframe').attr('height', "98%");
                $('#redact-modal-iframe').attr('width', "99%");
                //$('body').append('<div id=\"redact-modal\"><iframe width=\"100%\" height=\"100%\" src=\"' + url + '"></iframe></div>');
                
                
                
                e.preventDefault();
                $('#redact-modal').dialog("open");

            });

            return this;

        });
    };
}(jQuery));
