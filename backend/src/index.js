const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const listener = app.listen(process.env.PORT, () => {
    console.log('Listening on port ' + listener.address().port);
});

module.exports = app;
