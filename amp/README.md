# Mobify AMP SDK Scaffold
```
      ╓Æ▒▓▓▓▓▓▀ Æ╖      
   ╓▒▓▓▓▓▓▓▓▓▀ ║▓▓▓▓╖   
  ▒▓▓▓▓▓▓▓▓▓^  ▓▓▓▓▓▓▓    ___  ___      _     _  __            ___  ___  _________
 ▓▓▓▓▓▓▓▓▓▀   ╣▓▓▓▓▓▓▓▓   |  \/  |     | |   (_)/ _|          / _ \ |  \/  || ___ \
║▓▓▓▓▓▓▓▓▀    ^^▀▓▓▓▓▓▓▓  | .  . | ___ | |__  _| |_ _   _    / /_\ \| .  . || |_/ /
▓▓▓▓▓▓▓▓`      ╓▓▓▓▓▓▓▓▓  | |\/| |/ _ \| '_ \| |  _| | | |   |  _  || |\/| ||  __/
▐▓▓▓▓▓▓▓▒▒    ╣▓▓▓▓▓▓▓▓▌  | |  | | (_) | |_) | | | | |_| |   | | | || |  | || |    
 ▀▓▓▓▓▓▓▓▌  ,▓▓▓▓▓▓▓▓▓▓   \_|  |_/\___/|_.__/|_|_|  \__, |   \_| |_/\_|  |_/\_|    
  ▀▓▓▓▓▓▓  ╓▓▓▓▓▓▓▓▓▓▀                               __/ |                         
    ╙▓▓▓▌ ▒▓▓▓▓▓▓▓▓▀                                |___/                          
       ` ▀▀▀▀▀▀▀"       
```

Create and maintain valid [Accelerated Mobile Pages](ampproject.org) pages for your site.

Owned by the AMP Team @ Mobify.


## Setup

`npm install`


## Run

Start the development server with `npm start` and go to http://localhost:3000.


## Test

Run `npm run test:all` for all linters and tests.


## End-to-end tests

While the development server is running, `npm run test:e2e` to run the automated end-to-end tests.


## Deploy

Build a local bundle payload: `npm run build`

Push that bundle to Mobify Cloud: `npm run bundles -- push ./build/<bundle-id-from-above-command>.zip --message "My AMP bundle message"`

Go to your project on [cloud](https://cloud.mobify.com/) and select AMP bundles to see the list of bundles, then publish the bundle you like to see on staging. The default environment is staging, in order to see the changes on production, change the environment to production and publish the bundle there.


## Debugging (in VSCode)

This project includes built-in configurations for VSCode debugging that can be used to launch and debug the server side AMP render, all within VSCode.

To do this:

* Open VSCode
* Add a `debugger` to any container or component, like the product details container
* In VSCode's Debug menu, click Start Debugging
* It may ask you to select a configuration. Choose `Launch AMP with Debugger`
* AMP will start up within the console in VSCode
* Navigate to the page for that container in your browser
* You'll hit a break point in your editor

You may need to stop the debugger multiple times to actually stop the AMP code from running. This is likely due to the debuggers attaching to both the parent and spawned process.

**Note**: There's currently an issue with reading the source maps, so breakpoints that you add within VSCode won't work. However, debugger statements that you put in the code will. There is some documentation on how to fix the source map issue (https://github.com/Microsoft/vscode-chrome-debug#sourcemaps) but that didn't seem to be working.


## SFCC Connector

Switch `package.json`'s `siteUrl` to `https://mobify-tech-prtnr-na03-dw.demandware.net`

Update `app/data-integration/connectedStore.js` to `import {initConnector}` from `'./connectors/sfcc-connector'`

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md)
