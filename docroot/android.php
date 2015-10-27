<?php
// We'll be outputting a TXT
header('Content-Type: application/vnd.android.package-archive');

// It will be called downloaded.pdf
header('Content-Disposition: attachment; filename="test.apk"');

// The PDF source is in original.pdf
readfile('TestAndroidProj-debug.apk');
?>
