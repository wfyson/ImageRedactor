//file loading functionality            
function handleFileSelect(name, blob) {
    
    /*
     * TODO - look at the file structure and determine if pptx or docx
     */
    
    
    //if ((name.substr(name.lastIndexOf("."))) === ".pptx") {
        console.log(name);
    
        var pptReader = new PowerPointReader(name, blob);
        powerpoint = pptReader.readPowerPoint();
        //create a redactor
        var powerpointRedactor = new PowerPointRedactor();
        $('#redactBtn').data("redactor", powerpointRedactor);
    //}else{
    //    if ((name.substr(name.lastIndexOf("."))) === ".docx") {
    //        var wordReader = new WordReader(name, blob);
    //        word = wordReader.readWord();
    //        //create a redactor
    //        var wordRedactor = new WordRedactor();
    //        $('#redactBtn').data("redactor", wordRedactor);
     //   }else{
            //none of the above so complain... or do we want to check this earlier on (in the JQuery plugin perhaps??)
    //    }
    //}
}
