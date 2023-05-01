const { Router } = require('express');
const path = require('path');

//  Router init
const router = Router();

router.get('/:id', (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/nick.html"));
});

module.exports = router;