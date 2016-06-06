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
<script src="js/Chart.js"></script>
<script src="js/Chart.min.js"></script>

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
                    <li><a href="http://peopleanalytics.org/socrates/front-end/index.html">Prototype</a></li>
					<!--
					<li><a href="collect.html">Collect</a></li>
					<li><a href="explore.html">Explore</a></li>
					<li><a href="analyze.html">Analyze</a></li>
					-->
					<li><a href="about.php">About Us</a></li>
				</ul>
			</nav>
		</header>
		<div id="top-region">
			<div class="breadcrumb">
				<a href="index.php">Home</a> > <a href="demo.php">Demo</a>
			</div>
		</div>
		<div class="main">

        <video width="960" height="720" controls autoplay>
            <source src="SOCRATES_User_Study_Demo.mov" type="video/mp4">
            <object data="SOCRATES_User_Study_Demo.mov" width="960" height="720">
            <embed width="960" height="720">
            </object>
        </video>
        <p>
        Please note that there are known inconsistencies with certain browsers (Firefox) and .MOV files. If you are unable to see this video, please try with another browser (Chrome, Safari), or <a href="http://youtu.be/qQmew3ImYt0" target="_blank">see the video on YouTube.</a>
        </p>

			<footer>
				<table width=100%>
					<tr width=100%><td><image src="images/nsf.gif" height=50 width=50/></td><td>SOCRATES is supported with funding from the <a href="http://www.nsf.gov/awardsearch/showAward?AWD_ID=1244704">National Science Foundation (NSF)</a>.<br/>&copy; SOCRATES 2014</td><td align="right"><a href="https://www.facebook.com/pplanalytics"><img src="images/facebook.png" height=30 width=30 /></a> <a href="https://twitter.com/pplanalytics"><img src="images/twitter.png" height=30 width=30 /></a></td></tr>
				</table>
			</footer>
		</div><!--main-->
	</div><!--container_12-->
</body>
</html>
