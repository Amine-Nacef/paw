CREATE DATABASE web_app;
CREATE TABLE names(
    id INT AUTO_INCREMENT,
    PRIMARY KEY (id),
    name VARCHAR(100),
    date_added DATETIME,
    priority VARCHAR(20) DEFAULT 'not important'
);
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE names ADD COLUMN user_id INT;
ALTER TABLE names ADD FOREIGN KEY (user_id) REFERENCES users(id);