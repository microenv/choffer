---
id: introduction
title: Introduction
---

Choffer was made to create blazing fast REST APIs.

It's built on top of Express and other technologies described below.

## Motivation

It should be fast and easy to create a Rest API with a simple CRUD. If you are making microservices or a project MVP, then Choffer can help you to be very fast and create an scalable Rest API.

## Choffer's Dependencies

We added this dependencies to make your life easier.

- <a href="https://github.com/expressjs/express" target="_blank">Express</a> to serve the application.
- <a href="https://github.com/sideway/joi" target="_blank">Joi</a> to validate payloads, headers, querystring, and more.
- <a href="https://github.com/axios/axios" target="_blank">Axios</a> for making HTTP requests and HTTP proxies.
- <a href="https://github.com/lodash/lodash" target="_blank">Lodash</a> for lots of great utils.

### Database Optional Dependencies

If you want to connect to one or more databases, you need to install this dependencies by yourself and pass the connection object to Choffer.

- <a href="" target="_blank">Knex</a> for connecting with relational databases.
- <a href="" target="_blank">Mongodb</a> for connecting with MongoDB.
