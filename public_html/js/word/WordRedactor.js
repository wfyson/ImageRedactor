/* 
 * An overaching object that handles the whole visit to 
 * the site. Mainly responsible for storing reference to a
 * powerpoint and any change objects that may occur
 */

function WordRedactor() {
    var self = this;
    self.word;
    self.changeArray = new Array();
    self.sectionArray = new Array();
    self.anchorArray = new Array();

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
    
    //record the id of a section that needs to be redacted
    self.addSectionChange = function(sectionID, anchor){
        if ($.inArray(sectionID, self.sectionArray) === -1){        
            self.sectionArray.push(sectionID);
            
            if (anchor !== null){
                self.anchorArray.push(anchor);
            }            
        
            //ensure redact button is clickable now a change is available
            $('#redactBtn').removeClass("disabled");
        }
        
    };
    
    self.removeSectionChange = function(sectionID, anchor){
        var sectionIndex = self.sectionArray.indexOf(sectionID);
        if (sectionIndex > -1){
            self.sectionArray.splice(sectionIndex, 1);        
        }
        
        var anchorIndex = self.anchorArray.indexOf(anchor);
        if (anchorIndex > -1){
            self.anchorArray.splice(anchorIndex, 1);                    
        }
        
        //check number of changes
        self.checkChanges();
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
        
        //check number of changes
        self.checkChanges();            
        
        //update powerpoint
        self.word.setImageRelArray(rels);
    };
    
    //check if there are any changes
    self.checkChanges = function(){
        if ((self.changeArray.length === 0) && (self.sectionArray.length === 0)){
            //there are no changes at all so disable redact button
            $('#redactBtn').addClass("disabled");
        }
    };
    
    self.isSectionChange = function(sectionID){
        if ($.inArray(sectionID, self.sectionArray) === -1)
            return false;
        else
            return true;
    };
    
    self.isAnchorChange = function(anchor){
        if ($.inArray(anchor, self.anchorArray) === -1)
            return false;
        else
            return true;        
    };
    
}




