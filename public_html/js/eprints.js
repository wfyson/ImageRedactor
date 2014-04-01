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

        fd = new FormData();
        fd.append("name", name);
        fd.append("index", slices2);

        xhr.open("POST", "php/eprintsmerge.php", true);
        xhr.send(fd);
    }


}

