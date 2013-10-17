//file loading functionality            
function handleFileSelect(blob) {
            console.log(blob);
            var pptReader = new PowerPointReader(blob);
            powerpoint = pptReader.readPowerPoint();
            //create a redactor
            var powerpointRedactor = new PowerPointRedactor();
            $('#redactBtn').data("redactor", powerpointRedactor);

    }
