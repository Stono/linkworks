'use strict';
const Datastore = require('@google-cloud/datastore');
const ds = new Datastore({});

module.exports = function Store(kind) {
  let self = {};

  self.get = function(id, done) {
    const key = ds.key([kind, id]);
    ds.get(key, (err, entity) => {
      if (!err && !entity) {
        err = {
          code: 404,
          message: 'Not found'
        };
      }
      if (err) {
        return done(err);
      }
      done(null, entity.value);
    });
  };

  self.set = function(id, value, done) {
    const key = ds.key([kind, id]);

    const data = [{ name: 'value', value: value}];
    const entity = {
      key: key,
      data: data
    };

    ds.save(entity, err => {
      if(err) { return done(err); }
      done(null, entity);
    });
  };
  return Object.freeze(self);
};
