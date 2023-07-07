const express = require('express');
const database = require('./db.js');

const app = express();
const port = 3000;
    
const search = require('./search.js');
app.use('/search/', search);

const history = require('./history.js');
app.use('/history', history);

// start the server
app.listen(port, async () => {
    console.log(`Server is listening on port ${port}`);
    await database.connect();
});
