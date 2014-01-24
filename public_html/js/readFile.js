//file loading functionality            
function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {
        //create a PowerPointReader for the file
        if ((f.name.substr(f.name.lastIndexOf("."))) === ".pptx") {
            var pptReader = new PowerPointReader(f.name, f);
            powerpoint = pptReader.readPowerPoint();
            
            //create a redactor
            var powerpointRedactor = new PowerPointRedactor();
            $('#redactBtn').data("redactor", powerpointRedactor);

            //show the approriate bottom bar
            $('#wordBar').fadeOut(400, function() {
                $('#pptBar').fadeIn(400);
            });  
            
        } else {
            if ((f.name.substr(f.name.lastIndexOf("."))) === ".docx") {
                var wordReader = new WordReader(f.name, f);
                word = wordReader.readWord();
                //create a redactor
                var wordRedactor = new WordRedactor();
                $('#redactBtn').data("redactor", wordRedactor);
                
                //show the approriate bottom bar
                $('#pptBar').fadeOut(400, function() {
                    $('#wordBar').fadeIn(400);
                });  
            }
        }
    }
}