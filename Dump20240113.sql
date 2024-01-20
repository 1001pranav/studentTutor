-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: smv_class
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`class_id`),
  KEY `classCreated_by_idx` (`created_by`),
  CONSTRAINT `classCreated_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_files`
--

DROP TABLE IF EXISTS `class_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `file_location` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` int DEFAULT NULL,
  `file_type` tinyint DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `class_files_createdBy_idx` (`uploaded_by`),
  KEY `class_files_class_id_idx` (`class_id`),
  CONSTRAINT `class_files_class_id` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_files_createdBy` FOREIGN KEY (`uploaded_by`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_files`
--

LOCK TABLES `class_files` WRITE;
/*!40000 ALTER TABLE `class_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_users`
--

DROP TABLE IF EXISTS `class_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_users` (
  `user_id` int NOT NULL,
  `class_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`class_id`),
  KEY `class_users_ibfk_2` (`class_id`),
  CONSTRAINT `class_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_users_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_users`
--

LOCK TABLES `class_users` WRITE;
/*!40000 ALTER TABLE `class_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `push_token` varchar(255) DEFAULT NULL,
  `user_type` tinyint DEFAULT '0' COMMENT '0 -> Student \n 1 -> Tutor',
  `device_type` tinyint DEFAULT '3' COMMENT '0 -> web \n 1 -> android \n 2 -> IOS \n 3 -> Others/None',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Pranav Nayak','npranavr@gmail.com','$2b$10$Qc5J.prK4RLPFryWDTWrxOZnM0Npqr83nfGHQr0WZUYD2lAMIXXyO','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MDUwNTgwOTl9.ru6XN5Zvo-BBJ-zfhKvluA90FVzj8nEoNbru8LAsft4',NULL,1,3),(2,NULL,'email@gmail.com','$2b$10$ustk1XXVgsq8oQsXLvnBk.n1hzNLPlp2gV1a6i6nQ/JrHXXxbq4KO',NULL,NULL,0,3),(3,NULL,'email1@gmail.com','$2b$10$ustk1XXVgsq8oQsXLvnBk.n1hzNLPlp2gV1a6i6nQ/JrHXXxbq4KO','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE3MDUwNTczNzl9.SL25rYsZNHutNQ84PeVhXk1Yef5Cq5Sb0J-HTgOD-xo',NULL,0,3),(4,'testEmail','emai1@gmail.com','$2b$10$yu24Bz5IpyhymP8DxIqwMOE41.7j0I.BGtE.WWyQfXFfDf1CtVGL2',NULL,NULL,1,3),(5,'testEmail','email1@gmail.com','$2b$10$PnANR9Utk8QaxcqMm5dpEuke6ipx59G10m.wqdXztd2VvLgGGH15e','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJpYXQiOjE3MDUwNTgwMzh9.hdIEJnzpyPKw1by8kTOe7KLu_iGtEmyGVvV14OJn2LE',NULL,1,3);
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

-- Dump completed on 2024-01-13  0:39:47
