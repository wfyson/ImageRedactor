function WordReader(name, wordFile) {

    var self = this;
    self.wordFile = wordFile;
    self.noEntries = 0;
    self.totalEntries;
    self.word = new Word(name, wordFile);

    var IMAGE_REL_TYPE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";

    self.readWord = function() {
        // use a BlobReader to read the zip from a Blob object
        zip.createReader(new zip.BlobReader(self.wordFile), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
                if (entries.length){
                    self.totalEntries = entries.length;                
                    processEntries(entries, 0);
                }
            });
        }, function(error) {
            console.log(error);
        });
        
        function processEntries(entries, i){
            var entry = entries[i];
            var entries = entries;
            var i = i;

            //if media file then create a PowerPointImage
            if ((entry.filename).indexOf("word/media/") !== -1) {
                //get the data for that media
                entry.getData(new zip.BlobWriter(), function(data, entry) {
                    var filename, wordImage, name, format;
                    filename = entry.filename;
                    name = filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf("."));
                    format = filename.substr(filename.lastIndexOf("."));
                    wordImage = new WordImage(name, format, data, function(wordImage){
                        self.word.addImage(wordImage);                    
                        i++;
                        if (i === self.totalEntries){
                            self.displayWord();
                        }else{
                            processEntries(entries, i);
                        }
                    });           
                }, function(current, total) {
                    // onprogress callback
                });
            }else{
                //if a slides rel file
                if ((entry.filename).indexOf("word/_rels") !== -1) {
                    entry.getData(new zip.TextWriter('utf-8'), function(text, entry) {
                        var filename, xmlDoc, rels, target, imageName;
                        filename = entry.filename;                        
                        xmlDoc = $.parseXML(text);
                        rels = $(xmlDoc).find("Relationship");
                        if (rels.length) {
                            for (var j = 0; j < rels.length; j++) {
                                if ($(rels[j]).attr("Type") === IMAGE_REL_TYPE) {
                                    target = $(rels[j]).attr("Target");
                                    imageName = target.substring(target.lastIndexOf("/") + 1, target.lastIndexOf("."));
                                    slideImageRel = new SlideImageRel(-1, -1, imageName, false);
                                    self.word.addSlideImageRel(slideImageRel);
                                }
                            }
                        }
                        
                        i++;
                        if (i === self.totalEntries){
                            self.displayWOrd();
                        }else{
                            processEntries(entries, i);
                        }
                        
                        //self.increment();
                    }, function(current, total) {
                        //onprogress callback
                       });
                } else {
                    i++;
                    if (i === self.totalEntries){
                        self.displayWord();
                    }else{
                        processEntries(entries, i);
                    }
                }
          }
        }
    };
         
    self.callbackTest = function() {
        console.log("Job Done...");
    };

    self.displayWord = function() {
        $('#redactBtn').data("redactor").setWord(self.word);
        
        $('#redactBtn').addClass("disabled");
        //console.log($('#download a'));
        $('#download a').attr('href', '')
            .attr('download', '')
            .empty();
                
        
        
        var wordViewer = new WordViewer(self.word);
        wordViewer.displayOverview(self.word);
        wordViewer.displayImages(self.word);
    };

}