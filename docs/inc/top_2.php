
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
  <div id="container">
  	<hgroup>
  		<h1>SOCRATES Documentation</h1>
  		<h2><?php echo $PG_NAME; ?></h2>
  	</hgroup>
  	<nav><ul>
  		<li><a href="index.php" <?php if($PG_ID == "basic") echo "class='active';"; ?>>Basic Usage</a></li>
  		<li><a href="dev.php" <?php if($PG_ID == "overview") echo "class='active';"; ?>>Development Overview</a></li>
  		<li><a href="ca.php" <?php if($PG_ID == "ca") echo "class='active';"; ?>>Creating a Collection/Analysis Module</a></li>
  		<li><a href="v.php" <?php if($PG_ID == "v") echo "class='active';"; ?>>Creating a Visualization Module</a></li>
  	</ul></nav>