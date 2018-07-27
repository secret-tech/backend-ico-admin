import config from '../src/config';

import { container } from '../src/ioc.container';
import { cleanUpMetadata } from 'inversify-express-utils';
const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures({
  dir: 'test/fixtures/ico-dashboard'
});

before(function(done) {
  fixtures
    .connect('mongodb://mongo:27017/backend-ico-admin-test')
    .then(() => fixtures.unload())
    .then(() => fixtures.load())
    .catch(e => console.error(e))
    .finally(() => {
      done();
    });
});

after(function(done) {
  fixtures
    .unload()
    .catch(e => console.error(e))
    .finally(() => {
      fixtures.disconnect();
      done();
    });
});

beforeEach(function(done) {
  cleanUpMetadata();
  container.snapshot();
  done();
});

afterEach(function() {
  container.restore();
});
