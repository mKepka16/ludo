const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// App init
const app = express();
const PORT = process.env.PORT || 5500;

// Middle ware
app.use(express.static('public'));
app.use(express.static(__dirname + '/public/nick.html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

// Routers & Routes
const rooms = require('./routes/rooms');
app.use('/rooms', rooms);

const nick = require('./routes/nick');
app.use('/nick', nick);

const game = require('./routes/game');
app.use('/game', game);

const error = require('./routes/error');
app.use('/error', error);

const token = require('./routes/token');
app.use('/token', token);

// Starting app
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
