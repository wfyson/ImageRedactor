//file loading functionality            
function handleFileSelect(name, blob) {
    
    /*
     * TODO - look at the file structure and determine if pptx or docx
     */
    
    //read the blob object
    zip.createReader(new zip.BlobReader(blob), function(reader){
        reader.getEntries(function(entries){
            for (var i = 0; i < entries.length; i++){      
                if (entries[i].filename === "ppt/presentation.xml"){
                    //dealing with a PowerPoint file
                    var pptReader = new PowerPointReader(name, blob);
                    powerpoint = pptReader.readPowerPoint();
                    
                    //create a redactor
                    var powerpointRedactor = new PowerPointRedactor();
                    $('#redactBtn').data("redactor", powerpointRedactor);                   
                    
                    //created a reader so now kill for loop
                    break;
                }
                if (entries[i].filename === "word/document.xml"){
                    //dealing with a Word file
                    var wordReader = new WordReader(name, blob);
                    word = wordReader.readWord();
            
                    //create a redactor
                    var wordRedactor = new WordRedactor();
                    $('#redactBtn').data("redactor", wordRedactor);
                    
                    //created a reader so now kill for loop
                    break;
                }
            }
            //not an appropriate file, so complain...
            
            
        });
    });
}
