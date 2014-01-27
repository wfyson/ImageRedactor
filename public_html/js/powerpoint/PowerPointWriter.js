function PowerPointWriter(ppt) {
    
    var ATTRIBUTION_1 = '<p:sp> <p:nvSpPr>  <p:cNvPr id="';
    var ATTRIBUTION_2 = '" name="TextBox ';
    var ATTRIBUTION_3 = '" />   <p:cNvSpPr txBox="1" />   <p:nvPr />   </p:nvSpPr> <p:spPr> <a:xfrm>  <a:off x="';
    var ATTRIBUTION_4 = '" y="';
    var ATTRIBUTION_5 = '" />   <a:ext cx="';
    var ATTRIBUTION_6 = '" cy="';
    var ATTRIBUTION_7 = '" />   </a:xfrm> <a:prstGeom prst="rect">  <a:avLst />   </a:prstGeom>  <a:noFill />   </p:spPr> <p:txBody> <a:bodyPr wrap="square" rtlCol="0">  <a:spAutoFit />   </a:bodyPr>  <a:lstStyle />  <a:p> <a:r>  <a:rPr lang="en-GB" sz="1000" dirty="0" smtClean="0" />   <a:t>';
    var ATTRIBUTION_8 = '</a:t>   </a:r>  <a:endParaRPr lang="en-GB" sz="1000" dirty="0" />   </a:p>  </p:txBody>  </p:sp>';

    var self = this;
    self.ppt = ppt;
    self.entries = new Array();
    self.entriesCount = 0;
    self.rels = ppt.getImageRelArray();
    self.slideFiles = new Array();

    self.readPowerPoint = function() {
        console.log("reading...");
         
         //read all powerpoint entries
        zip.createReader(new zip.BlobReader(self.ppt.pptFile), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
                self.totalEntries = entries.length;
                processEntries(entries, 0);
            });
        }, function(error) {
            console.log(error);
        });
        
        function processEntries(entries, i){
            var entry = entries[i];
            var entries = entries;
            
            if (entry.filename.substr(entry.filename.lastIndexOf(".")) === ".xml") {
                console.log("XML");
                entry.getData(new zip.TextWriter('utf-8'), function(text, entry){
                    self.entries.push(new EntryData(text, entry.filename));
                    i++;
                    if (i === self.totalEntries) {
                        self.writePowerPoint(self.entries);
                    } else {
                        processEntries(entries, i);
                    }
                });
            } else {
                console.log("OTHER");
                entry.getData(new zip.BlobWriter(), function(data, entry) {
                    self.entries.push(new EntryData(data, entry.filename));
                    i++;
                    if (i === self.totalEntries) {
                        self.writePowerPoint(self.entries);
                    } else {
                        processEntries(entries, i);
                    }
                });
            }
        }
    };

    self.writePowerPoint = function(contents) {

        function onProgress(a, b) {
            //console.log("current", a, "end", b);
        }

        //zip.workerScriptsPath = "/js/zip/";
        //zip.useWebWorkers = false;
        var media = 0;
        var zipper = (function() {

            var zipWriter;

            return {
                addTexts: function(files, callback /* [2] new parameter */) {

                    function add(fileIndex) {  
                        if (fileIndex < self.entries.length) {                                
                            var fileName = self.entries[fileIndex].name;
                            $('#download').data("filename", fileName);
                            $('#download').data("fileindex", fileIndex);
                            if (fileName.indexOf("ppt/media") !== -1) {
                                console.log(fileName);
                                media++;
                                console.log("media..." + media);
                                //in the media directory
                                //record image as having yet to be changed
                                var imageChanged = false;

                                //now get all the rels relating to this file
                                var imageName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.lastIndexOf("."));
                                var imageRels = self.ppt.getImageRels(imageName);
                                
                                if (imageRels.length === 0){
                                    //this image isn't used so just write it back to the zip
                                    zipWriter.add(fileName, new zip.BlobReader(self.entries[fileIndex].data), function() {
                                        //update the global writer
                                        $('#download').data("writer", zipWriter);
                                        add(fileIndex + 1); /* [1] add the next file */
                                    }, onProgress);                                 
                                    
                                }else{
                                
                                    for (var i = 0; i < imageRels.length; i++) {
                                        var imageRel = imageRels[i];
                                        if (imageRel.hasChange()) {

                                            //write the change to the powerpoint
                                            var change = imageRel.getChange();

                                            //image has yet to be changed, so write the change...
                                            if (!imageChanged) {
                                                imageChanged = true;
                                                if (change.getType() === "placeholder") {
                                                    var newSrc = change.newImageSrc;
                                                    var licence = change.licence;
                                                    var phpUrl = "php/imagegrabber.php?callback=?";
                                                    $.getJSON(phpUrl, {src: newSrc, licence: licence, changeType: "placeholder"},
                                                    function(res) {
                                                        zipWriter.add(fileName, new zip.Data64URIReader(res.result), function() {
                                                            //update the global writer
                                                            $('#download').data("writer", zipWriter);
                                                            add(fileIndex + 1);
                                                        }, function() {
                                                        });
                                                    });
                                                }

                                                if (change.getType() === "cc") {
                                                    var newSrc = change.newImageSrc;
                                                    var licence = change.licence;
                                                    var phpUrl = "php/imagegrabber.php?callback=?";
                                                    $.getJSON(phpUrl, {src: newSrc, licence: licence, changeType: "cc"},
                                                    function(res) {
                                                        console.log("result");
                                                        zipWriter.add(fileName, new zip.Data64URIReader(res.result), function() {
                                                            //update the global writer
                                                            $('#download').data("writer", zipWriter);
                                                            add(fileIndex + 1);
                                                        }, function() {
                                                        });
                                                    });
                                                }

                                                if (change.getType() === "flickr") {
                                                    console.log(change.newImageSrc);
                                                    var newSrc = change.newImageSrc;
                                                    var licence = change.licence;
                                                    console.log(change.licence);
                                                    var phpUrl = "php/imagegrabber.php?callback=?";
                                                    $.getJSON(phpUrl, {src: newSrc, licence: licence, changeType: "flickr"},
                                                    function(res) {
                                                        zipWriter.add(fileName, new zip.Data64URIReader(res.result), function() {
                                                            //update the global writer
                                                            $('#download').data("writer", zipWriter);
                                                            add(fileIndex + 1);
                                                        }, function() {
                                                        });
                                                    });
                                                }
                                            }

                                            //if the image format has changed then the powerpoint slide rels need to be updated
                                            //TODO!!!! (possibly)    

                                        } else {
                                            //there is no change to commit for this rel
                                            //just write the original image
                                            if (!imageChanged) {
                                                imageChanged = true;
                                                zipWriter.add(fileName, new zip.BlobReader(self.entries[fileIndex].data), function() {
                                                    //update the global writer
                                                    $('#download').data("writer", zipWriter);
                                                    add(fileIndex + 1); /* [1] add the next file */
                                                }, onProgress);
                                            }
                                        }
                                    }
                                }
                            } else {
                                //not a media file, just write like normal
                                if (fileName.substr(fileName.lastIndexOf(".")) === ".xml"){
                                    zipWriter.add(fileName, new zip.TextReader(self.entries[fileIndex].data), function() {
                                        //update the global writer
                                        $('#download').data("writer", zipWriter);
                                        add(fileIndex + 1); /* [1] add the next file */
                                    }, onProgress);
                                }else{
                                    zipWriter.add(fileName, new zip.BlobReader(self.entries[fileIndex].data), function() {
                                        //update the global writer
                                        $('#download').data("writer", zipWriter);
                                        add(fileIndex + 1); /* [1] add the next file */
                                    }, onProgress);
                                }
                                
                            }
                        } else {
                            callback() /* [2] no more files to add: callback is called */;
                        }
                    }

                    zip.createWriter(new zip.BlobWriter(), function(writer) {
                        zipWriter = writer;

                        //add the writer to the download button
                        $('#download').data("writer", zipWriter);

                        add(0); /* [1] add the first file */
                    });
                },
                getBlob: function(callback) {
                    zipWriter.close(callback);
                }
            };
        })();
        
        //go through all the rels and adjust slides accordingly to add captions to the new images
        var rels = self.ppt.getImageRelArray();
        for (var i = 0; i < rels.length; i++){
            var imageRel = rels[i];
            if (imageRel.hasChange()) {
                
                //create the citation text
                var change = imageRel.getChange();                
                var citation = null;
                if (change.getType() === "flickr") {
                    citation = '"' + change.getTitle() + '" by ' + change.getAuthor() +", " + change.licence; 
                }else{
                    if (change.getType() === "cc"){
                        citation = change.licence;
                    }
                }
                
                if (citation !== null){
                    
                    //get search terms depending on browser - may need to look into this more..
                    var cNvPr = "p\\:cNvPr";
                    var pic = "p\\:pic";
                    var blipFill = "p\\:blipFill";
                    var blip = "a\\:blip";
                    var spPr = "p\\:spPr";
                    var offTag = "a\\:off";
                    var extTag = "a\\:ext";
                    var background = "p\\:bg";                   
                    if (window.webkitURL) {
                        cNvPr = "cNvPr";
                        pic = "pic";
                        blipFill = "blipFill";
                        blip = "blip";
                        spPr = "spPr";
                        offTag = "off";
                        extTag = "ext";
                        background = "bg";
                    }
                
                    var entries = self.entries;
                    for (var j = 0; j < entries.length; j++) {

                        var entry = entries[j];
                        var slideFile = imageRel.slide + ".xml";
                        if (entry.name.indexOf("ppt/slides/" + slideFile) !== -1) {

                            //get greatest id for document elements in the xml and the greatest textbox number
                            var xmlDoc = $.parseXML(entry.data);
                            var tags = $(xmlDoc).find(cNvPr); 
                            var id = 1;
                            var textNo = 1;
                            tags.each(function(key) {
                                var tag = tags[key];
                                if ($(tag).attr('id') >= id) {
                                    id = $(tag).attr('id');
                                }
                                var name = $(tag).attr('name');
                                if (name.indexOf("TextBox") !== -1) {
                                    var number = parseInt((name.substr(name.lastIndexOf(" ") + 1)));
                                    if (number >= textNo) {
                                        textNo = number;
                                    }
                                }
                            });
                            
                            //find all of the picture elements to get the location and then append a text box
                            var pics = $(xmlDoc).find(pic);
                            pics.each(function(key) {
                                if (imageRel.relID === $($(pics[key]).find(blipFill).find(blip)[0]).attr('r:embed')) {                       
                                    //get the location                                                        
                                    var off = $(pics[key]).find(spPr).find(offTag)[0];
                                    var ext = $(pics[key]).find(spPr).find(extTag)[0];
                                    //position
                                    var offX = $(off).attr('x');
                                    var offY = parseInt($(off).attr('y')) + parseInt($(ext).attr('cy'));
                                    //size
                                    var extX = $(ext).attr('cx');
                                    var extY = '246221';
                                    
                                    //append a new text box to the document for all locations of that image
                                    var xmlString = entries[j].data;
                                    var startIndex = 0;
                                    var indices = new Array();
                                    var searchStrLen = imageRel.relID.length;
                                    while ((index = xmlString.indexOf(imageRel.relID, startIndex)) > -1) {                    
                                        indices.push(index);
                                        startIndex = index + searchStrLen;
                                    }
                                    //for each location of the image place the new text box immediately after the end of the pic element
                                    for (x = 0; x < indices.length; x++) {
                                        var newLocation = xmlString.indexOf("</p:pic>", indices[x]) + 8;
                                        var newXml = xmlString.splice(newLocation, 0, (ATTRIBUTION_1 + (parseInt(id) + 1) + ATTRIBUTION_2 + (textNo + 1) +
                                                ATTRIBUTION_3 + offX + ATTRIBUTION_4 + offY + ATTRIBUTION_5 + extX +
                                                ATTRIBUTION_6 + extY + ATTRIBUTION_7 + citation + ATTRIBUTION_8));   
                                        self.entries[j].data = newXml;
                                    }
                                }
                            });
                            
                            //check the background element and add caption to bottom of slide if new picture is the background
                            var background = $(xmlDoc).find(background);
                            if (background.length){
                                if (imageRel.relID === $($(background).find(blip)[0]).attr('r:embed')){
    
                                    //the image is used for the background - add a caption to the spTree
                                    var xmlString = entries[j].data;
                                    var newLocation = xmlString.indexOf("</p:grpSpPr>") + 12;
                                    
                                    //position
                                    var offX = '0';
                                    var offY = self.ppt.getSlideHeight() - 246221; //Y coordinate of bottom of slide - standard height of caption
                                    //size
                                    var extX = '5515151';
                                    var extY = '246221';
                                    
                                    textNo++;
                                    id++;
                                    
                                    citation = "Background: " + citation;
                                    
                                    var newXml = xmlString.splice(newLocation, 0, (ATTRIBUTION_1 + id + ATTRIBUTION_2 + textNo +
                                                ATTRIBUTION_3 + offX + ATTRIBUTION_4 + offY + ATTRIBUTION_5 + extX +
                                                ATTRIBUTION_6 + extY + ATTRIBUTION_7 + citation + ATTRIBUTION_8));
                                       
                                    self.entries[j].data = newXml;
                                }
                            }
                        }
                    } 
                }
            }
        }
        
        //captions have been added to slides... now write the powerpoint
        zipper.addTexts(contents, function() {
            zipper.getBlob(function(blob) {
                var blobURL;
                if (window.webkitURL) {
                    blobURL = window.webkitURL.createObjectURL(blob);
                } else if (window.URL && window.URL.createObjectURL) {
                    blobURL = window.URL.createObjectURL(blob);
                } else {
                    blobURL = null;
                }
                $('#downloadLoading').hide();
                $('#downloadLabel').show();
                
                var a = document.createElement('a');
                
                var filename = ppt.name.substring(0, ppt.name.lastIndexOf(".pptx")) + "_redacted.pptx";
                
                $(a).attr('id', 'downloadLink');
                $(a).attr('href', blobURL);
                $(a).attr('download', filename);
                $(a).append(filename);
                $('#download').append($(a));   
                console.log("done");
            });
        });
    };

    self.increment = function() {
        self.entriesCount++;
        if (self.entriesCount === self.totalEntries) {
            console.log("writing");
            self.writePowerPoint(self.entries);
        }
    };
}

function EntryData(data, name) {

    var self = this;
    self.data = data;
    self.name = name;
    
    self.setData = function(data){
        self.data = data;
    };
}

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};
