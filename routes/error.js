const { Router } = require('express');
const path = require('path');

//  Router init
const router = Router();

router.get('/cannot-join-queue', (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/cannot-join-queue.html"));
})

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/error.html"));
})

module.exports = router;