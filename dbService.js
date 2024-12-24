const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "web_app"
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async createUser(username, email, password) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?);";
                connection.query(query, [username, email, password], (err, result) => {
                    if (err) reject(err);
                    resolve(result.insertId);
                });
            });
            return insertId;
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            const user = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE username = ?;";
                connection.query(query, [username], (err, results) => {
                    if (err) reject(err);
                    resolve(results[0]);
                });
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllData(userId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE user_id = ?;";
                connection.query(query, [userId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name, priority, userId) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, priority, date_added, user_id) VALUES (?,?,?,?);";
                connection.query(query, [name, priority, dateAdded, userId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });
            return {
                id: insertId,
                name: name,
                priority: priority,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id, userId) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ? AND user_id = ?";
                connection.query(query, [id, userId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name, priority, userId) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ?, priority = ? WHERE id = ? AND user_id = ?";
                connection.query(query, [name, priority, id, userId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name, userId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name LIKE ? AND user_id = ?;";
                connection.query(query, [`%${name}%`, userId], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;