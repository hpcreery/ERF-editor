#!/usr/bin/perl

# created on 08 March 05
# by amit gross
# The script reads all the files in a directory which is beneath the
# current directory and replace an old string with the new one.
# It puts the changed files in the working directory
# and remains the original files in child directory unchanged.

print "\n Insert the directory name where files are located (make sure it is a child directory):";
$directory = <STDIN>;
chomp($directory);

print "\nInsert the old string that should be replaced:";
$oldString = <STDIN>;
chomp($oldString);

print "\nInsert the new string:";
$newString = <STDIN>;
chomp($newString);

print "\nAre you sure you want to replace $oldString with $newString? (y or n):";
$answer = <STDIN>;
chomp($answer);

if( $answer eq "y" ) {
   print( "Changing files...\n" );
} else {
     die ( "Nothing happened,you quit!\n" );
}

opendir( TARGETDIR, "./$directory") || die ("$0: Can not read directory");

while( $fname = readdir TARGETDIR){
    next if $fname =~ /^\./;  
    next if $fname =~ /^\.\.?$/;
    next if $fname =~ "ReplacebyDemand.pl";
    push @flist, $fname;
}
closedir(TARGETDIR);

system ("cd $directory");

foreach $fn (@flist) {

    open( IN, "$directory/$fn")  || die ("\n problem reading file:$fn \n");
    open( OUT, ">temp") || die ("\n problem with writing to file:$fn \n");
    $flag = 0;
    $lineNo = 0;

    while( <IN> ){	
	$lineNo++;
	$line = $_;
	if ( $line =~ m/$oldString/ ) { $flag = 1; } 
	$line =~ s/$oldString/$newString/g && print "\n Changed: $fn, line: $lineNo \n";
	print OUT "$line";
    }
    close(IN);
    close(OUT);
 
    if($flag){
	rename (temp, $fn) || die "couldn't rename temp to $fn.\n";    
    }
}














