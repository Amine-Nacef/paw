const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbService = require('./dbService');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
// Update the insert route
app.post('/insert', (request, response) => {
    const { name, priority } = request.body; 
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewName(name, priority);
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

// Update the update route
app.patch('/update', (request, response) => {
    const { id, name, priority } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.updateNameById(id, name, priority);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});
// read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})
// delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});
app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})
app.listen(5000, () => console.log('app is running'));