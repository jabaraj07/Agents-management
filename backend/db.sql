-- -- Run this script against your MySQL server to create the required tables.
-- -- Ensure the database `interview_crud_db` is created before executing.

-- CREATE DATABASE IF NOT EXISTS `interview_crud_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `interview_crud_db`;

-- -- users table
-- CREATE TABLE IF NOT EXISTS `users` (
--   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   `full_name` VARCHAR(255) NOT NULL,
--   `email` VARCHAR(255) NOT NULL,
--   `mobile` VARCHAR(20) NOT NULL,
--   `password` VARCHAR(255) NOT NULL,
--   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `uniq_user_email` (`email`),
--   UNIQUE KEY `uniq_user_mobile` (`mobile`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -- agents table
-- CREATE TABLE IF NOT EXISTS `agents` (
--   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   `name` VARCHAR(255) NOT NULL,
--   `email` VARCHAR(255) NOT NULL,
--   `mobile` VARCHAR(20) NOT NULL,
--   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `uniq_agent_email` (`email`),
--   UNIQUE KEY `uniq_agent_mobile` (`mobile`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Create database
CREATE DATABASE IF NOT EXISTS agent_management;
USE agent_management;

-- =========================
-- Users Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================
-- Agents Table
-- =========================
CREATE TABLE IF NOT EXISTS agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_agent_email (email),
  UNIQUE KEY uniq_agent_mobile (mobile),

  CONSTRAINT fk_agent_user
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;