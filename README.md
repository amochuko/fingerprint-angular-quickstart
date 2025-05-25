# Fingerprint Angular Quickstart: Overview

In this quickstart, you’ll add Fingerprint to a new Angular (Server Side Rendering) project and identify the user’s device.

The example use case is new account fraud, where attackers create multiple fake accounts to abuse promotions, exploit systems, or evade bans. However, the steps you’ll follow apply to most front‑end use cases. By identifying the device behind each sign‑up attempt, you can flag and block suspicious users early.

This guide is a minimal full integration (front‑end and backend) made possible with Angular V^19 with enabled Server Side Rendering which is powered by ExpressJs V^4.

You’ll install the [Fingerprint Angular SDK](https://dev.fingerprint.com/docs/angular), initialize the plugin to generate a request ID, and send that ID to your back end for analysis.

> Estimated time: < 10 minutes

## Prerequisites

Before you begin, make sure you have the following:

- [**Node.js**](https://nodejs.org/) (v20 or later) and npm installed
- Your favorite code editor
- Basic knowledge of [**Angular**](https://angular.dev/tutorials/learn-angular) and JavaScript/Typescript

> *Note: This quickstart covers more of the front-end setup with a little of backend. You’ll need a [back-end server](https://dev.fingerprint.com/reference/server-sdks) to receive and process the device identification event to enable fraud detectio*n. Links to back-end quickstarts are on the main quickstart page and at the end of this guide.
> 

## 1. Create a Fingerprint account and get your API key

1. [Sign up](https://dashboard.fingerprint.com/signup) for a free Fingerprint trial if you don’t already have an account
2. After signing in, go to the [API keys](https://dashboard.fingerprint.com/api-keys) page in the dashboard
3. Copy your **public API key**, as you’ll need this to initialize the Fingerprint client agent


## 2. Set up your Angular (SSR) project

To get started, create a new project. If you already have a project you want to use, you can skip to the next section.


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
*Important: Make sure you pick a `Yes` for Server-Side Rendering (SSR)
 
If you don't have any preferences, just hit the enter key to take the default options and continue with the setup.

After you select the configuration options and the CLI runs through the setup, you should see the following message:
```bash
✔ Packages installed successfully.
 Successfully initialized git.
```

1. Change into the project folder:

```bash
cd fingerprint-angular-quickstart
```


## Development server

To start a local development server, run:

1. Open the `fingerprint-angular-quickstart` folder in your code editor and you’re ready to go! To run your project run:


```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

```bash
npm test
```

## 3. Install and initialize the Fingerprint SDK
1. To integrate Fingerprint into your Angular app, first add the SDK via npm:

```bash
npm install @fingerprintjs/fingerprintjs-pro-angular
```

> *Note: Now that the SDK is installed, This quickstart use the Angular Version ^19 which no longer uses the `ngModule` app structure. Because the current version of `@fingerprintjs/fingerprintjs-pro-angular` was developer for the the old Angular version, we are going create a helper function which will export the method needed.
>

For that, we create a `src/app/utils/fingerprint.provider.ts` file with the following code:

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

1. Now that we have `provideFingerprintPro`, import and initialize it in your app config entry point. Open `src/app/app.config.ts` and add the Fingerprint provider `provideFingerprintPro` function into the `providers` array of the config option:   

```javascript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { FINGERPRINT_API_KEY_PUBLIC } from './utils/env';
import { provideFingerprintPro } from './utils/fingerprint.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideFingerprintPro({
      loadOptions: { apiKey: FINGERPRINT_API_KEY_PUBLIC },
    }),
  ],
};
```

## 3. Create an AccountService
1. Add a new AccountService with Angular cli command in the root directory of the project
   
```bash
 ng generate service services/account/account 
```
This will generate 2 files in the `services/account`
1. account.service.ts
2. account.service.spec.ts
 
 `services/account/account.service.ts`

 ```javascript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface RegisterArgs {
  requestId: string;
  formData: Partial<{ username: string | null; password: string | null }>;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _url = 'http://localhost:4200/api/register';

  constructor(private httpClient: HttpClient) {}

  async register(args: RegisterArgs): Promise<any> {
    try {
      return await firstValueFrom(this.httpClient.post(this._url, args));
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }
}

 ```

 This above `register()` method of the AccountService is what sends the form data to the backend server.

## 4. Set up your account creation form
   
1. create a new component with Angular cli command in the root root directory of your project.

```bash
ng generate component fingerprint --module app
```

This will generate 4 files in the fingerprint directory
1. fingerprint.component.ts
2. fingerprint.component.html
3. fingerprint.component.spec.ts
4. fingerprint.component.css


### app/fingerprint/fingerprint.component.html
```html
<div class="fingerprint container">
    <h1>Create an account</h1>
    <form (ngSubmit)="handleSubmit()" [formGroup]="registerForm">
        <div class="input-group">
            <label for="username">Username</label>
            <input id="username" type="text" placeholder="Username" formControlName="username" required />
            @if (username.invalid && (username.dirty || username.touched)) {
            <small class="error">
                Username is required.
            </small>
            }
        </div>
        <div class="input-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Password" formControlName="password" required />
            @if (password.errors?.['required'] && (password.dirty || password.touched)) {
            <small class="error">
                Password is required.
            </small>
            }

            @if (password.errors?.['minlength'] && (password.dirty || password.touched)) {
            <small class="error">
                Password is required.
            </small>
            <small class="error">
                Password must be at least 8 characters. </small> }
        </div>
        <button [disabled]="isLoading() || registerForm.invalid" type="submit">
            {{ isLoading() ? "In progess..." : "Create Account" }}
        </button>
    </form>

    @if (hasError()) {
    <div class="error">Registration failed. Please try again.</div>
    }
</div>

```

### app/fingerprint/fingerprint.component.ts
```javascript
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-fingerprint',
  imports: [ReactiveFormsModule],
  templateUrl: './fingerprint.component.html',
  styleUrl: './fingerprint.component.css',
})
export class FingerprintComponent {
  isLoading = signal(false);
  hasError = signal(false);

  get username() {
    return this.registerForm.get('username')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.min(8)]),
  });

  constructor(
    private accountService: AccountService,
    private fingerprintService: FingerprintjsProAngularService,
    private router: Router
  ) {}

  async handleSubmit() {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const data = await this.fingerprintService.getVisitorData();

      const res = await this.accountService.register({
        formData: this.registerForm.value,
        requestId: data.requestId,
      });

      // Redirect  on success
      this.router.navigate(['/success'], {
        state: {
          username: res.username,
          requestId: res.requestId,
        },
      });
    } catch (err) {
      console.error('Registration failed', err);
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}

```
In the above `fingerprint.component.ts`, we have the initailisation of the `FingerprintjsProAngularService` in the `constructor` method of `FingerprintComponent` via `Dependency Injection`

There also, we have imported and initialised the `AccountService` and called their respective methods inside the `FingerprintComponent.handleSubmit()` as follows:
1. `const data = await this.fingerprintService.getVisitorData()`; This is the method form `FingerprintjsProAngular` serivce that does all the finger printing work behind the scene. 
2. `this.accountService.register({})`: The account service that collects the finger print data and other form fields as requested in the `Register` form and send them to the backend server.

### app/fingerprint/fingerprint.component.css
This file contains the stylesheet for the component

### 4. Set backend server
When we generated the app earlier with Angular cli, we accepted to use Server Side Rendering, and thus Angular went ahead to set up an ExpressJs app inside of `src/server.ts`

With that, we have a production ready backend server which we will use to implement the backend.
The following code was added to `src/server.ts`

```javascript
// Activate middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/register', (req, res) => {
  // You can save the details into a database of your choice
  const { requestId, formData } = req.body;

  res.json({ requestId, username: formData.username });
});

```
> *Note: Remember to install `cors` dependency
```bash
npm i cors
```

What the above code does:
1. Firstly, activate middlewares
2. Add a `post` endpoint at `/api/register`  where the form data is submitted.

## 5. Trigger visitor identification

Now that the Fingerprint client is initialized, you can identify the visitor only when needed. In this case, that’s when the user taps/clicks the “Create Account” button.

When making the visitor identification request, you will receive the `visitorId` as well as a `requestId`. Instead of using the `visitorId` returned directly on the frontend (which could be tampered with), you’ll send the `requestId` to your backend. 

This ID is unique to each identification event. Your server can then use the [Fingerprint Events API](https://dev.fingerprint.com/reference/server-api-get-event) and retrieve the complete identification data, including the trusted visitor ID and other actionable insights like whether they are using a VPN or are a bot.

1. If your dev server isn’t already running, start it with:

```bash
npm start
```

1. In your browser, go to http://localhost:4200 (Angular’s default).
2. If you have any ad blockers, turn them off for localhost. View our [documentation](https://dev.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) to learn how to protect your Fingerprint implementation from ad blockers in production.
3. Enter a username and password, then click **Create Account**.
4. You will be redirected to a success page
5. Open the developer console in your browser and you should see the visitor ID and request ID in the output:


```
Visitor ID: kLmvO1y70BHKyTgoNoPq
Request ID: 9171022083823.zox1GS
```

## **Next steps**

To use the identification data for fraud detection (like blocking repeat fake account attempts), you’ll need to send the `requestId` to your back end. From there, your server can call the [Fingerprint Events API](https://dev.fingerprint.com/reference/server-api-get-event) to retrieve the full visitor information data and use it to make decisions and prevent fraud.


## Additional Resources

For more information on using Fingerprint device intelligence, including detailed references, visit the [Fingerprint](https://dev.fingerprint.com/) website.
