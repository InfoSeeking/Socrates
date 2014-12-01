-- MySQL dump 10.13  Distrib 5.5.35, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: socrates
-- ------------------------------------------------------
-- Server version	5.5.35-0ubuntu0.12.10.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `run_log`
--

DROP TABLE IF EXISTS `run_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `run_log` (
  `type` varchar(200) DEFAULT NULL,
  `module` varchar(200) DEFAULT NULL,
  `function` varchar(200) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `run_log`
--

LOCK TABLES `run_log` WRITE;
/*!40000 ALTER TABLE `run_log` DISABLE KEYS */;
INSERT INTO `run_log` VALUES ('collection','twitter','tw_search','2014-10-10 17:53:22',4,36),('collection','twitter','tw_search','2014-10-10 18:08:44',4,37),('collection','facebook','facebook_search','2014-10-12 18:44:08',4,38),('collection','facebook','facebook_search','2014-10-12 18:47:53',4,39),('collection','facebook','facebook_search','2014-10-12 18:48:28',4,40),('collection','facebook','facebook_search','2014-10-12 18:48:48',4,41),('collection','facebook','facebook_search','2014-10-12 18:49:19',4,42),('collection','facebook','facebook_search','2014-10-12 18:54:17',4,43),('collection','facebook','facebook_search','2014-10-13 12:06:17',4,44),('analysis','stats','basic','2014-10-13 12:06:27',4,45),('collection','twitter','twitter_search','2014-10-13 12:07:18',4,46),('analysis','text','word_count','2014-10-13 12:07:34',4,47),('collection','twitter','twitter_search','2014-10-13 13:26:15',4,48),('collection','facebook','facebook_search','2014-10-13 13:35:36',4,49),('analysis','stats','binary_operation','2014-10-13 13:37:34',4,50),('collection','twitter','twitter_search','2014-10-13 13:42:25',4,51),('collection','twitter','twitter_search','2014-10-13 13:49:05',4,52),('collection','twitter','twitter_search','2014-10-13 13:53:06',4,53),('analysis','text','sentiment','2014-10-13 13:53:14',4,54),('collection','twitter','twitter_search','2014-10-13 13:54:04',4,55),('analysis','text','sentiment','2014-10-13 13:54:18',4,56),('collection','twitter','twitter_search','2014-10-13 14:03:33',4,57),('analysis','stats','basic','2014-10-13 14:03:41',4,58),('collection','twitter','twitter_search','2014-10-13 14:15:34',4,59),('analysis','text','sentiment','2014-10-13 14:15:42',4,60),('analysis','text','sentiment','2014-10-13 14:18:18',4,61),('analysis','text','sentiment','2014-10-13 14:38:22',4,62),('analysis','text','word_count','2014-10-13 14:42:11',4,63),('analysis','stats','correlation','2014-10-13 14:42:47',4,64),('collection','twitter','twitter_search','2014-10-18 19:20:16',6,65),('collection','twitter','twitter_search','2014-10-23 16:36:25',6,66),('analysis','stats','basic','2014-10-23 16:37:15',6,67),('collection','youtube','search','2014-10-23 16:44:13',6,68),('analysis','text','sentiment','2014-10-24 15:00:35',6,69),('collection','facebook','facebook_search','2014-10-27 13:03:26',4,70),('collection','facebook','facebook_search','2014-10-27 13:03:43',4,71);
/*!40000 ALTER TABLE `run_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(250) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('derp','a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',2),('kevinAlbs','5b934839b204776b1d3de55a7e18583317df3df6',3),('test','a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',4),('herp','e057d4ea363fbab414a874371da253dba3d713bc',5),('asdf','3da541559918a808c2402bba5012f6c60b27661c',6);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-10-27 14:43:11
