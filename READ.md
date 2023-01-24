# DOCUMENTRY

## FRONT-END

Host the "sign-up.html" file with a VSCode extension called as [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and you are good to go.

I am using MySQL as a Database and Express JS for the back-end of this application. Here are the scripts to create the schema and tables.
## SCHEMA

>CREATE DATABASE \`expensetracker\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

## TABLE - USERS

>CREATE TABLE \`expenses\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`money\` varchar(150) NOT NULL,
  \`category\` varchar(150) NOT NULL,
  \`description\` text,
  \`email\` varchar(150) NOT NULL,
  \`timestamp\` varchar(150) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

## TABLE - EXPENSES

>CREATE TABLE \`users\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`username\` varchar(150) NOT NULL,
  \`email\` varchar(150) NOT NULL,
  \`password\` text NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  UNIQUE KEY \`email_UNIQUE\` (\`email\`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

*Happy Hacking!*
