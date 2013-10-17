<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        
        <title>Redact-O-Matic</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.min.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap-fileupload.min.css">
        <link rel="stylesheet" type="text/css" href="css/bootstrap-arrows.css">        
        <link rel="stylesheet" type="text/css" href="css/jquery.Jcrop.css">         
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/skin.css"> 
        

        <script type="text/javascript" src="js/libs/zip.js"></script>
        <script type="text/javascript" src="js/libs/zip-ext.js"></script>
        <script type="text/javascript" src="js/libs/exif.js"></script>
        <script type="text/javascript" src="js/libs/binaryajax.js"></script>

        <script type="text/javascript" src="js/libs/jquery-1.9.0/jquery.min.js"></script>
        <script type="text/javascript" src="js/libs/jqueryui-1.10.0/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/libs/jquery.exif.js"></script>

        <script type="text/javascript" src="js/libs/bootstrap.js"></script>
        <script type="text/javascript" src="js/libs/bootstrap-fileupload.min.js"></script>
        <script type="text/javascript" src="js/libs/bootstrap-arrows.js"></script>

        <script type="text/javascript" src="js/libs/jquery.jcarousel.js"></script>
        <script type="text/javascript" src="js/libs/jquery.jcarousel.min.js"></script>

        <script type="text/javascript" src="js/libs/jquery.Jcrop.min.js"></script>     
        
        <script type="text/javascript" src="js/libs/pixastic.custom.js"></script>     
                
        <script type="text/javascript" src="js/control.js"></script>
        <script type="text/javascript" src="js/readURL.js"></script>
        
        <script type="text/javascript" src="js/PowerPointReader.js"></script>
        <script type="text/javascript" src="js/PowerPointImage.js"></script>
        <script type="text/javascript" src="js/PowerPoint.js"></script>
        <script type="text/javascript" src="js/SlideImageRel.js"></script>

        <script type="text/javascript" src="js/PowerPointViewer.js"></script>

        <script type="text/javascript" src="js/Change.js"></script>
        <script type="text/javascript" src="js/PowerPointWriter.js"></script>

        <script type="text/javascript" src="js/PowerPointRedactor.js"></script>

        <script type="text/javascript" src="js/FlickrReader.js"></script>
        <script type="text/javascript" src="js/FlickrImage.js"></script>
        <script type="text/javascript" src="js/FlickrResultsViewer.js"></script>
        
        <script type="text/javascript" src="js/Word.js"></script>
        <script type="text/javascript" src="js/WordImage.js"></script>
        <script type="text/javascript" src="js/WordReader.js"></script>
        <script type="text/javascript" src="js/WordRedactor.js"></script>
        <script type="text/javascript" src="js/WordViewer.js"></script>
        <script type="text/javascript" src="js/WordWriter.js"></script>

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    </head>
    <body>

        <div id="title">
            <img src="img/title.png"/>
        </div>
        
        <div class="container-fluid">

            <div id="imageOverview" class="row-fluid">
                
                <div id="imageWindow" class="span9">
                
                    <span id="instructions" class="hasFocus">
                        <img src="img/instructions.png"/>
                    </span>
                    
                    <span id="pptImage">
                        <span class="helper"></span>
                    </span>   
                    
                    <!-- Overview -->
                    <div id="overview">
                        <h2>Overview</h2>
                        <div class="overviewField">
                            <h4>
                                Name:
                            </h4>
                            <div id="pptName">                            
                            </div>
                        </div>
                        <div class="overviewField">
                            <h4>
                                Total Images:
                            </h4>
                            <div id="totalImages">
                            </div>

                        </div>
                        <div class="overviewField">
                            <h4>
                                Licenced Images:
                            </h4>
                            <div id="licencedImages">
                            </div>

                        </div>
                        <div class="overviewField">
                            <h4>
                                Most restrictive licence:
                            </h4>
                            <div id="overallLicence">
                            </div>

                        </div>
                        <div class="overviewField">
                            <h4>
                                Progress:
                            </h4>
                            <div class="progress progress-striped"> <!-- consider implementing stacked bar to show types of licence -->
                                <div id="progressCC" class="bar bar-success"></div>
                                <div id="progressOther" class="bar bar-warning"></div>
                                <div id="progressNull" class="bar bar-danger"></div>
                            </div> 
                        </div>                   
                    </div>
                    
                    <!-- placeholder -->
                    <span id="placeholderOverview">                        
                        <span class="placeholderHelper"></span>
                        <span id="placeholderOld">
                        </span>
                        <span id="placeholderArrow">
                            <span class="arrow-primary-large" data-angle="90"></span>
                        </span>
                        <span id="placeholderNew">
                            <!--<canvas id="placeholderCanvas"></canvas>-->
                            <img id="placeholderPixelated" class="placeholderImage" src="img/placeholder.jpg"/>
                        </span>  
                        <button id="placeholderSave" class="btn btn-primary">Save</button>
                        <button id="placeholderUndo" class="btn btn-danger">Undo</button>
                    </span>

                    <!-- Flickr Search -->
                    <div id="flickrSearch"> 
                        <!-- Flickr Search Form -->
                        <form id="flickr" class="form-inline">
                            <input type="text" class="input-medium search-query flickrForm" placeholder="Search" name="tags" id="tags">

                            <label class="multiple flickrForm" for="sort">Sort:</label>
                            <select id="sort" name="sort" class="input-medium">
                                <option>Relevant</option>
                                <option>Recent</option>
                                <option>Interesting</option>
                            </select>
                            <label class="multiple flickrForm" for="licence">Licence:</label>
                            <select id="flickrLicence" name="licence" class="input-medium">
                                <option>Attribution (CC BY)</option>
                                <option>ShareAlike (CC BY-SA)</option>
                                <option>NoDerivs (CC BY-ND)</option>
                                <option>NonCommercial (CC BY-NC)</option>
                                <option>NonCommercial, ShareAlike (CC BY-NC-SA)</option>
                                <option>NonCommercial, NoDerivs (CC BY-NC-ND)</option>
                            </select>
                            <button type="submit" class="btn flickrForm">Search</button>
                        </form>
                        
                        <!-- Flickr Results -->
                        <div id="flickr-loading">
                            <span class="flickrHelper"></span>
                            <img src="img/ajax-loader.gif"/>
                        </div>
                        <div id="flickr-results" class="row">
                            <div id="flickrPrev" class="span1 disabled"></div>
                            <div id="resultImages" class="span10">
                                <div class="row flickr-row">
                                    <div id="flickr0" class="span2 offset1">
                                    </div>
                                    <div id="flickr1" class="span2">
                                    </div>
                                    <div id="flickr2" class="span2">
                                    </div>
                                    <div id="flickr3" class="span2">
                                    </div>
                                    <div id="flickr4" class="span2">
                                    </div>
                                </div>
                                <div class="row flickr-row">
                                    <div id="flickr5" class="span2 offset1">
                                    </div>
                                    <div id="flickr6" class="span2">
                                    </div>
                                    <div id="flickr7" class="span2">
                                    </div>
                                    <div id="flickr8" class="span2">
                                    </div>
                                    <div id="flickr9" class="span2">
                                    </div>
                                </div>
                                <div class="row flickr-row">
                                    <div id="flickr10" class="span2 offset1">
                                    </div>
                                    <div id="flickr11" class="span2">
                                    </div>
                                    <div id="flickr12" class="span2">
                                    </div>
                                    <div id="flickr13" class="span2">
                                    </div>
                                    <div id="flickr14" class="span2">
                                    </div>
                                </div>
                            </div>
                            <div id="flickrNext" class="span1 disabled"></div>
                        </div>
                    </div> 
                    
                    <!-- Flickr Cropper -->
                    <!--
                    <div id="flickrCropper">
                        <!--<span class="helper"></span>
                        <span id="croppingImage" class="span6"></span> 
                        <div id="croppingOptions" class="span6">
                            <label class="checkbox">
                                <input id="cropCheckbox" type="checkbox"> Keep old proportions
                            </label>                           
                        </div>  
                        <span class="overviewButtons">
                            <button id="cropperBack" class="btn btn-primary">Back</button>
                            <button id="cropperContinue" class="btn btn-primary">Continue</button>                            
                        </span>
                    </div>-->

                    <!-- Flickr Overview -->
                    <span id="flickrOverview">
                        <span class="helper"></span>
                        <span id="flickrOverviewImages">
                            <span class="helper"></span>
                            <span id="flickrOld">
                            </span>
                            <span id="flickrArrow">
                                <span class="arrow-primary-large" data-angle="90"></span>
                            </span>
                            <span id="flickrNew">
                            </span> 
                        </span>
                        <span id="flickrOverviewButtons">
                            <button id="flickrBack" class="btn btn-primary">Back</button>                    
                            <button id="flickrSave" class="btn btn-primary">Save</button>
                            <button id="flickrUndo" class="btn btn-danger">Undo</button>
                        </span>
                    </span>

                    <!-- cc Overview -->
                    <div id="ccOverview" class="row-fluid">
                        <div id="ccOld" class="span6">
                        </div>                        
                        <div id="ccText" class="span6">                            
                            <h2>Choose a CC Licence:</h2>
                            <p>For more information see: <a href="http://creativecommons.org/" target="_blank">Creative Commons</a></p>
                            <select id="ccSelector">
                                <option>CC0</option>
                                <option>Attribution (CC BY)</option>
                                <option>ShareAlike (CC BY-SA)</option>
                                <option>NoDerivs (CC BY-ND)</option>
                                <option>NonCommercial (CC BY-NC)</option>
                                <option>NonCommercial, ShareAlike (CC BY-NC-SA)</option>
                                <option>NonCommercial, NoDerivs (CC BY-NC-ND)</option>                                
                            </select>
                        </div>  
                        <span class="overviewButtons">
                            <button id="ccSave" class="btn btn-primary">Save</button>
                            <button id="ccUndo" class="btn btn-danger">Undo</button>
                        </span>
                    </div>

                </div>

                <!-- Image Info/Buttons Panel -->
                <div id="imagePanel" class="span3">
                    <div id="imageInfo">
                        <span class="imageField">
                            <span>
                                Slides:
                            </span>  
                            <span id="imageSlides">

                            </span>
                        </span>
                        <span class="imageField">
                            <span>
                                Author:
                            </span>
                            <span id="imageAuthor">
                            </span>
                        </span>
                        <span class="imageField">
                            <span>
                                Licence:
                            </span>
                            <span id="imageLicence">
                            </span>
                        </span>
                        <span class="imageField">
                            <span>
                                Size:
                            </span>
                            <span id="imageSize">
                            </span>
                        </span>
                        <span class="imageField">
                            <span>
                                Format:
                            </span>
                            <span id="imageFormat">
                            </span>
                        </span>
                    </div>
                    <div id="buttons">
                        <button id="overviewBtn" class="btn btn-primary btn-block imageButtons disabled">Overview</button>                        
                        <button id="flickrBtn" class="btn btn-success btn-block imageButtons disabled">Flickr</button>
                        <button id="ccBtn" class="btn btn-warning btn-block imageButtons disabled">Creative Commons</button>
                        <button id="placeholderBtn" class="btn btn-danger btn-block imageButtons disabled">Obfuscate</button>
                        <button id="redactBtn" class="btn disabled">Redact...</button>
                    </div>
                </div>                
            </div>
            <div class="row-fluid">
                <div id="imageCarousel" class="span12">
                    <ul id="mycarousel" class="jcarousel-skin-tango">
                    </ul>
                </div>
            </div>
        </div>
        
        <div id="copyright">
            © University of Southampton
        </div>
        
        <script>
            window.onload=function(){
                
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '<?php echo $_GET['pptx'] ?>', true);
                xhr.responseType = 'blob';
                xhr.onload = function(e) {
                    if (this.status == 200) {
                        var myBlob = this.response;
                        handleFileSelect(myBlob);
                    }
                };
                xhr.send();
                             
                
                
            };
            redactorInit();
        </script>

    </body>
</html>

