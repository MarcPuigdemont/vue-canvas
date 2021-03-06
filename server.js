'use strict';

var bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const junk = require('junk');
const cors = require('cors')();
let app = express();
app.use(cors);
app.options('*', cors);

app.use(express.static('./'));
app.use(bodyParser.json());

// define file name and destination to save
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/images');
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
    cb(null, 'uploads-' + Date.now() + '.' + ext);
  },
});

// define what file type to accept
let filter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true);
  } else {
    cb('Failed: format not supported');
  }
};

// set multer config
let upload = multer({
  storage: storage,
  fileFilter: filter,
}).single('upload');

/* ===============================
  ROUTE
 ============================== */

// route for file upload
app.post('/uploads', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: err });
    } else {
      res.status(200).json({
        file:
          req.protocol +
          '://' +
          req.get('host') +
          '/images/' +
          req.file.filename,
      });
    }
  });
});

app.get('/images', (req, res) => {
  let file_path = req.protocol + '://' + req.get('host') + '/images/';
  let files = fs.readdirSync('./images/');
  files = files
    .filter(junk.not) // remove .DS_STORE etc
    .map(f => file_path + f); // map with url path
  res.json(files);
});

const item = (x, y, w, h, type, model) => ({ x, y, w, h, type, model });
const url = url => `http://localhost:8000/images/${url}`;
let items = [
  item(10, 10, 200, 40, 'TEXT', { text: 'This is a text' }),
  item(30, 60, 120, 100, 'IMAGE', { url: url('uploads-1462948453043.png') }),
  item(100, 200, 100, 60, 'TEXT', { text: 'This is another text' }),
  item(400, 50, 120, 180, 'IMAGE', { url: url('uploads-1462948491987.png') }),
];

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  items = req.body;
  res.sendStatus(200);
});

app.post('/item', (req, res) => {
  items.push(req.body);
  res.sendStatus(200);
});

app.put('/item', (req, res) => {
  const { index, item } = req.body;
  items[index] = item;
  res.sendStatus(200);
});

app.delete('/item', (req, res) => {
  const index = req.body.index;
  items.splice(index, 1);
  res.sendStatus(200);
});

// general route # Modified to point to frontend instead of static file
app.get('/', (req, res) => {
  res.redirect('http://localhost:8080');
});

var server = app.listen(8000, _ => {
  console.log('server started. listening to 8000');
});
