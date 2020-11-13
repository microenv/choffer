# Choffer

Create powerful REST APIs with simplicity.

## Install Instructions

> NOTE: This instructions uses yarn, but you can use npm if you want.

Create a new project

```shell
mkdir myproject
cd myproject

yarn init
```

Install the package

```shell
yarn add @microenv/choffer
```

Review your `package.json` file:

```json
{
  "main": "src/index.js",
  "scripts": {
    "start": "choffer start",
    "build": "choffer build"
  }
}
```

- The "main" attribute is used in choffer as the entrypoint of your application.
- The start and build scripts use choffer for managing the application.

## Getting Started

In this example we gonna build a TODO App with a mongodb database. Because of this you need to install the mongodb driver `npm install --save mongodb`.

For more information about databases, visit [@TODO - ConnectDatabase docs]().

src/index.js

```javascript
import Choffer from "@microenv/choffer";

Choffer.LoadEnv([".env", ".env.local"], {
  PORT: 3005,
});

Choffer.ConnectDatabases({
  "my-mongo": {
    driver: "mongodb",
    options: {
      connectionString: "mongodb://my-mongo",
    },
    errors: {
      connection_failed: "Could not connect to MongoDB!",
    },
  },
  "my-maria": {
    driver: "mariadb",
    options: {
      host: "localhost",
      port: 3306,
      user: "admin",
      password: "admin",
    },
    errors: {
      connection_failed: "Não foi possível se conectar ao mariadb!",
    },
  },
});

Choffer.StartRestGateway({
  config: {
    port: process.env.PORT,
  },
  services: [require("./services/todos")],
  middlewares: [
    Choffer.Middlewares.ValidateHeader({
      name: "client_id",
      schema: Choffer.Joi.string().alphanum().required(),
    }),
  ],
});
```

src/services/todos/index.js

```javascript
import Choffer from "@microenv/choffer";
import LibTodos from "./some-lib-you-made";
import { ObjectId } from "mongodb";

const { ValidateRequest } = Choffer.Middlewares;
const { UnknownError, NotFoundError } = Choffer.Errors;
const { Joi } = Choffer.Joi;

const dbName = "my-mongo";
const dbCollection = "todos";

const service = Choffer.RestService({
  name: "todos",
  description: "CRUD service for todos",
  prefix: "/v1/todos",
  middlewares: [],
});

service.addEndpoint({
  name: "search",
  description: "List Todos",
  method: "GET",
  uri: "/",
  middlewares: [
    ValidateRequest(
      "query",
      Joi.object({
        title: Joi.string(),
        done: Joi.boolean(),
      })
    ),
  ],
  async handler(req, res) {
    const collection = Choffer.Database(dbName).collection(dbCollection);

    const { title, done } = req.query;

    // Query Filters
    const where = {};
    if (title) where.title = new RegExp(title, "i");
    if (done) where.done = done;

    // Sort
    const options = {
      sort: { createdAt: 1 }, // 0:desc - 1:asc
    };

    const todos = await collection.find(where, options).toArray();
    res.json(todos);
  },
});

service.addEndpoint({
  name: "create",
  description: "Create a Todo",
  method: "POST",
  uri: "/",
  middlewares: [
    ValidateRequest(
      "body",
      Joi.object({
        title: Joi.string().min(3).max(30).required(),
      })
    ),
  ],
  async handler(req, res) {
    const collection = Choffer.Database(dbName).collection(dbCollection);

    const result = await collection.insertOne(req.body);

    if (!result || !result.insertedId) {
      throw new UnknownError(
        "Could not insert todo because of a unknown error!"
      );
    }

    res.status(201).json({
      insertedId: result.insertedId,
    });
  },
});

service.addEndpoint({
  name: "update-done",
  description: "Update todo.done",
  method: "PUT",
  uri: "/:id",
  middlewares: [
    ValidateRequest(
      "params",
      Joi.object({
        done: Joi.boolean().required(),
      })
    ),
  ],
  async handler(req, res) {
    const collection = Choffer.Database(dbName).collection(dbCollection);

    const where = { _id: ObjectId(req.params.id) };
    const updateDoc = { $set: { done: req.body.done } };
    const result = await collection.updateOne(where, updateDoc);

    if (!result || !result.modifiedCount) {
      throw new UnknownError(
        "Could not insert todo because of a unknown error!"
      );
    }

    res.json({
      modifiedCount: result.modifiedCount,
    });
  },
});

service.addEndpoint({
  name: "delete",
  description: "Delete a Todo",
  method: "DELETE",
  uri: "/:id",
  middlewares: [],
  async handler(req, res) {
    const collection = Choffer.Database(dbName).collection(dbCollection);

    const where = { _id: ObjectId(req.params.id) };
    const result = await collection.deleteOne(where);

    if (!result || !result.deletedCount) {
      throw new NotFoundError("Todo not found");
    }

    res.json({
      deletedCount: result.deletedCount,
    });
  },
});

export default service;
```
