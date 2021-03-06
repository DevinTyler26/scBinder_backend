# [Deployed Application](http://scbinder.us-west-2.elasticbeanstalk.com/)

- To login:
  - Username: testAdmin or testUser
  - Password: 123456

## Introduction

This project is the backend of the scheduling binder, an imaginary app that a call center can use to look up providers/doctors/nurses that work at a medical clinic.

This is the implementation of scb in Node.js.

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Populate the Database

    node seed.js

### Run the Tests

You're almost done! Run the tests to make sure everything is working:

    npm test

All tests should pass.

### Start the Server

    node index.js

This will launch the Node server on port 3900. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3900/api/providers

You should see the list of locations. That confirms that you have set up everything successfully.

### (Optional) Environment Variables

If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project. For a production scenario, you should store this key as an environment variable.

On Mac:

    export scb_jwtPrivateKey=yourSecureKey

On Windows:

    set scb_jwtPrivateKey=yourSecureKey
