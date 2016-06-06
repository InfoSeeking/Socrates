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
				<a href="index.php">Home</a> > <a href="about.php">About Us</a>
			</div>
		</div>
		<div class="main">
			
			<!--
			<div class="grid_7">
				<img src="images/socrates-about.jpg"/>
			</div>
			<div class="grid_5">
				<h2>About SOCRATES & The Team</h2>
				<p>PI Chirag Shah at Rutgers will direct the overall research and project management. Shah, with the help of the PhD student on this project, will coordinate all communications between the Rutgers and Stevens research teams and will be responsible for arranging regular meeting times. As overall project director, Shah will be responsible for ensuring timely reporting to NSF and adequate wider dissemination to the scholarly community. The responsibility for the basic research components is divided between the PIs on this project. PI Shah will lead the Collect aspects of SOCRATES development.</p>
				<p>PI Mason will focus on Analyze aspects by integrating the processes with existing crowdsourcing technologies.</p>
				<p>PI Naaman will supervise the development of the Explore component of SOCRATES.</p>
				<p> </p>
				<p> </p>
							
			</div>
			-->
			<div class="grid_4">
				<img src="images/propic1.png"  height=200 width=200 />
				<h3>Dr. Chirag Shah</h3>
				<p>PI Chirag Shah at Rutgers will direct the overall research and project management. Shah, with the help of the PhD student on this project, will coordinate all communications between the Rutgers and Stevens research teams and will be responsible for arranging regular meeting times.</p>
				<p>Dr. Chirag Shah is an assistant professor of Information Science and an affiliate member of Computer Science at Rutgers University.</p>
				<p>PhD in Information Science from UNC Chapel Hill</p>
			</div>
			<div class="grid_4">
				<img src="images/naaman.jpg" height=200 width=200 />
				<h3>Dr. Mor Naaman</h3>
				<p>PI Naaman will supervise the development of the Explore component of SOCRATES.</p>
				<p>Dr. Mor Naaman is an associate professor at Cornell Tech, where he is one of the first faculty at the Jacobs Technion Cornell Innovation Institute.</p>
				<p>Ph.D. in Computer Science from Stanford University</p>
				<br><br><br><br>
			</div>
			<div class="grid_4">
				<img src="images/mason.jpg" height=200 width=200 />
				<h3>Dr. Winter Mason</h3>
				<p>PI Mason will focus on Analyze aspects by integrating the processes with existing crowdsourcing technologies.</p>
				<p>Dr. Winter Mason is an assistant professor at Stevens Institute of Technology.</p>
				<p>Ph.D. in Social Psychology from Indiana University Bloomington</p>
				<br><br><br><br>
			</div>
			<div class="grid_4">
				<img src="images/ziad.jpg" height=200 width=200 />
				<h3>Ziad Matni</h3>
				<p>Ziad Matni is a doctoral student at SC&I-Rutgers, doing research in Information Science. His over-arching goals include to better understand why and how we use ICTs (specifically, social media). He is interested in using social media tools in novel ways to help us understand new and interesting things about ourselves, our social networks, our communities, and our neighborhoods. Ziad has a masters of science in electrical engineering from the University of Southern California and worked in several engineering and management positions in the electronics communication industry for about 13 years before turning to academia. <a href="http://www.ziadmatni.com">Personal website</a>.</p>
			</div>
			<div class="grid_4">
				<img src="images/choi.jpg" height=200 width=200 />
				<h3>Dongho Choi</h3>
				<p>Dongho Choi is a doctoral student in Library and Information Science at Rutgers University. He is interested in people's information behavior on social media, specifically in the context of business: product/service consumption, word of mouth, corporate strategy. He has educational background in Computer Science, Economics, and Business and worked at Samsung Electronics for 3 and half years as an engineer.</p>
			</div>
			<div class="grid_4">
				<img src="images/kevin.jpg" height=200 width=200 />
				<h3>Kevin Albertson</h3>
				<p>Kevin Albertson is currently an undergraduate student at Rutgers University majoring in Computer Science and Mathematics. He plans on pursuing research after his undergraduate studies. His main experience is in web and game development but he continues exploring a variety of interests.</p>
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
