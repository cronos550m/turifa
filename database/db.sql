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
    numero VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    user_id INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user_numbers FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE numbers
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;



CREATE TABLE clients (
    id INT(11) NOT NULL PRIMARY KEY , 
    numero VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    number_id INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_client_numbers FOREIGN KEY (number_id) REFERENCES numbers(id)
);

ALTER TABLE clients
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
