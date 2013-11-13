/* 
 * An overaching object that handles the whole visit to 
 * the site. Mainly responsible for storing reference to a
 * powerpoint and any change objects that may occur
 */

function WordRedactor() {
    var self = this;
    self.word;
    self.changeArray = new Array();

    //saves a change to the redactor that it can later carry out
    self.addChange = function(change){    

        //ensure redact button is clickable now a change is available
        $('#redactBtn').removeClass("disabled");
        
        self.changeArray.push(change);
        //add this change to every rel that it relates to
        var rels = self.word.getImageRelArray();
        for (var i = 0; i < rels.length; i++){
            if (rels[i].image === change.pptImage.name){
                rels[i].setChange(change);
            }
        }       
        
        //update powerpoint
        self.word.setImageRelArray(rels);
        //reload the viewer - not sure why this used to happen, seems unnecessary
        //var pptViewer = new PowerPointViewer(self.ppt);
        //pptViewer.displayImages(self.ppt);
    };
    
    self.setWord = function(word){
        self.word = word;
    };
    
    //creates and kicks of a PowerpointWriter
    self.commitChanges = function(){
        
        console.log("Redacting...");
        $('#downloadLink').empty();
        $('#downloadLabel').hide();
        $('#downloadLoading').show();
        var wordWriter = new WordWriter(self.word);
        wordWriter.readWord(); //reads the powerpoint and then writes back, with additional changes
        
    };
    
    self.getImageChange = function(wordImage){
        var changes = self.changeArray;
        for (var i = 0; i < changes.length; i++){
            var change = changes[i];
            if (change.pptImage === wordImage)
                return change;
        }
        return false;
    };
    
    self.removeChange = function(change){
        var changes = self.changeArray;
        for (var i = 0, length = changes.length; i < length; i++){
            if (changes[i] === change){
                self.changeArray.splice(i, 1);
            }
        }          
        
        //remove this change to every rel that it relates to
        var rels = self.word.getImageRelArray();
        for (var i = 0; i < rels.length; i++){
            if (rels[i].image === change.pptImage.name){
                rels[i].removeChange(change);
            }
        }
        
        //if all changes have been removed disable redact button
        if (self.changeArray.length === 0)
            $('#redactBtn').addClass("disabled");
        
        //update powerpoint
        self.word.setImageRelArray(rels);
    };
    
}




