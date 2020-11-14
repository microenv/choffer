import Joi from "joi";
import Axios from "axios";
import Errors from "./Errors";
import * as Rest from "./Rest";
import StartRestGateway from "./Rest/StartRestGateway";
import RestService from "./Rest/RestService";
import HttpProxyService from "./Rest/HttpProxyService";
import Databases from './Databases';

export { default as Joi } from 'joi';
export { default as Axios } from 'axios';
export { default as Errors } from './Errors';
export * as Rest from './Rest';
export { default as StartRestGateway } from "./Rest/StartRestGateway";
export { default as RestService } from "./Rest/RestService";
export { default as HttpProxyService } from "./Rest/HttpProxyService";

export const { RegisterDatabase, Database } = Databases;

export interface Choffer {
  Joi: typeof Joi;
  Axios: typeof Axios;
  Errors: typeof Errors;
  Rest: typeof Rest;
  StartRestGateway: typeof StartRestGateway;
  RestService: typeof RestService;
  HttpProxyService: typeof HttpProxyService;
  RegisterDatabase: typeof RegisterDatabase;
  Database: typeof Database;
}

const choffer: Choffer = {
  Joi,
  Axios,
  Errors,
  Rest,
  StartRestGateway,
  RestService,
  HttpProxyService,
  RegisterDatabase,
  Database,
}

export default choffer;
