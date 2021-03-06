const express = require('express');
const router = express.Router();

/* GET users listing */
router.get('/', function (req, res, next) {
  res.json({user: req.user.id})
});

/* GET user profile */
router.get('/profile', function (req, res, next) {
  res.json(req.user);
})

module.exports = router;