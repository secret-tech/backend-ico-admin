import config from '../src/config';

const prepare = require('mocha-prepare');
import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';

import * as chai from 'chai';

chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));

prepare(function(done) {
  createConnection({
    type: 'mongodb',
    connectionTimeout: 1000,
    url: 'mongodb://mongo:27017/backend-ico-admin-test',
    synchronize: true,
    logging: true,
    useNewUrlParser: true,
    entities: config.typeOrm.entities,
    migrations: config.typeOrm.migrations,
    subscribers: config.typeOrm.subscribers
  } as ConnectionOptions).then(async connection => {
    done();
  });
});
