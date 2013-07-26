<?php
    require_once('pel/PelJpeg.php');
    $src = $_GET['src'];
    
    //can easily read exif data here... may come in handy!
    //$exif = exif_imagetype($src);
    
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
    
    
    $entry = $ifd0->getEntry(PelTag::IMAGE_DESCRIPTION);
    
    if ($entry == null){
        $entry = new PelEntryAscii(PelTag::IMAGE_DESCRIPTION, 'Edited by PEL');
        $ifd0->addEntry($entry);
    }else{    
        $entry->setValue('Edited by PEL');
    }
    
    //$im = file_get_contents($src);   
    $im = $jpeg->getBytes();
    $imdata = base64_encode($im); 
    
    //echo back jsonp with image as 64 encoded data here
    echo $_GET['callback'] . '(' . "{'result' : '" . $imdata . "'}" . ')';

?>