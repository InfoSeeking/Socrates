<?php 
/*
	Author: Chirag Shah
	Date: 06/13/2009

    Modified by: Ziad Matni
    Last mod: 10/15/2013
*/
	ini_set("memory_limit","100M");
	require_once("connect2.php");

	// Find out what day, date, and time are to see
	// which queries need to run.
	$timestamp = time();
	$t = getdate();
	$today = date('Y-m-d', $t[0]);
	$timeNow = date('H:i:s', $t[0]);
	$day = date('N', $t[0]);
    $date = date('d', $t[0]);
	$hour = date('H', $t[0]);
	$minute = date('i', $t[0]);
        
	$query = "SELECT * FROM campaigns,twitter_options WHERE campaigns.status=1 AND campaigns.cid=twitter_options.cid AND ((twitter_options.frequency='daily' OR twitter_options.day='$day') OR (twitter_options.frequency='monthly' AND twitter_options.date='$date')) AND twitter_options.hour='$hour' AND twitter_options.minute='$minute' AND twitter_options.status=1";
//	$query = "SELECT * FROM twitter_options WHERE cid=2322";
	$result = mysql_query($query) or die("0: ". mysql_error());
	while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {        
		$cid = $line['cid'];
		$prefix = "cm".$cid;
		$tquery = $line['query'];
		$qid = $line['twitterID'];
		
		$aQuery = "INSERT INTO campaigns_logs VALUES('','$cid','twitter','$qid','$today','$timeNow','$timestamp')";
		$aResult = mysql_query($aQuery) or die("0: ". mysql_error());
				
		$tquery = urlencode($tquery);
		$maxResults = $line['top'];
		if (!$maxResults)
			$maxResults = 10;
		if ($maxResults > 150)
			$maxResults = 150;

		$inFile = $prefix."_t.in";
		$outFile = $prefix . "_t.out";	
        // I suggest we make maxPages = maxResults (or get rid of maxPages var)
        // since Twitter API 1.1 does not define page= anymore, but have count= instead,
        // so maxResults should reflect the max Tweet counts requested. ZM.
		$maxPages = round($maxResults/15);
		$rank = 0;
		for ($page=1; $page<=$maxPages; $page++) {
			$rand = rand(1,3);
			sleep($rand);

/*
			THE crawlTwitter() FUNCTION MAY HAVE TO BE CHANGED SINCE IT
			LOOKS LIKE IT PARSES AN HTML OBJECT, NOT A JSON ONE.

*/

            // OLD $url DEFINITION:
			//$url = "http://search.twitter.com/search.atom?q=$tquery&lang=en&page=$page";
            $url = "https://api.twitter.com/1.1/search/tweets.json?q=$tquery&lang=en&page=$page";
			//echo "$url\n"; //debug

            // OLD crawlTwitter FUNCTION CALL:
			//crawlTwitter($prefix, $cid, $qid, $url, $inFile, $outFile, $rank);
			crawlTwitterNew($prefix, $cid, $qid, $url, $inFile, $outFile, $rank);
			$rank+=15;
		}

		// $iQuery = "SELECT count(*) as num FROM ". $prefix ."_twitter WHERE deleted=0";
		// $iResult = mysql_query($iQuery) or die(" ". mysql_error());
		// $iLine = mysql_fetch_array($iResult, MYSQL_ASSOC);
		// $items = $iLine['num'];

		// $queryC = "UPDATE campaigns_data SET count=$items WHERE cid=$cid AND source='twitter'";
		// $resultC = mysql_query($queryC) or die("0: ". mysql_error());
	} // while ($line = mysql_fetch_array($result, MYSQL_ASSOC))


    function crawlTwitterNew($prefix, $cid, $qid, $url, $inFile, $outFile, $rank) {

    } // function crawlTwitterNew


//	function crawlTwitter($prefix, $cid, $qid, $url, $inFile, $outFile, $rank) {
//		$html = file_get_contents($url);
//		if ($html) {
//			$fh = fopen($inFile, 'w');
//			fwrite($fh, $html."\n");
//			fclose($fh);
//			$fin = fopen($inFile, "r");
//			$fout = fopen($outFile, "w");
//			while ($line = fgets($fin)) {
//				if (preg_match("/<link type=\"text\/html\"/", $line)) {
//					$line = str_replace("<link type=\"text/html\" href=\"", "<link>",$line);
//					$line = str_replace("\" rel=\"alternate\"/>", "</link>", $line);
//				}
//	/*
//				$line = str_replace("<link type=\"text/html\" rel=\"alternate\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"image/png\" rel=\"image\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"application/atom+xml\" rel=\"self\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"application/opensearchdescription+xml\" rel=\"search\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"application/atom+xml\" rel=\"refresh\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"application/atom+xml\" rel=\"next\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"application/atom+xml\" rel=\"previous\" href=\"","<link>",$line);
//				$line = str_replace("<link type=\"application/atom+xml\" rel=\"thread\" href=\"","<link>",$line);
//				$line = str_replace("rel=\"alternate\"/>","></link>",$line);
//				$line = str_replace("\"/>","\"></link>",$line);			*/
//				fwrite($fout, $line);
//			} // while ($line = fgets($fin))
//			fclose($fin);
//			fclose($fout);
//			
//			require_once('FeedParser.php'); 
//			require_once("urlParser.php");
//			$Parser = new FeedParser();
//			$Parser->parse($outFile);
//			$channels = $Parser->getChannels();     
//			$items = $Parser->getItems();        
//			$t = getdate();
//		    $date = date('Y-m-d', $t[0]);
//			$timestamp = time();
//			
//			foreach($items as $item): 
//				$rank++;
//				$links = addslashes($item['LINK']); // $links will have a bunch of links. We just want the first one.
//				list($left, $right) = explode("http://",$links);
//				list($firstLink, $rest) = explode("http://",$right);
//				$link = "http://".$firstLink;
//				$title = str_replace("/b>", " ", $item['TITLE']); 
//				$title = str_replace("b>"," ",$title); 
//				$title = str_replace("html "," ",$title);
////				$title = strip_punctuation($title);
//				$title = addslashes($title);
//				$snippet = str_replace("/b>", " ", $item['CONTENT']); 
//				$snippet = str_replace("b>"," ", $snippet); 
////				$snippet = strip_punctuation($snippet);
//				$url = extract_URL($snippet);
//				$author = $item['AUTHOR']['NAME']; 
//				$author = addslashes($author); 
//				$authorPage = $item['AUTHOR']['URI'];
//				$authorPage = addslashes($authorPage); 
//				$published = $item['PUBLISHED'];
//				$published = str_replace("T"," ", $published);
//				$published = str_replace("Z"," ", $published);
//				list($pub_date, $pub_time) = explode(" ", $published);			
//				$updated = $item['UPDATED'];
//				$bQuery = "SELECT COUNT(*) as num FROM ".$prefix."_twitter WHERE query_id=$qid AND url='$link'";
//				$bResult = mysql_query($bQuery) or die("2: ". mysql_error());
//				$bLine = mysql_fetch_array($bResult, MYSQL_ASSOC);
//				$num = $bLine['num'];
//				if ($num == 0) {
//					$bQuery = "INSERT INTO ".$prefix . "_twitter VALUES('','$qid','$title','$link','$url','$author','$authorPage','$pub_date','$pub_time','$updated','$rank','$date','2','0')";
//	//				echo "$bQuery\n";
//					$bResult = mysql_query($bQuery) or die("3: ". mysql_error());
//				} // if ($num == 0)
//			endforeach;
//		}
//	} // function crawlTwitter($prefix, $cid, $qid, $url, $inFile, $outFile, $rank)
	
	function strip_punctuation($text) {
    $urlbrackets    = '\[\]\(\)';
    $urlspacebefore = ':;\'_\*%@&?!' . $urlbrackets;
    $urlspaceafter  = '\.,:;\'\-_\*@&\/\\\\\?!#' . $urlbrackets;
    $urlall         = '\.,:;\'\-_\*%@&\/\\\\\?!#' . $urlbrackets;

    $specialquotes  = '\'"\*<>';

    $fullstop       = '\x{002E}\x{FE52}\x{FF0E}';
    $comma          = '\x{002C}\x{FE50}\x{FF0C}';
    $arabsep        = '\x{066B}\x{066C}';
    $numseparators  = $fullstop . $comma . $arabsep;

    $numbersign     = '\x{0023}\x{FE5F}\x{FF03}';
    $percent        = '\x{066A}\x{0025}\x{066A}\x{FE6A}\x{FF05}\x{2030}\x{2031}';
    $prime          = '\x{2032}\x{2033}\x{2034}\x{2057}';
    $nummodifiers   = $numbersign . $percent . $prime;

    return preg_replace(
        array(
        // Remove separator, control, formatting, surrogate,
        // open/close quotes.
            '/[\p{Z}\p{Cc}\p{Cf}\p{Cs}\p{Pi}\p{Pf}]/u',
        // Remove other punctuation except special cases
            '/\p{Po}(?<![' . $specialquotes .
                $numseparators . $urlall . $nummodifiers . '])/u',
        // Remove non-URL open/close brackets, except URL brackets.
            '/[\p{Ps}\p{Pe}](?<![' . $urlbrackets . '])/u',
        // Remove special quotes, dashes, connectors, number
        // separators, and URL characters followed by a space
            '/[' . $specialquotes . $numseparators . $urlspaceafter .
                '\p{Pd}\p{Pc}]+((?= )|$)/u',
        // Remove special quotes, connectors, and URL characters
        // preceded by a space
            '/((?<= )|^)[' . $specialquotes . $urlspacebefore . '\p{Pc}]+/u',
        // Remove dashes preceded by a space, but not followed by a number
            '/((?<= )|^)\p{Pd}+(?![\p{N}\p{Sc}])/u',
        // Remove consecutive spaces
            '/ +/',
        ),
        ' ',
        $text );
	} // function strip_punctuation($text)
?>
