<?php
// We'll be outputting a TXT
header('Content-Type: application/txt');

// It will be called downloaded.pdf
header('Content-Disposition: attachment; filename="downloaded.txt"');

// The PDF source is in original.pdf
readfile('file.txt');
?>
