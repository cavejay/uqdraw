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

Running the unit tests
`$ npm test`

## Example application
At the time this guide was written an example of the application was available at `uqdraw.co`. This may not be the case when you read this.

