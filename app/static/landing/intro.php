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

<script type="text/javascript">

		var pieData = [
				{
					value: 30,
					color:"#F38630"
				},
				{
					value : 50,
					color : "#E0E4CC"
				},
				{
					value : 100,
					color : "#69D2E7"
				}
			
			];

	var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
	
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
					<!--
					<li><a href="collect.html">Collect</a></li>
					<li><a href="explore.html">Explore</a></li>
					<li><a href="analyze.html">Analyze</a></li>
					-->
					<li><a href="demo.php">Demo</a></li>
					<li><a href="http://peopleanalytics.org/socrates/front-end/index.html">Prototype</a></li>
					<li><a href="about.php">About Us</a></li>
				</ul>
			</nav>
		</header>
		<div id="top-region">
			<div class="breadcrumb">
				<a href="index.php">Home</a> > <a href="intro.php">What is SOCRATES?</a>
			</div>
		</div>
		<div class="main">
			<div class="grid_12">
				<h3>What is SOCRATES?</h3>
				<p>This project, SOCRATES, is a social-computational system and platform for the study of social media using crowdsourcing. The project will develop a framework (See figure below) and a technical system through which researchers can collect content from one or more social media sources, explore the collected content to help generate hypotheses, and analyze the content the content to produce insights, findings, and research results in true social-computational scale.</p>
				<center><img src="images/figure1.png" /></center>
				<h3>Components of SOCRATES</h3>
				
				<h4>Collect</h4>
				<p>The SOCRATES Collect component will provide seamless support for collecting vast amounts of data from social media sites easily and effectively. This interactive component will let the researchers specify their needs quickly and intuitively (e.g., using keywords with source-selection), get them data from these disparate data sources, transform the data into standardized structured formats, and allow easy modification to initial setup and criteria for data collection. One of the important lessons learned from previous experiences, as well as preliminary investigations, is that such a component should be easily integrated into existing systems and practices. The project will therefore address the challenge of collecting large amounts of social media data with minimal effort on the researchers’ end, in terms of learning new environments or assuring proper workflow with their existing systems.</p>
				<h4>Explore</h4>
				<p>The SOCRATES Explore component will offer visualizations of the data that enable targeted exploration, allowing researchers to gain understanding and insight into the data independently. The project will develop an interactive application that allows researchers to examine the collected material along multiple dimensions: being able to explore high-level aggregate trends, alongside individual content items (“overview first, details on demand” is a related idea in the visualization community). The researchers will be able to share the interactive visualization and data collected with others, to help “crowdsource” the exploration and hypothesis generation process. Users will be able to explore, comment, and provide insights in a way that enriches the data, and to provide new hypotheses about it to the researchers.</p>
				<h4>Analyze</h4>
				<p>To analyze social media data at scale, SOCRATES will support efficient, accurate, and valid annotation of the collected content using a specialized crowdsourcing environment. The purpose of such annotation is multifaceted, including but not limited to categorization leading to evidentiary inferences or hypothesis testing by social scientists and algorithm development by information scientists.</p>
				
		
			<footer>
				<table width=100%>
					<tr width=100%><td><image src="images/nsf.gif" height=50 width=50/></td><td>SOCRATES is supported with funding from the <a href="http://www.nsf.gov/awardsearch/showAward?AWD_ID=1244704">National Science Foundation (NSF)</a>.<br/>&copy; SOCRATES 2014</td><td align="right"><a href="https://www.facebook.com/pplanalytics"><img src="images/facebook.png" height=30 width=30 /></a> <a href="https://twitter.com/pplanalytics"><img src="images/twitter.png" height=30 width=30 /></a></td></tr>
				</table>
			</footer>
		</div><!--main-->
	</div><!--container_12-->
</body>
</html>
