const restore = require('mongodb-restore');
import { container } from '../src/ioc.container';

beforeEach(function(done) {
  container.snapshot();

  restore({
    uri: 'mongodb://mongo:27017/backend-ico-admin-test',
    root: __dirname + '/dump/backend-ico-admin-test',
    drop: true,
    callback: function() {
      done();
    }
  });
});

afterEach(function() {
  container.restore();
});
