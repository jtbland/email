import express = require('express');
import mongoose = require('mongoose')
import passport = require('passport');
import jwt = require('jsonwebtoken');
import User from '../models/user';

let router = express.Router();

router.post('/register', function(req, res, next) {
  let user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(function(err, user) {
    if(err) return next(err);
    res.send("Registration Complete. Please login.");
  });
});

router.post('/login/local', function(req, res, next) {
  if(!req.body.username || !req.body.password) return res.status(400).send("Please fill out every field");
  passport.authenticate('local', function(err, user, info) {
    console.log(user);
    if(err) return next(err);
    if(user) return res.json({ token : user.generateJWT() });
      return res.status(400).send(info);
  })(req, res, next);
});

export default router;
