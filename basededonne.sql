CREATE DATABASE web_app;
CREATE TABLE names(
    id INT AUTO_INCREMENT,
    PRIMARY KEY (id),
    name VARCHAR(100),
    date_added DATETIME,
    priority VARCHAR(20) DEFAULT 'not important'
);