# PROTOTYPE VERISON

_This is only for archival purposes_

# UQDraw Prototype
This guide assumes you are familiar with modern web dev and will not cover configuring your system for web development. The getting started section assumes you are using OSX with node installed.

## Overview of Technology Used
UQDraw is a React application written in ES6 and JSX and transpiled using Babel. Styles are written in Sass. Webpack is used for app bundling as well as for the development server. NPM is the package manager and build tool. For testing we are using Jest.

The application interfaces with Firebase. You will need to setup your own Firebase and change the Firebase host in the config file.

## Getting started
Installing the dependencies
`$ npm install`

Running the dev server
`$ npm run start`
You can access the dev server at `http://localhost:9000`

Bundling the app
`$ npm run build`

Pushing the app online*
`$ npm run deploy`

Running the unit tests
`$ npm test`

**The live website can be found online at: **
 `http://artifex.uqcloud.net`.

 ### Other Notes

 *In order for `npm run deploy` to work ~/.ssh/config must be configured with a connection for moss.labs.eait.uq.edu.au. In order to pass bundle.js through to the Artifex zone moss is used as a stepping stone to enter the uq network. Currently a copy of bundle.js is left in the deployer's moss ~ directory.

If ~/.ssh/config does not exist use the following template

```
Host moss
Hostname moss.labs.eait.uq.edu.au
User <yourusername>
```
