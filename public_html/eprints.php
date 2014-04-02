<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        
        <title>Redact-O-Matic</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

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

        <script type="text/javascript" src="js/libs/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/libs/bootstrap-fileupload.min.js"></script>
        <script type="text/javascript" src="js/libs/bootstrap-arrows.js"></script>

        <script type="text/javascript" src="js/libs/jquery.jcarousel.js"></script>
        <script type="text/javascript" src="js/libs/jquery.jcarousel.min.js"></script>

        <script type="text/javascript" src="js/libs/jquery.Jcrop.min.js"></script>     
        
        <script type="text/javascript" src="js/libs/pixastic.custom.js"></script>     
        
        <script type="text/javascript" src="js/control.js"></script>
        <!--<script type="text/javascript" src="js/readFile.js"></script>-->
        <script type="text/javascript" src="js/readURL.js"></script>
        <script type="text/javascript" src="js/SlideImageRel.js"></script>
        <script type="text/javascript" src="js/Change.js"></script>        

        <script type="text/javascript" src="js/powerpoint/PowerPointReader.js"></script>
        <script type="text/javascript" src="js/powerpoint/PowerPointImage.js"></script>
        <script type="text/javascript" src="js/powerpoint/PowerPoint.js"></script>
        <script type="text/javascript" src="js/powerpoint/PowerPointWriter.js"></script>
        <script type="text/javascript" src="js/powerpoint/PowerPointRedactor.js"></script>
        <script type="text/javascript" src="js/powerpoint/PowerPointViewer.js"></script>        
        
        <script type="text/javascript" src="js/flickr/FlickrReader.js"></script>
        <script type="text/javascript" src="js/flickr/FlickrImage.js"></script>
        <script type="text/javascript" src="js/flickr/FlickrResultsViewer.js"></script>
        
        <script type="text/javascript" src="js/word/Word.js"></script>
        <script type="text/javascript" src="js/word/WordSection.js"></script>
        <script type="text/javascript" src="js/word/WordParagraph.js"></script>
        <script type="text/javascript" src="js/word/WordImage.js"></script>
        <script type="text/javascript" src="js/word/WordReader.js"></script>
        <script type="text/javascript" src="js/word/WordRedactor.js"></script>
        <script type="text/javascript" src="js/word/WordViewer.js"></script>
        <script type="text/javascript" src="js/word/WordWriter.js"></script>
        <script type="text/javascript" src="js/word/CaptionRel.js"></script>
        
        <script type="text/javascript" src="js/eprints.js"></script>

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    </head>
    <body>

        <div class="navbar">
            <div class="navbar-inner">
                <a class="brand" href="#">Redact-O-Matic</a>
                <ul class="nav">
                    <li class="divider-vertical"></li>
                    <li><a id="titleOverview" href="#">Overview</a></li>
                    <li class="divider-vertical"></li>
                    <li><a id="titleText" class="disabled" href="#">Text</a></li>
                    <li class="divider-vertical"></li>
                    <li><button id="redactBtn" class="btn btn-info disabled">Redact</button></li>
                    <li><span id="download"><img id="downloadLoading" src="img/ajax-loader-small.gif"/><span id='downloadLabel' class="label label-info">Download Link</span></span></li>       
                    <li><span id="eprints"><a id="eprintsUpload" class="btn" target="_blank">Upload to EPrints <i class="icon-upload"></i></a></span></li>
                </ul>         
            </div>
        </div>

        
        <div class="container-fluid">

            <div id="imageOverview" class="row-fluid">
                
                <div id="imageWindow" class="span9">
                
                    <span id="instructions" class="hasFocus">
                        <img src="img/instructions.gif"/>
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
                    
                    <!-- headings redaction -->
                    <div id="headings">
                        <div id="headingContent">
                            <!-- root collapsible for the whole document and text that does not initially appear under a heading -->
                            <div class="accordion" id="accordionRoot">
                                <div class="accordion-group">
                                    <div class="accordion-heading">
                                        <a class="accordion-toggle heading1" data-toggle="collapse" data-parent="#accordionRoot" href="#collapseRoot">
                                            Word Root 
                                        </a>
                                    </div>                                    
                                    <div id="collapseRoot" class="accordion-body collapse in">
                                        <div id="innerRoot" class="accordion-inner">                                                                                                                                                                                                       
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                            <label class="checkbox">
                                <input id="commercialCheck" type="checkbox"> Commercial?
                            </label>
                            <label class="checkbox">
                                <input id="derivativeCheck" type="checkbox"> Derivatives?
                            </label>                   
                            <!--<select id="flickrLicence" name="licence" class="input-medium">
                                <option>Attribution (CC BY)</option>
                                <option>ShareAlike (CC BY-SA)</option>
                                <option>NoDerivs (CC BY-ND)</option>
                                <option>NonCommercial (CC BY-NC)</option>
                                <option>NonCommercial, ShareAlike (CC BY-NC-SA)</option>
                                <option>NonCommercial, NoDerivs (CC BY-NC-ND)</option>
                            </select>-->
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
                <div id="sidePanel" class="span3">
                    <div id="imagePanel">
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
                            <span class="imageField">
                                <span>
                                    Caption:
                                </span>
                                <span id="imageCaption">
                                </span>
                            </span>
                        </div>
                        <div id="buttons">
                            <button id="overviewBtn" class="btn btn-primary btn-block imageButtons disabled">Overview</button>                        
                            <div class="btn-block btn-group">
                                <button id="replaceBtn" class="btn btn-success imageButtons btn-block disabled dropdown-toggle" data-toggle="dropdown">
                                    Replace
                                    <span class="caret" style="float:right; margin-right: 10px"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a href='#' id="flickrBtn">Flickr</a>
                                    </li>
                                    <li>
                                        <a href='#' id="googleBtn">Google Images</a>
                                    </li>
                                    <!--<li>
                                        <a href='#' id="clipartBtn">Openclipart</a>
                                    </li>-->
                                </ul>                        
                            </div>
                            <button id="ccBtn" class="btn btn-warning btn-block imageButtons disabled">Creative Commons</button>
                            <button id="placeholderBtn" class="btn btn-danger btn-block imageButtons disabled">Obfuscate</button>
                            <!--
                            <button id="redactBtn" class="btn btn-inverse btn-block disabled">Redact <i class="icon-download icon-white"></i></button>
                            <span id="download" class='btn-block'><img id="downloadLoading" src="img/ajax-loader-small.gif"/><span id='downloadLabel' class="label label-inverse">Download Link</span></span>
                            -->
                         </div>
                    </div>
                    <!--Hierarchy for headings navigation-->
                    <div id="headingPanel"> 
                        <div id="headingHierarchy"></div>
                        <button id="headingOverviewBtn" class="btn btn-primary btn-block">Overview</button>                        
                    </div>
                </div>                
            </div>
            <div id="pptBar">                
                <div class="carousel">
                    <ul id="pptCarousel" class="jcarousel-skin-tango">
                    </ul>
                </div>
            </div>
            <div id="wordBar">
                <div id="headingsBtn"><img src="img/headingsIcon.png" alt="Redact Headings" /></div>
                <div class="carousel" style="width:90%; float:left">
                    <ul id="wordCarousel" class="jcarousel-skin-tango">
                    </ul>
                </div>                
            </div>
        </div>
        
        <div id="eprintsModal" class="modal hide fade">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3>Import into ePrints</h3>                
            </div>
            <div class="modal-body">
                <p>Copy and paste the following URL into the eprint's "Upload From URL" form:</p>
                <input class="span2" id="modalURL" type="text" readonly onClick="this.select();">
                
                <img src="img/url_screenshot.png"/>       
            </div>
            <div class="modal-footer">
                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                <a id="eprintBtn" href="#" class="btn btn-primary" target="_blank">Go to Eprint</a>
            </div>
        </div>
        
        <div id="copyright">
            © University of Southampton
        </div>
        
        <script>
            window.onload=function(){  
                //var phpUrl = "php/documentgrabber.php?callback=?";
                //$.getJSON(phpUrl, {doc: ''},
                //    function(res) {
                //        console.log(res.doc);
                //        //handleFileSelect(res.doc, res.data);
                //    }
                //);       
                
                
                //var xhr = new XMLHttpRequest();
                //xhr.open('GET', '?php echo $_GET['doc'] ?>', true);
                //xhr.responseType = 'blob';
                //xhr.onload = function(e) {                    
                //    if (this.status === 200) {
                //        var myBlob = this.response;
                //        handleFileSelect(doc, myBlob);
                //    }
                //};
                //xhr.send();
                //handleFileSelect(doc, blob);
                var doc = '<?php echo $_GET['doc'] ?>';
                var data  = '<?php $data = file_get_contents($_GET['doc']); $encode = base64_encode($data); echo $encode; ?>';                
                var byteCharacters = atob(data);                                                
                
                //also get the eprints info so we know where to send it back to
                var eprints = '<?php echo $_GET['eprints'] ?>'; 
                var eprintID = '<?php echo $_GET['eprintid'] ?>'; 
                $('#download').data('eprints', eprints);
                $('#download').data('eprintID', eprintID);
                
                //get session id
                var id = '<?php session_start(); $id = session_id(); echo $id; ?>';
                $('#download').data('sessionID', id);
                
                function charCodeFromCharacter(c) {
                    return c.charCodeAt(0);     
                }                                

                var byteNumbers = Array.prototype.map.call(byteCharacters, charCodeFromCharacter);
                var uint8Data = new Uint8Array(byteNumbers);
                var blob = new Blob([uint8Data]);
                handleFileSelect(doc, blob);                
            };
            redactorInit();
        </script>

    </body>
</html>


