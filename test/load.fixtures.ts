import { container } from '../src/ioc.container';
import { cleanUpMetadata } from 'inversify-express-utils';
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures({
  dir: 'test/fixtures/ico-dashboard',
  mute: true
});

before(function(done) {
  fixtures.connect('mongodb://mongo:27017/backend-ico-admin-test')
    .finally(() => {
      done();
    });
});

after(function() {
  fixtures.disconnect();
});

beforeEach(function(done) {
  cleanUpMetadata();
  container.snapshot();
  fixtures
    .load()
    .finally(() => {
      done();
    });
});

afterEach(function(done) {
  container.restore();
  fixtures
    .unload()
    .finally(() => {
      done();
    });
});
