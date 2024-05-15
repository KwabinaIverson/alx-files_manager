const express = require('express');
import router from './routes/index';

// Creating a instance of express
const app = express();

// Get port from Environment or use port 5000
const port = parseInt(process.env.PORT, 10) || 5000;


app.use(express.json());
app.use('/', router);


// Get app to listen on port
app.listen(port, () => {
    console.log(`Express is live and listening on port: ${port}`);
});

module.exports = app;