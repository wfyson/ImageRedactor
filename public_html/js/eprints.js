//write blob to temporary file and change download button to take user to eprints
function writeEprintsDocument(name, blob, eprints) {

    BYTES_PER_CHUNK = 1024 * 1024; // 1MB chunk sizes.
    var slices;
    var slices2;
    var blob = blob;
    var name = name;
    
    sendRequest();

    function sendRequest() {
        var xhr;

        var start = 0;
        var end;
        var index = 0;

        // calculate the number of slices we will need
        slices = Math.ceil(blob.size / BYTES_PER_CHUNK);
        slices2 = slices;

        while (start < blob.size) {
            end = start + BYTES_PER_CHUNK;
            if (end > blob.size) {
                end = blob.size;
            }

            uploadFile(blob, index, start, end);

            start = end;
            index++;
        }
    }

    function uploadFile(blob, index, start, end) {
        var xhr;
        var end;
        var fd;
        var chunk;
        var url;

        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.responseText) {
                    alert(xhr.responseText);
                }

                slices--;

                // if we have finished all slices
                if (slices == 0) {
                    mergeFile(blob);
                }
            }
        };

        //if (blob.webkitSlice) {
        //    chunk = blob.webkitSlice(start, end);
        //} else if (blob.mozSlice) {
        //    chunk = blob.mozSlice(start, end);
        //}
        
        chunk = blob.slice(start, end);

        fd = new FormData();
        fd.append("file", chunk);
        fd.append("name", name);
        fd.append("index", index);

        xhr.open("POST", "php/eprintswriter.php", true);
        xhr.send(fd);
    }

    function mergeFile(blob) {
        var xhr;
        var fd;

        xhr = new XMLHttpRequest();

        xhr.addEventListener("load", showLink, false);

        fd = new FormData();
        fd.append("name", name);
        fd.append("index", slices2);

        xhr.open("POST", "php/eprintsmerge.php", true);
        xhr.send(fd);
    }
    
    //when the files have been merged, create and display link to eprints
    function showLink(evt){
        
        //hide loading gif
        $('#downloadLoading').hide();
        
        //generate a link to the redacted file     
        var EPRINT_LOCATION = "/php/eprints/";                
        var linkURL = window.location.hostname + window.location.pathname;       
        linkURL = linkURL.substring(0, linkURL.lastIndexOf("/"));         
        linkURL = linkURL + EPRINT_LOCATION + $('#download').data('sessionID') + "/" + name;
   
        
        var EDIT_URL = "/cgi/users/home?screen=EPrint%3A%3AEdit";
        var EPRINT_ID = "&eprintid=";
        var EXTRA_PARAMETERS = "&stage=files&c5_current=1";
        
        var eprintLink = $('#download').data('eprints') + EDIT_URL + EPRINT_ID + $('#download').data('eprintID') + EXTRA_PARAMETERS;
        //$('#eprintsUpload').attr('href', link);
        //$('#eprintsUpload').show();
        
        $('#modalURL').val(linkURL);
        $('#eprintBtn').attr('href', eprintLink);
        $('#eprintsModal').modal();        
    }
}

