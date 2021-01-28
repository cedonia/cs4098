const express = require('express');
const app = express();
const path = require('path');

const PORT = 12345;

app.use(express.static(path.join(__dirname, 'build')));
app.listen(PORT);
