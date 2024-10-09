const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger('dev'));

// storing resources
let resources = [];

// creating a resource and return it with an id
app.post('/resources', (req, res) => {
    try {
        const newResource = req.body;
        if (!newResource || !newResource.name) {
            return res.status(400).json({ error: 'Missing required fields: name' });
        }
        newResource.id = resources.length + 1;
        resources.push(newResource);
        res.status(201).json(newResource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// reading all resources and returning them.
app.get('/resources', (req, res) => {
    try {
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// deleting a resource by id
app.delete('/resources/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resourceIndex = resources.findIndex(resource => resource.id === id);
        if (resourceIndex === -1) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        const deletedResource = resources.splice(resourceIndex, 1)[0];
        res.json(deletedResource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// error handling middleware
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});