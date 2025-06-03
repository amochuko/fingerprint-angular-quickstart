# Fingerprint Angular Quickstart: Overview

In this quickstart, you’ll add Fingerprint to a new Angular v9 project and identify the user’s device.

The example use case is new account fraud, where attackers create multiple fake accounts to abuse promotions, exploit systems, or evade bans. However, the steps you’ll follow apply to most front‑end use cases. By identifying the device behind each sign‑up attempt, you can flag and block suspicious users early.

You’ll install the [Fingerprint Angular SDK](https://dev.fingerprint.com/docs/angular), initialize the plugin to generate a request ID, and send that `requesId` to your back end for analysis.

> Estimated time: < 10 minutes

## Prerequisites

Before you begin, make sure you have the following:

- [**Node.js**](https://nodejs.org/) (v20 or later) and npm installed
- Your favorite code editor
- Basic knowledge of [**Angular**](https://angular.dev/tutorials/learn-angular) and JavaScript/Typescript

> *Note: This quickstart covers more of the front-end setup. To enable fraud detection, you'll need a [back-end server](https://dev.fingerprint.com/reference/server-sdks) to receive and process the device identification event.
> 

## 1. Create a Fingerprint account and get your API key

1. [Sign up](https://dashboard.fingerprint.com/signup) for a free Fingerprint trial if you don’t already have an account
2. After signing in, go to the [API keys](https://dashboard.fingerprint.com/api-keys) page in the dashboard
3. Copy your **public API key**, as you’ll need this to initialize the Fingerprint client agent


## 2. Set up your Angular project

To get started, create a new project (client side). If you already have a project you want to use, you can skip to the next section.

### Install Angular CLI

1. Run in your terminal:

```bash
npm install -g @angular/cli
```

### Create a new project 
```bash
ng new fingerprint-angular-quickstart
```

You will be presented with some configuration options for your project. Use the arrow and enter keys to navigate and select which options you desire.
*Important: When prompted with `Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)?`, select No.
 
If you don't have any preferences, just hit the enter key to take the default options and continue with the setup.

After you select the configuration options and the CLI runs through the setup, you should see the following message:
```bash
✔ Packages installed successfully.
 Successfully initialized git.
```

2. Change into the project folder:

```bash
cd fingerprint-angular-quickstart
```

3. Development server

Open the `fingerprint-angular-quickstart` folder in your code editor and you’re ready to go! To run your project run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## 3. Set up your account creation form
   
1. Before hooking up Fingerprint, create a new component at `src/app/create-account-form/create-account-form.component.ts` with the following: 
 
```javascript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-account-form',
  imports: [FormsModule],
  template: `<div class="wrapper">
    <h1>Create an account</h1>

    <div class="input-group">
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        [(ngModel)]="username"
        required
      />
    </div>
    <div class="input-group">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        [(ngModel)]="password"
        required
      />
    </div>
    <button [disabled]="isLoading" type="submit" (click)="handleSubmit()">
      {{ isLoading ? 'Loading...' : 'Create Account' }}
    </button>
  </div>`,
  styles: `
.wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 200px;
}

.input-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
}

input[type="text"],
input[type="password"] {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

input:focus {
    border-color: #007bff;
    outline: none;
}

button[type="submit"] {
    width: 200px;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    background-color: #e36132;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button[type="submit"]:hover:not(:disabled) {
    background-color: #e3531f;
}

button[type="submit"]:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
`,
})
export class CreateAccountFormComponent {}
```

1. Import and add the component to your `App` in `src/app/app.ts`:
   
```javascript

// ... other imports here
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';

@Component({
  selector: 'app-root',
  imports: [CreateAccountFormComponent],
  template: `<main class="main">
              <app-create-account-form />
            </main>`,
})
export class App {}
```

## 4. Install and initialize the Fingerprint SDK
1. To integrate Fingerprint into your Angular app, first add the SDK via npm:

```bash
npm install @fingerprintjs/fingerprintjs-pro-angular
```

> *Note: Since Angular v19 no longer uses NgModule-based structure, and the current Fingerprint SDK was built for earlier versions, we’ll create a helper function to export the necessary method..
>

2. For that reason, we'll create a `src/app/utils/fingerprint.provider.ts` file with the following code:

```javascript
import { EnvironmentProviders, Provider } from '@angular/core';
import {
  FingerprintjsProAngularModule,
  FpjsClientOptions,
} from '@fingerprintjs/fingerprintjs-pro-angular';

export function provideFingerprintPro(
  clientOptions: FpjsClientOptions
): Provider | EnvironmentProviders {
  const moduleWithProvider =
    FingerprintjsProAngularModule.forRoot(clientOptions);

  return moduleWithProvider.providers as Provider | EnvironmentProviders;
}
```

3. Now that we have `provideFingerprintPro`, import and initialize it in your app config entry point. Open `src/app/app.config.ts` and add the Fingerprint provider `provideFingerprintPro` function into the `providers` array of the config option:   

```javascript
// ... other imports here
import { FINGERPRINT_API_KEY_PUBLIC } from './utils/env';
import { provideFingerprintPro } from './utils/fingerprint.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...other config options 
    provideFingerprintPro({
      loadOptions: {
        apiKey: '<your-public-api-key>',
        region: 'eu',
        // Ensure this matches your workspace region
        // For more information, see https://dev.fingerprint.com/docs/regions
      },
    }),
  ],
};
```

4. Replace `<your-public-api-key>` with your actual public API key from the [Fingerprint dashboard](https://dashboard.fingerprint.com/api-keys).

 
## 5. Trigger visitor identification

Now that the Fingerprint client is initialized, you can identify the visitor only when needed. In this case, that’s when the user taps/clicks the “Create Account” button.

When making the visitor identification request, you will receive the `visitorId` as well as a `requestId`. Instead of using the `visitorId` returned directly on the frontend (which could be tampered with), you’ll send the `requestId` to your backend. 

This ID is unique to each identification event. Your server can then use the [Fingerprint Events API](https://dev.fingerprint.com/reference/server-api-get-event) and retrieve the complete identification data, including the trusted visitor ID and other actionable insights like whether they are using a VPN or are a bot.

1. Within the empty `CreateAccountFormComponent` class in `create-account-form.component.ts`, declare username and password as property with empty string as initial value to track your form inputs. Also import the FingerprintjsProAngularServicec:

```javascript
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';

// ... rest of component here
export class CreateAccountFormComponent {
  isLoading = false;

  username = '';
  password = '';
}

```
2. Configure the Fingerprint service by passing it into the `CreateAccountFormComponent` class `constructor`.  This automatically initializes it via `Dependency Injection`

```javascript
// create-account-form.component.ts

export class CreateAccountFormComponent {
 // ... other properties here

  constructor(private fingerprintService: FingerprintjsProAngularService) {}
}

```
3. Define the submit handler to trigger identification when the user clicks “Create Account”:

```javascript
// create-account-form.component.ts

 async handleSubmit() {
    this.isLoading = true;

    try {
      const data = await this.fingerprintService.getVisitorData();

      console.log(`
        Visitor ID: ${data.visitorId}
        Request ID: ${data.requestId}`);

      // Send the requestId to your server
      // await fetch("/api/create-account", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     username: this.username,
      //     password: this.password,
      //     requestId,
      //   }),
      // });

    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      this.isLoading = false;
    }
  }

```
In this function:

- `this.isLoading = true` is used to monitor the process stage for the function call.
- `const data = await this.fingerprintService.getVisitorData();` — This triggers Fingerprint's device identification and returns a `data` object containing the visitor’s `visitorId` and `requestId`, which you can then send to your back end along with the username and password.
 
## 6. Test the app 
  1. If your dev server isn’t already running, start it with:

```bash
npm start
```

1. In your browser, go to http://localhost:4200 (Angular’s default).
2. If you have any ad blockers, turn them off for localhost. View our [documentation](https://dev.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) to learn how to protect your Fingerprint implementation from ad blockers in production.
3. Enter a username and password, then click **Create Account**.
4. You will be redirected to a success page
5. Open the developer console in your browser and you should see the visitor ID and request ID in the output:

```javascript

Visitor ID: kLmvO1y70BHKyTgoNoPq
Request ID: 9171022083823.zox1GS

```

## **Next steps**
To complete the fraud detection workflow, send the requestId to your backend after account creation. The backend should then call the [Fingerprint Events API](https://dev.fingerprint.com/reference/server-api-get-event) using the requestId to retrieve full visitor details and make decisions like blocking suspicious users to prevent fraud or enforcing additional checks.

## Additional Resources

For more information on using Fingerprint device intelligence, including detailed references, visit the [Fingerprint](https://dev.fingerprint.com/) website.
