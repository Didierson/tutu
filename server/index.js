require('dotenv').config();

const express = require('express');
const socketIo = require('socket.io');
const morgan = require('morgan');
const compression = require('compression');
const passport = require('passport');
const bodyParser = require('body-parser');
const http = require('http');
const errorhandler = require('errorhandler');
const r = require('rethinkdb');
const cors = require('cors');
const initDb = require('./db');
const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketIo(server);
const ioClient = io.of('/client');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression({
  level: 9,
  memLevel: 9,
}));

app.use(cors({ exposedHeaders: 'X-Total-Count' }));

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(errorhandler());
}

initDb((conn) => {
  io.sockets.on('connection', (socket) => {
    console.log(`${socket.id} has connected`);
  });

  ioClient.on('connection', (socket) => {
    console.log(`${socket.id} has connected`);
  });

  r.table('articles')
    .changes()
    .eqJoin(r.row('sourceId'), r.table('sources'))
    .map((doc) => ({
      url: doc('new_val')('left')('url'),
      title: doc('new_val')('left')('title'),
      authors: doc('new_val')('left')('authors'),
      keywords: doc('new_val')('left')('keywords'),
      publishDate: doc('new_val')('left')('publishDate'),
      sentiment: doc('new_val')('left')('sentiment'),
      summary: doc('new_val')('left')('summary'),
      summary2: doc('new_val')('left')('summary2'),
      categories: doc('new_val')('left')('categories').filter((category) => category('score').gt(0)),
      locations: doc('new_val')('left')('locations').map((loc) => loc('location')('position').toGeojson()('coordinates')),
      source: {
        url: doc('new_val')('right')('contentData')('dataUrl'),
        title: doc('new_val')('right')('contentData')('siteData')('title'),
        description: doc('new_val')('right')('contentData')('siteData')('description'),
        aboutUsUrl: doc('new_val')('right')('aboutUsUrl'),
        contactUsUrl: doc('new_val')('right')('contactUsUrl'),
        relatedLinks: doc('new_val')('right')('related')('relatedLinks')('relatedLink'),
      },
    }))
    .run(conn, (err, cursor) => {
      if (err) throw err;
      console.log(cursor);
      cursor.each((e, article) => {
        if (e) throw e;

        console.log(article);
        io.of('/client').emit('newArticle', article);
      });
    });

  r.table('sources').changes().run(conn, (err, cursor) => {
    if (err) throw err;

    cursor.each((e, source) => {
      if (e) throw e;
      io.emit('newSources', source);
    });
  });

  r.table('users').changes().run(conn, (err, cursor) => {
    if (err) throw err;

    cursor.each((e, user) => {
      if (e) throw e;
      io.emit('newUsers', user);
    });
  });

  app.use(routes(conn, io));

  // / catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (!isProduction) {
    app.use((err, req, res, next) => {
      console.log(err.stack);

      res.status(err.status || 500);

      res.json({
        errors: {
          message: err.message,
          error: err,
        },
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
  });
});
