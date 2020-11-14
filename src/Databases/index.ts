import * as _ from 'lodash';
import ServerError from '../Errors/ServerError';

export enum ChofferDatabaseDriver {
  knex = 'knex',
}

export type ChofferDatabaseConfig = {
  name: string;
  driver: ChofferDatabaseDriver;
  connection: any;
};

type DatabasesMap = {
  [dbName: string]: ChofferDatabaseConfig;
}

class Databases {
  databases: DatabasesMap = {};

  Database = (name: string = 'default') => {
    const db = this.databases[name] ? this.databases[name].connection : false;
    if (!db) {
      throw new ServerError(`Database "${name}" not found!`);
    }
    return db;
  }

  RegisterDatabase = (dbConfig: ChofferDatabaseConfig) => {
    if (dbConfig.driver === ChofferDatabaseDriver.knex) {
      // const knex = require('knex')(dbConfig.options);
      this.databases[dbConfig.name] = dbConfig;
    }
  }
}

export default new Databases();
