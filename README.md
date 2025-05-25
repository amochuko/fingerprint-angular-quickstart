# Fingerprint Angular Quickstart: Overview

In this quickstart, you’ll add Fingerprint to a new Angular (Server Side Rendering) project and identify the user’s device.

The example use case is new account fraud, where attackers create multiple fake accounts to abuse promotions, exploit systems, or evade bans. However, the steps you’ll follow apply to most front‑end use cases. By identifying the device behind each sign‑up attempt, you can flag and block suspicious users early.

This guide is a minimal full integration (front‑end and Backend) made possible with Angular V^19 with enabled Server Side Rendering which powered by ExpressJs V^4.

You’ll install the [Fingerprint Angular SDK](https://dev.fingerprint.com/docs/angular), initialize the plugin to generate a request ID, and send that ID to your back end for analysis.

> Estimated time: < 10 minutes

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Building

To build the project run:

```bash
npm build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

```bash
npm test
```

## Additional Resources

For more information on using Fingerprint device intelligence, including detailed references, visit the [Fingerprint](https://dev.fingerprint.com/) website.
