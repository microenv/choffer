---
id: hello-world
title: Your First REST API
sidebar_label: Hello World
---

Before creating your Hello World API, please refer to install instructions.

[See Install Instructions](install)

> The source code from this Hello World tutorial is at GitHub.
>
> [See this Hello World at Github]()

## Create the API Gateway

Firstly we will create the main file of our application, the file specified in `npm start` script.

**src/index.js**

```javascript
const Choffer = require("choffer");
const HelloService = require("./services/hello");
const TodosService = require("./services/todos");

Choffer.StartRestGateway({
  config: {
    port: process.env.PORT || 8080,
  },
  services: [TodosService],
});
```

This will create an express app and start listening in the port you specified.

## Create the Hello Service

**src/services/hello.js**

```javascript
const Choffer = require("choffer");

// Create the service
const service = Choffer.RestService({
  name: "hello",
  description: "Hello World Service",
  prefix: "/",
});

// @GET /
service.addEndpoint({
  name: "home",
  description: "Hello Endpoint",
  method: "GET",
  uri: "/:name?",
  async handler(req, res) {
    res.json({
      hello: req.params.name || "world",
    });
  },
});
```

## Create a Mocked CRUD Service

**src/services/todos.js**

```javascript
const Choffer = require("choffer");

// Mock data
const genId = 1;

const todos = [
  { id: genId++, title: "Install Choffer", done: true },
  { id: genId++, title: "Create an API Gateway", done: true },
  { id: genId++, title: "Create a Service", done: false },
];

// Create the service
const service = Choffer.RestService({
  name: "todos",
  description: "Todos Service",
  prefix: "/todos",
});

// @GET /todos
service.addEndpoint({
  name: "list-todos",
  description: "List Todos",
  method: "GET",
  uri: "/",
  async handler(req, res) {
    res.json(todos);
  },
});

// @POST /todos
service.addEndpoint({
  name: "create-todo",
  description: "Create a Todo",
  method: "POST",
  uri: "/",
  middlewares: [
    // Ensure that body have only a title field
    // Every other fields in req.body will be lost
    // If the body has any validation errors,
    // automatticaly throws an error and don't call handler
    Choffer.Rest.Middlewares.ValidateRequest(
      "body",
      Choffer.Joi.object({
        title: Choffer.Joi.string().min(3).max(30).required(),
      })
    ),
  ],
  async handler(req, res) {
    // req.body = { "title": "*" }
    todos.push({
      id: genId++,
      title: req.body.title,
      done: false,
    });
  },
});

// @PUT /todos/:todoId
service.addEndpoint({
  name: "update-todo",
  description: "Update a Todo",
  method: "PUT",
  uri: "/:todoId",
  middlewares: [
    // Validate request body
    // Note that the none of the fields is .required()
    // This means that if the req.body is empty, the validation
    // will still pass
    Choffer.Rest.Middlewares.ValidateRequest(
      "body",
      Choffer.Joi.object({
        title: Choffer.Joi.string().min(3).max(30),
        done: Choffer.Joi.boolean(),
      })
    ),
  ],
  async handler(req, res) {
    const todoIdx = todos.findIndex((t) => String(t.id) === req.params.todoId);

    // Throw a 400 Bad Request
    // if todo is not found in database
    if (todoIdx === -1) Choffer.throw(400, "Todo not found");

    // Update only the fields that are not undefined
    if (typeof req.body.title !== "undefined") todo.title = req.body.title;
    if (typeof req.body.done !== "undefined") todo.done = req.body.done;

    res.json(todo);
  },
});

// @DELETE /todos/:todoId
service.addEndpoint({
  name: "delete-todo",
  description: "Delete a Todo",
  method: "DELETE",
  uri: "/:todoId",
  async handler(req, res) {
    const todoIdx = todos.findIndex((t) => String(t.id) === req.params.todoId);
    if (todoIdx === -1) Choffer.throw(404, "Todo not found");
    todos.splice(todoIdx, 1);
    res.json({ success: true });
  },
});

module.exports = service;
```

## Run Your Project

Finally, start your application. In case you followed our [Install Instructions](./install) you should have a start script

```shell
yarn start
```

## Open in the Browser

Visit <a href="http://localhost:8080/todos" target="_blank">http://localhost:8080/todos</a>
