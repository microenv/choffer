---
id: install
title: Install Instructions
sidebar_label: Install Instructions
---

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
yarn add choffer
```

Create a start script on your `package.json`:

```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

## Enable File Watching

So every time you save a file, your `node src/index.js` is restarted on the terminal.

> Optional step

Install nodemon

```shell
yarn add -D nodemon
```

Update your start script on `package.json`:

```json
{
  "scripts": {
    "start": "nodemon src/index.js"
  }
}
```

- The "main" attribute is used in choffer as the entrypoint of your application.
- The start and build scripts use choffer for managing the application.
