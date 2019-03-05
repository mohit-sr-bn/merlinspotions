# Mobify Progressive Web Scaffold

The quick start guide for using the scaffold can be found [here](https://docs.mobify.com/progressive-web/latest/getting-started/quick-start/)

## Running npm scripts

All the `npm` scripts listed below must be run from the `web` directory inside your project directory.

Here's how to get a list of all the available npm scripts in the Progressive Web Scaffold:

```
npm run
```

## Setup

```
npm install
npm start
```

## Deploying Bundle to Mobify Cloud

If you will be deploying bundles to Mobify Cloud, then follow these steps to authorize your computer:
- Go to [https://cloud.mobify.com/account/](https://cloud.mobify.com/account/) and find your API key.
- Run the following command in your terminal:
```
npm run save-credentials -- -u <myEmail@organization.com> -k <myAPIkey>
```
- You're now ready to deploy bundles! To deploy bundles you run the following command:
```
npm run push -- -m "Test push by <name>"
```

## 🔒 Avoiding HTTPS errors in local development

The development server uses a self-signed SSL certificate. This is totally valid, but
the self-signed certificate must be added to your operating system to be trusted.

### macOS

To add the certificate to the Mac system trust store:

1. Open https://localhost:8443. *You should see a security warning.* ⚠️
2. Open your terminal and go to the `web` directory inside your project directory.
3. Run `open dev-server/localhost.pem`. *The `Keychain Access` app will open.*
4. Add the certificate to your `login` Keychain.
5. In `Keychain Access`, search for `Mobify Development Server`.
6. Right click it and select `Get Info`.
7. Expand the `Trust` section.
8. Set `Secure Socket Layer (SSL)` to `Always Trust`.
9. Close the info window. *You will need to enter your password.*
10. Close your browser.
11. Open https://localhost:8443 in your browser. *The security warning should be gone!* 🎉

### Windows

To add the certificate to the Windows Trusted Root Certificate Store:

1.  Open https://localhost:8443. *You should see a security warning.* ⚠️
2.  Start Menu → Run `mmc.exe`.
3.  File → Add/Remove Snap-in.
4.  Select "Certificates" and click Add.
5.  Select "Computer Account" and click Next.
6.  Select "Local Computer" and click Finish.
7.  Click OK to close the Add or Remove Snap-Ins dialog.
8.  Expand the Certificates node and right-click on the Trusted Root Certification Authorities node.
9.  Select All Tasks → Import.
10.  Import the `localhost.p7b` file in `web\dev-server\`. *Leave all other settings as is while importing.*
11. After clicking Finish, you should get an alert saying "The import was successful."
12. Exit the window. *You do not need to save the console settings, so click No when prompted.*
13. Close your browser.
14. Open https://localhost:8443 in your browser. *The security warning should be gone!* 🎉

## Adding a page (container)

```
npm run add:page
```

## Adding a component

```
npm run add:component
```

## Using the notification system

The scaffold comes with a system to notify users with messages that drop down
from the header, and can be dismissed. To make your own, add the following code
to the actions file of your component in the desired action. Example:

```
dispatch(addNotification({
    content: 'The notification message.',
    id: 'uniqueIdForTheNotification',
    showRemoveButton: true
}))
```

## SVG Images and Icons

The SVG directory can be found in `app/static/svg/`. There are three purposes for this directory:

1. Store any **static SVG images**
    * These are stored in the `app/static/svg/` directory's root. These files are ignored by the SVG optimization task (for now).
2. Store **icon source files**
    * These are stored in the `app/static/svg/sprite-source/` directory and are the targets for the SVG optimization and Sprite building tasks.
3. Store the **generated icon sprite**
    * This is stored in the `app/static/svg/sprite-dist` directory as the destination for the generated icon sprite.

When adding, removing or modifying SVG icons, it is up to the developer to run the following command to generate the new SVG sprite sheet and commit the change.

```
npm run build-sprites
```

Icon sprites are a technique for creating easy to use icons. [Learn more here](https://medium.com/@webprolific/why-and-how-i-m-using-svg-over-fonts-for-icons-7241dab890f0#.1v9l7c7q2) about the technique and why we use it over icon fonts.

## Linting

This project comes with a linter setup using `eslint`,
`eslint-plugin-react`, `eslint-plugin-import`, and
`eslint-plugin-jsx-a11y`. By default, it uses the Mobify code style
(https://www.github.com/mobify/mobify-code-style). Run the linter
using:

```
npm run lint
```

If this code style is a poor match for your pre-existing practices,
there are two ways you can modify the linter configuration to suit
your use case better. For small changes, you can add rules to the
[`.eslintrc.yml`](./.eslintrc.yml) file in the `web` directory inside your project directory.
Rules specified in this file override rules in the Mobify standard;
the following `rules` section adds an additional rule and disables an existing rule:

```yaml
rules:
  react/react-in-js-scope: error
  camelcase: off
```

For larger differences from the Mobify code style, you can replace the
Mobify config with a different configuration base. This involves
editing the `extends` section in [`.eslintrc.yml`](./.eslintrc.yml). For example, if you
use the Airbnb style guide, replace the contents of [`.eslintrc.yml`](./.eslintrc.yml)
with:

```yaml
extends:
  - airbnb
```

These methods can be combined to use a different standard with minor
local variations.

## Tests

To run the full test suite, you can use:

```
npm run test:all
```

To run tests in watch mode and only run test related to files you modify during development, use:

```
npm run test:watch
```

## Automated end-to-end tests

### Using Chrome Device Mode

To verify that changes do not break the guest and registered checkout flows:

Run `npm start` in another tab, then:

```
// Run all end-to-end tests for Merlin's
npm run test:e2e

// Run all end-to-end tests for Hybris (change connectors separately)
npm run test:e2e -- --tag hybris --group workflows/hybris

// Run only one test
npm run test:e2e --test tests/e2e/workflows/merlins/home-example.js

// Run end-to-end tests on the production environment
npm run test:e2e-prod

// If a test has failed and you would like to debug a single test:
npm run test:e2e-debug --test test/e2e/workflows/guest-checkout.js
```

To run both starting the server and e2e:
```
npm run smoke-test
```
### Running GoogleBot Locally
Download [Chrome 41](https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Mac%2F310958%2Fchrome-mac.zip?generation=1420865266525000&alt=media) (This is the Mac Version).

Download [Chromedriver 2.14](https://chromedriver.storage.googleapis.com/index.html?path=2.14/).

Unzip both and leave them in your downloads folder.

In `nightwatch-config.js` - in the `chrome_googlebot:`, make the following changes:
```
cli_args: 
    'webdriver.chrome.driver': `${process.env.home}/Downloads/chromedriver2.14`
...
chromeOptions: 
    'binary': `${process.env.HOME}/Downloads/chrome-mac/Chromium.app/Contents/MacOS/Chromium/`
```

Run via: `npm run test:e2e -- -e chrome_googlebot --test tests/e2e/workflows/merlins/home-example.js`
### Using iOS Simulator
(Experimental)

1. `npm install -g appium`
1. [Change the default port that WebDriverAgent starts on to 8100](https://github.com/facebook/WebDriverAgent/issues/661#issuecomment-338900334)
1. Install the iOS 11.2 simulator via Xcode > Preferences > Simulators
1. `npm start` in another tab
1. Start the simulator, navigate to `https://localhost:8443/loader.js` to manually accept the SSL cert
1. Run `./scripts/appium.sh` in another tab
1. The iOS Simulator tests are configured to run under the safari environment. In another tab, `npm run test:e2e -- -e safari`

## Lighthouse tests

You can run [Lighthouse](https://github.com/GoogleChrome/lighthouse) test against production with:

```
npm run test:pwa-prod
```

When you develop it might be helpful to run the test against your local files. To run Lighthouse while previewing against the build (locally or on CI), assuming the server is already running:

```
npm run test:pwa-preview
```

## Analyze Bundle Size

Verify that gzipped bundle files are below a specified threshold to ensure you meet performance requirements.

Firstly, generate a build:

```
npm run prod:build
```

Then verify that the minified contents of the build directory are less than a specified maximum file size defined in `package.json`. For example, a maximum size of 2MB:
In `package.json`, configure the path and maxSize:

```
  "bundlesize": [
    {
      "path": "build/loader.js",
      "maxSize": "27 kB"
    },
    {
      "path": "build/main.css",
      "maxSize": "12 kB"
    }
  ],
```

Run this command:

```
npm run test:max-file-size
```

To visualize the sizes of your dependencies, run:

```
npm run analyze-build
```

For more information, see [Automated Testing Overview](https://docs.mobify.com/progressive-web/latest/guides/automated-testing/)
