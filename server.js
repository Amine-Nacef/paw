const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = dbService.getDbServiceInstance();
    
    try {
        const user = await db.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser(username, email, hashedPassword);
        res.json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Username or email already exists' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

// Protected routes
app.post('/insert', authenticateToken, (request, response) => {
    const { name, priority } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewName(name, priority, request.user.id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/getAll', authenticateToken, (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData(request.user.id);
    
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.patch('/update', authenticateToken, (request, response) => {
    const { id, name, priority } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.updateNameById(id, name, priority, request.user.id);
    
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

app.delete('/delete/:id', authenticateToken, (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id, request.user.id);
    
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

app.get('/search/:name', authenticateToken, (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(name, request.user.id);
    
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.listen(5000, () => console.log('app is running'));