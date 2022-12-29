CREATE DATABASE database_lottery;

USE database_lottery;

-- Users table --

CREATE TABLE users(
    id INT(11) NOT NULL, 
    username VARCHAR(16) NOT NULL, 
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;


-- Links table --

CREATE TABLE links (
    id INT(11) NOT NULL, 
    title VARCHAR(150) NOT NULL, 
    url VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT(11), 
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE links
    ADD PRIMARY KEY (id);

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

CREATE TABLE numbers (
    id INT(11) NOT NULL PRIMARY KEY , 
    NumbersNumber VARCHAR(10) NOT NULL,
    NumbersReward VARCHAR(100) NOT NULL,
    UserId INT(11),
    NumbersGroup INT(11)
    NumbersCreatedAt TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user_numbers FOREIGN KEY (UserId) REFERENCES users(id)
);

ALTER TABLE numbers
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;



CREATE TABLE clients (
    id INT(11) NOT NULL PRIMARY KEY , 
    numero VARCHAR(10) NOT NULL,
    ClientsName VARCHAR(100) NOT NULL,
    ClientsEmail VARCHAR(50) NULL,
    ClientsPhone VARCHAR(50) NULL,
    number_id INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_client_numbers FOREIGN KEY (number_id) REFERENCES numbers(id)
);

ALTER TABLE clients
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

CREATE TABLE rewards (
    RewardRewardId INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, AUTO_INCREMENT	= 2, 
    RewardName VARCHAR(100) NOT NULL,
    RewardDescription TEXT,
    RewardNumberId INT(11),
    RewardClientId INT(11),
    RewardUserId INT(11),
    RewardValue INT(11),
    RewardCoin VARCHAR(15),
    RewardCreatedAt DATE, /*TIMESTAMP NOT NULL DEFAULT current_timestamp,*/
    CONSTRAINT fk_rewards_numbers FOREIGN KEY (RewardNumberId) REFERENCES numbers(id),
    CONSTRAINT fk_rewards_clients FOREIGN KEY (RewardClientId) REFERENCES clients(id)

);

ALTER TABLE rewards
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE rewards ADD `RewardDate` DATE AFTER `RewardUserId`;
