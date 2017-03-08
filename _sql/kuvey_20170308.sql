CREATE DATABASE  IF NOT EXISTS `kuvey` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `kuvey`;
-- MySQL dump 10.13  Distrib 5.6.19, for osx10.7 (i386)
--
-- Host: 192.168.1.1    Database: kuvey
-- ------------------------------------------------------
-- Server version	5.7.14-log

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
-- Table structure for table `colleage`
--

DROP TABLE IF EXISTS `colleage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `colleage` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colleage`
--

LOCK TABLES `colleage` WRITE;
/*!40000 ALTER TABLE `colleage` DISABLE KEYS */;
INSERT INTO `colleage` VALUES (0,'공공정책대학'),(1,'과학기술대학'),(3,'글로벌비즈니스대학'),(2,'문화스포츠대학'),(4,'약학대학');
/*!40000 ALTER TABLE `colleage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `colleage_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,1,'응용수리과학부'),(2,1,'디스플레이ㆍ반도체물리학부'),(3,1,'신소재화학과'),(4,1,'컴퓨터융합소프트웨어학과'),(5,1,'전자및정보공학과'),(6,1,'생명정보공학과'),(7,1,'식품생명공학과'),(8,1,'전자ㆍ기계융합공학과'),(9,1,'환경시스템공학과'),(10,1,'자유공학부'),(11,0,'정부행정학부'),(12,0,'공공사회ㆍ통일외교학부'),(13,0,'경제통계학부'),(14,2,'국제스포츠학부'),(15,2,'문화유산융합학부'),(16,2,'문화창의학부'),(17,3,'글로벌학부'),(18,3,'융합경영학부'),(19,4,'약학과');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submitcomment`
--

DROP TABLE IF EXISTS `submitcomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submitcomment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submit_id` varchar(32) NOT NULL,
  `comment` text,
  PRIMARY KEY (`id`),
  KEY `submit_id` (`submit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submitcomment`
--

LOCK TABLES `submitcomment` WRITE;
/*!40000 ALTER TABLE `submitcomment` DISABLE KEYS */;
INSERT INTO `submitcomment` VALUES (1,'b479d1aa978461ff42a85e18a0ae3bff','');
/*!40000 ALTER TABLE `submitcomment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submitlist`
--

DROP TABLE IF EXISTS `submitlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submitlist` (
  `submit_id` varchar(32) NOT NULL,
  `survey_id` varchar(32) NOT NULL,
  `student_id` varchar(45) NOT NULL,
  `grade` tinyint(4) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`submit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submitlist`
--

LOCK TABLES `submitlist` WRITE;
/*!40000 ALTER TABLE `submitlist` DISABLE KEYS */;
INSERT INTO `submitlist` VALUES ('b479d1aa978461ff42a85e18a0ae3bff','157525834b26df1c59a224a38fb3e8d8','l2ttlebit',2,'2017-03-08 09:37:44',NULL);
/*!40000 ALTER TABLE `submitlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submittype0`
--

DROP TABLE IF EXISTS `submittype0`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submittype0` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submit_id` varchar(32) NOT NULL,
  `no` int(11) NOT NULL,
  `input` text,
  PRIMARY KEY (`id`),
  KEY `submit_id` (`submit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submittype0`
--

LOCK TABLES `submittype0` WRITE;
/*!40000 ALTER TABLE `submittype0` DISABLE KEYS */;
INSERT INTO `submittype0` VALUES (1,'b479d1aa978461ff42a85e18a0ae3bff',17,'학식이 좀 더 맛있었으면 좋겠습니다.');
/*!40000 ALTER TABLE `submittype0` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submittype1`
--

DROP TABLE IF EXISTS `submittype1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submittype1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submit_id` varchar(32) NOT NULL,
  `no` int(11) NOT NULL,
  `select` int(11) NOT NULL,
  `input` text,
  PRIMARY KEY (`id`),
  KEY `submit_id` (`submit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submittype1`
--

LOCK TABLES `submittype1` WRITE;
/*!40000 ALTER TABLE `submittype1` DISABLE KEYS */;
INSERT INTO `submittype1` VALUES (1,'b479d1aa978461ff42a85e18a0ae3bff',14,2,'쿠하스'),(2,'b479d1aa978461ff42a85e18a0ae3bff',15,3,NULL),(3,'b479d1aa978461ff42a85e18a0ae3bff',16,1,NULL);
/*!40000 ALTER TABLE `submittype1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submittype2`
--

DROP TABLE IF EXISTS `submittype2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submittype2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submit_id` varchar(32) NOT NULL,
  `no` int(11) NOT NULL,
  `select` int(11) DEFAULT NULL,
  `input` text,
  PRIMARY KEY (`id`),
  KEY `submit_id` (`submit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submittype2`
--

LOCK TABLES `submittype2` WRITE;
/*!40000 ALTER TABLE `submittype2` DISABLE KEYS */;
INSERT INTO `submittype2` VALUES (1,'b479d1aa978461ff42a85e18a0ae3bff',13,3,NULL);
/*!40000 ALTER TABLE `submittype2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submittype3`
--

DROP TABLE IF EXISTS `submittype3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submittype3` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submit_id` varchar(32) NOT NULL,
  `no` int(11) NOT NULL,
  `select` int(11) DEFAULT NULL,
  `order` int(11) NOT NULL,
  `input` text,
  PRIMARY KEY (`id`),
  KEY `submit_id` (`submit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submittype3`
--

LOCK TABLES `submittype3` WRITE;
/*!40000 ALTER TABLE `submittype3` DISABLE KEYS */;
INSERT INTO `submittype3` VALUES (1,'b479d1aa978461ff42a85e18a0ae3bff',18,1,0,NULL),(2,'b479d1aa978461ff42a85e18a0ae3bff',18,3,1,NULL),(3,'b479d1aa978461ff42a85e18a0ae3bff',18,4,2,NULL);
/*!40000 ALTER TABLE `submittype3` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surveylist`
--

DROP TABLE IF EXISTS `surveylist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `surveylist` (
  `survey_id` varchar(32) NOT NULL,
  `professor_id` varchar(45) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `title` varchar(50) NOT NULL,
  `notice` varchar(200) DEFAULT '',
  `no_idx` int(11) NOT NULL,
  `started_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`survey_id`,`type`),
  KEY `professor_id` (`professor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surveylist`
--

LOCK TABLES `surveylist` WRITE;
/*!40000 ALTER TABLE `surveylist` DISABLE KEYS */;
INSERT INTO `surveylist` VALUES ('157525834b26df1c59a224a38fb3e8d8','orion627',0,'전자및정보공학과 상시상담학생설문지 기본서식','여러분들의 상담을 위해 필요한 자료입니다. 꼼꼼히 작성 바랍니다.\n(2017. 01 테스트 작성)',19,'2017-03-05 19:29:52','2017-03-20 19:29:52',NULL,'2017-03-05 12:35:09');
/*!40000 ALTER TABLE `surveylist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surveyoption`
--

DROP TABLE IF EXISTS `surveyoption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `surveyoption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id` varchar(32) NOT NULL,
  `no` int(11) NOT NULL,
  `no_idx` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `maxlength` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `options` text,
  PRIMARY KEY (`id`),
  KEY `survey_id` (`survey_id`)
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surveyoption`
--

LOCK TABLES `surveyoption` WRITE;
/*!40000 ALTER TABLE `surveyoption` DISABLE KEYS */;
INSERT INTO `surveyoption` VALUES (244,'157525834b26df1c59a224a38fb3e8d8',13,4,1,2,NULL,'현재 사는 곳','[{\"no\":1,\"order\":0,\"name\":\"통학\",\"write\":false},{\"no\":2,\"order\":1,\"name\":\"기숙사\",\"write\":false},{\"no\":3,\"order\":2,\"name\":\"자취\",\"write\":false},{\"no\":4,\"order\":3,\"name\":\"기타\",\"write\":true}]'),(245,'157525834b26df1c59a224a38fb3e8d8',14,6,3,1,NULL,'이점에서 학교 다니는 것이 좋다','[{\"no\":1,\"order\":0,\"name\":\"친구와의 관계\",\"write\":false},{\"no\":2,\"order\":1,\"name\":\"동아리 및 소모임\",\"write\":true},{\"no\":3,\"order\":2,\"name\":\"학과내용 및 활동\",\"write\":false},{\"no\":4,\"order\":3,\"name\":\"독립된 생활\",\"write\":false},{\"no\":5,\"order\":4,\"name\":\"없다\",\"write\":false},{\"no\":6,\"order\":5,\"name\":\"기타\",\"write\":true}]'),(246,'157525834b26df1c59a224a38fb3e8d8',15,5,4,1,NULL,'지난 학기 성적','[{\"no\":1,\"order\":0,\"name\":\"4.0이상\",\"write\":false},{\"no\":2,\"order\":1,\"name\":\"3.5 ~ 4.0\",\"write\":false},{\"no\":3,\"order\":2,\"name\":\"3.0 ~ 3.5\",\"write\":false},{\"no\":4,\"order\":3,\"name\":\"2.5 ~ 3.0\",\"write\":false},{\"no\":5,\"order\":4,\"name\":\"2.5이하\",\"write\":false}]'),(247,'157525834b26df1c59a224a38fb3e8d8',16,5,5,1,NULL,'학과목 중 가장 어려운 과목은?','[{\"no\":1,\"order\":0,\"name\":\"영어\",\"write\":false},{\"no\":2,\"order\":1,\"name\":\"기초 공통 교양\",\"write\":false},{\"no\":3,\"order\":2,\"name\":\"전공필수\",\"write\":true},{\"no\":4,\"order\":3,\"name\":\"전공선택\",\"write\":true},{\"no\":5,\"order\":4,\"name\":\"기타\",\"write\":true}]'),(248,'157525834b26df1c59a224a38fb3e8d8',17,0,2,0,200,'학교에 요청 사항 (궁금한 점)',NULL),(249,'157525834b26df1c59a224a38fb3e8d8',18,5,0,3,NULL,'미래 진로','[{\"no\":1,\"order\":0,\"name\":\"취업\",\"write\":false},{\"no\":2,\"order\":1,\"name\":\"창업\",\"write\":false},{\"no\":3,\"order\":2,\"name\":\"대학원 진학\",\"write\":false},{\"no\":4,\"order\":3,\"name\":\"해외 유학\",\"write\":false},{\"no\":5,\"order\":4,\"name\":\"기타\",\"write\":true}]');
/*!40000 ALTER TABLE `surveyoption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` varchar(50) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `hak_name` varchar(50) NOT NULL,
  `hak_number` int(11) NOT NULL,
  `hak_depart` varchar(100) NOT NULL,
  `hak_level` tinyint(1) NOT NULL,
  `groupnmlist` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('l2ttlebit',2016,'양해찬',2016270501,'전자및정보공학과;',0,'학부 재학;','2017-03-08 09:36:52'),('orion627',0,'이재우',99210917,'전자및정보공학과;전자전기공학과;전기및전자및전파공학부;',0,'교원 재직;대학원 졸업;학부 졸업;','2017-03-08 09:34:00');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'kuvey'
--

--
-- Dumping routines for database 'kuvey'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-03-08 11:32:11
