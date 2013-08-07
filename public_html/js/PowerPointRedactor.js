/* 
 * An overaching object that handles the whole visit to 
 * the site. Mainly responsible for storing reference to a
 * powerpoint and any change objects that may occur
 */

function PowerPointRedactor() {
    var self = this;
    self.ppt;
    self.changeArray = new Array();

    //saves a change to the redactor that it can later carry out
    self.addChange = function(change){    
        
        //ensure redact button is clickable now a change is available
        $('#redactBtn').removeClass("disabled");
        
        self.changeArray.push(change);
        //add this change to every rel that it relates to
        var rels = self.ppt.getImageRelArray();
        for (var i = 0; i < rels.length; i++){
            if (rels[i].image === change.pptImage.name){
                rels[i].setChange(change);
            }
        }       
        
        //update powerpoint
        self.ppt.setImageRelArray(rels);
        
        //reload the viewer
        var pptViewer = new PowerPointViewer(self.ppt);
        pptViewer.displayImages(self.ppt);
    };
    
    self.setPpt = function(ppt){
        self.ppt = ppt;
    };
    
    //creates and kicks of a PowerpointWriter
    self.commitChanges = function(){
        
        console.log("Redacting...");
        $('#downloadLoading').show();
        var pptWriter = new PowerPointWriter(self.ppt);
        pptWriter.readPowerPoint(); //reads the powerpoint and then writes back, with additional changes
        
    };
    
    self.getImageChange = function(pptImage){
        var changes = self.changeArray;
        for (var i = 0; i < changes.length; i++){
            var change = changes[i];
            if (change.pptImage === pptImage)
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
        var rels = self.ppt.getImageRelArray();
        for (var i = 0; i < rels.length; i++){
            if (rels[i].image === change.pptImage.name){
                rels[i].removeChange(change);
            }
        }       
        
        //update powerpoint
        self.ppt.setImageRelArray(rels);
    };
    
}




