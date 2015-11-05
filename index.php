<!doctype html>
<html>
<head>

<title>SOCRATES - SOcial and CRowdsourced AcTivities Extraction System</title>

<link href="css/style.css" rel="stylesheet" type="text/css">
<link href="css/960.css" rel="stylesheet" type="text/css">
<link href="css/960_12_col.css" rel="stylesheet" type="text/css">
<link href="css/text.css" rel="stylesheet" type="text/css">
<link href="css/rest.css" rel="stylesheet" type="text/css">
<link href="css/flexslider.css" rel="stylesheet" type="text/css">


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="js/jquery.flexslider.js"></script>
<script src="js/jquery.flexslider-min.js"></script>
<script src="js/modernizr.js"></script>

<script type="text/javascript">
window.onload = function(){ 
	//Get submit button
	var submitbutton = document.getElementById("tfq");
	//Add listener to submit button
	if(submitbutton.addEventListener){
		submitbutton.addEventListener("click", function() {
			if (submitbutton.value == 'Search our website'){//Customize this text string to whatever you want
				submitbutton.value = '';
			}
		});
	}
}
</script>
<script type="text/javascript">
	$(window).load(function() {
  	$('.flexslider').flexslider({
    animation: "slide"
  });
});
</script>

</head>
<body>
<?php include_once("../analyticstracking.php") ?>
	<div class="container_12">
		<!--
		<div id="tfheader">
			<form id="tfnewsearch" method="get" action="http://www.google.com">
		        <input type="text" id="tfq" class="tftextinput3" name="q" size="21" maxlength="120" value="Search our website">
			</form>
			<div class="tfclear"></div>
		</div>
		-->
		<header>
			<a href="index.php"><img src="images/socrates_head.png" alt="homepage"/></a>
			<nav>
				<ul>
					<li><a href="index.php">Home</a></li>
					<li><a href="intro.php">What is SOCRATES?</a></li>
					<li><a href="demo.php">Demo</a></li>
					<li><a href="http://peopleanalytics.org/socrates/">Prototype</a></li>
					<!--
					<li><a href="collect.html">Collect</a></li>
					<li><a href="explore.html">Explore</a></li>
					<li><a href="analyze.html">Analyze</a></li>
					-->
					<li><a href="about.php">About Us</a></li>
				</ul>
			</nav>
		</header>
		<div class="main">
			<div class="grid_9">
				<div class="flexslider">
  					<ul class="slides">
    					<li><img src="images/figure1.png" height=500 width=800/></li>
    					<li><img src="images/figure2.png" height=500 width=800/></li>
  					</ul>
				</div><!--flexslider-->
			</div><!--grid_8-->
			<div class="grid_3">
				<a class="twitter-timeline" href="https://twitter.com/pplanalytics" data-widget-id="437804697856925697">Tweets by @pplanalytics</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
			</div>
			<div class="grid_12">
				<h3>Project SOCRATES</h3>
				<p>This project will result in the development of the SOcial and CRowdsourced AcTivities Extraction System (SOCRATES), a robust, highly usable social-computational platform that will transform the manner in which researchers and educators track, capture, visualize, explore, and analyze social media data and annotations. A functional research prototype of SOCRATES will enable researchers and educators to conduct seamless social media research with greater ease, and at a much larger scale, than previously possible, and build communities of research and practice around initiating and addressing issues relating to socio-behavioral and socio-economical nature. This project ultimately will allow cross-disciplinary communities of scholars to study together these socio-economical and socio-behavioral issues at scale, and use social-computational systems as means to achieve this goal.</p>
			</div>

			<footer>
				<table width=100%>
					<tr width=100%><td><image src="images/nsf.gif" height=50 width=50/></td><td>SOCRATES is supported with funding from the <a href="http://www.nsf.gov/awardsearch/showAward?AWD_ID=1244704">National Science Foundation (NSF)</a>.<br/>&copy; SOCRATES 2014</td><td align="right"><a href="https://www.facebook.com/pplanalytics"><img src="images/facebook.png" height=30 width=30 /></a> <a href="https://twitter.com/pplanalytics"><img src="images/twitter.png" height=30 width=30 /></a></td></tr>
				</table>
			</footer>
		</div><!--main-->
	</div><!--container_12-->
</body>
</html>
