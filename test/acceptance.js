'use strict';
const server = require('../index');
const deride = require('deride');
const should = require('should');

describe('Acceptance', () => {
  let res;
  beforeEach(() => {
    res = deride.stub(['status', 'send', 'redirect']);
  });

  it('should redirect requests', done => {
    const validateRedirect = (code, value) => {
      should(code).eql(307);
      should(value).eql('/some/other/url');
      done();
    };
    const nowGetIt = () => {
      const req = {
        method: 'GET',
        path: '/some/url'
      };
      res.setup.redirect.toDoThis(validateRedirect);
      server.linkworks(req, res);
    };
    res.setup.status.toDoThis(nowGetIt);

    const saveIt = () => {
      let req = {
        method: 'PUT',
        path: '/some/url',
        query: { target: '/some/other/url' }
      };
      server.linkworks(req, res);
    };
    saveIt();
  });

  it('GET should return bad request when missing a path', done => {
    const validateError = msg => {
      should(msg).eql('error: no path specified');
      res.expect.status.called.withArg(400);
      done();
    };
    res.setup.send.toDoThis(validateError);
    let req = {
      method: 'GET'
    };
    server.linkworks(req, res);
  });

  it('PUT should return bad request when missing a path', done => {
    const validateError = msg => {
      should(msg).eql('error: no path specified');
      res.expect.status.called.withArg(400);
      done();
    };
    res.setup.send.toDoThis(validateError);
    let req = {
      method: 'PUT',
      body: '/some/other/url'
    };
    server.linkworks(req, res);
  });

  it('PUT should return bad request when missing a target', done => {
    const validateError = msg => {
      should(msg).eql('error: no redirection target specified');
      res.expect.status.called.withArg(400);
      done();
    };
    res.setup.send.toDoThis(validateError);
    let req = {
      method: 'PUT',
      path: '/some/url',
      query: {}
    };
    server.linkworks(req, res);
  });
});
