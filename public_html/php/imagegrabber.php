<?php
    session_start();    
    $id = session_id();   

    require_once('pel/PelJpeg.php');
    $src = $_GET['src'];
    $licence = $_GET['licence'];
    $change = $_GET['changeType'];
    //$src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAErASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorj/i5qWo6T8Otcv9Ku2trqK2JilXqh9RQB2FFeaaf8J2nsLaaTx94oLyRK7H7YvJIz/cqx/wAKg/6n3xT/AOBq/wDxFAHodFeef8Kg/wCp98U/+Bq//EUf8Kg/6n3xT/4Gr/8AEUAeh0V55/wqD/qffFP/AIGr/wDEUf8ACoP+p98U/wDgav8A8RQB6HRXnn/CoP8AqffFP/gav/xFH/CoP+p98U/+Bq//ABFAHodFeef8Kg/6n3xT/wCBq/8AxFH/AAqD/qffFP8A4Gr/APEUAeh0V55/wqD/AKn3xT/4Gr/8RR/wqD/qffFP/gav/wARQB6HRXnn/CoP+p98U/8Agav/AMRR/wAKg/6n3xT/AOBq/wDxFAHodFeef8Kg/wCp98U/+Bq//EUf8Kg/6n3xT/4Gr/8AEUAeh0V55/wqD/qffFP/AIGr/wDEUf8ACoP+p98U/wDgav8A8RQB6HRXnn/CoP8AqffFP/gav/xFH/CoP+p98U/+Bq//ABFAHodFeef8Kg/6n3xT/wCBq/8AxFH/AAqD/qffFP8A4Gr/APEUAeh0V55/wqD/AKn3xT/4Gr/8RR/wqD/qffFP/gav/wARQB6HRXnn/CoP+p98U/8Agav/AMRR/wAKg/6n3xT/AOBq/wDxFAHodFeV+G9O1Lwp8Vh4cTxNqmo2F3pRumjvpRIUkDkZUgDHAr1SgAooooAKKKKACiiigAooooAK4f41/wDJMNf/AOvY/wAxXcVw/wAa/wDkmGv/APXsf5igDrNI/wCQVZ/9cE/9BFXKp6R/yCrP/rgn/oIq5QAUUUUAFFFFAHg1n8f7nRfG/wATIvGbJF4c8FeSY5IowZAHdVyccn71MH7Y3w6Y3UC6D4ja8ht1vLa0Fg3m3luessS/xKO5rF8X/ADxrrd18WJrWa12eMntG08N2EcyO278FNdJB8HP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z/oql9/34T/Cj/hV3jz/AKKpff8AfhP8KAPUaK8u/wCFXePP+iqX3/fhP8KP+FXePP8Aoql9/wB+E/woA9Rory7/AIVd48/6Kpff9+E/wo/4Vd48/wCiqX3/AH4T/CgD1GivLv8AhV3jz/oql9/34T/Cj/hV3jz/AKKpff8AfhP8KAPUaK8u/wCFXePP+iqX3/fhP8KP+FXePP8Aoql9/wB+E/woA9Rory7/AIVd48/6Kpff9+E/wo/4Vd48/wCiqX3/AH4T/CgD1GivLv8AhV3jz/oql9/34T/Cj/hV3jz/AKKpff8AfhP8KAPUaK8u/wCFXePP+iqX3/fhP8KP+FXePP8Aoql9/wB+E/woAvXAI+ONoSOuhP8A+jGr0OuA8G/DK98P+JpvFeueKrrWL1rb7LEZFCrHHnJGB7mu/oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=';
    //file_put_contents('test.jpeg', $src);
    
    //can easily read exif data here... may come in handy!
    //$exif = exif_imagetype($src);

    
    if ($change === "cc"){
        $src = "temp/" . $id . $src;
    }
    
    if ($change === "placeholder"){
        $src = "temp/" . $id . $src;
    }
   
    $jpeg = new PelJpeg($src);
    
    $exif = $jpeg->getExif();
    
    if ($exif == null) {    //no exif present so we need to add some

        $exif = new PelExif();
        $jpeg->setExif($exif);
  
        /* We then create an empty TIFF structure in the APP1 section. */
        $tiff = new PelTiff();
        $exif->setTiff($tiff);        
    }else{
        $tiff = $exif->getTiff();
    }    
    $ifd0 = $tiff->getIfd();

    if ($ifd0 == null){
        $ifd0 = new PelIfd(PelIfd::IFD0);
        $tiff->setIfd($ifd0);
    }
    
    
    $entry = $ifd0->getEntry(PelTag::COPYRIGHT);
    
    if ($entry == null){
        $entry = new PelEntryAscii(PelTag::COPYRIGHT, $licence);
        $ifd0->addEntry($entry);
    }else{    
        $entry->setValue($licence);
    }
    
    //$im = file_get_contents($src);   
    $im = $jpeg->getBytes();
    $imdata = base64_encode($im); 
    
    //echo back jsonp with image as 64 encoded data here
    echo $_GET['callback'] . '(' . "{'result' : '" . $imdata . "'}" . ')';

?>