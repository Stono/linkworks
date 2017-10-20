'use strict';
const store = new require('./lib/store')('linkworks');
const async = require('async');

const handleGet = function(req, res) {
  store.get(req.path, (err, value) => {
    if(err) { return res.status(500).send(err); }
    res.redirect(307, value);
  });
};

const handlePut = function(req, res) {
  console.log('Setting up redirect for ' + req.path + ' to ' + req.query.target);
  store.set(req.path, req.query.target, err => {
    if(err) { return res.status(500).send(err); }
    res.status(202);
    res.end();
  });
};

const handlePost = function(req, res) {
  res.status(400).send('unsupported method');
};

const handleDelete = function(req, res) {
  res.status(400).send('unsupported method');
};
const handlers = {
  GET: handleGet,
  PUT: handlePut,
  POST: handlePost,
  DELETE: handleDelete
};

const isEmpty = function(value) {
  return value === undefined || value === null;
};

const validateRequest = function(req, done) {
  const validatePath = next => {
    if(req.path === '/' || isEmpty(req.path)) {
      return next(new Error('no path specified'));
    }
    next();
  };
  const validateRedirectionTarget = next => {
    if(req.method === 'PUT' && isEmpty(req.query.target)) {
      return next(new Error('no redirection target specified'));
    }
    next();
  };
  async.series([
    validatePath,
    validateRedirectionTarget
  ], done);
};

exports.linkworks = function(req, res) {
  const handleError = err => {
    if(isEmpty(err)) {
      return handlers[req.method](req, res);
    }
    res.status(400);
    res.send('error: ' + err.message);
    return false;
  };
  validateRequest(req, handleError);
};
