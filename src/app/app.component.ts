import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateAccountFormComponent } from './CreateAccountForm/createAccount.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateAccountFormComponent],
  template: `<main class="main">
    <app-create-account-form />
    <router-outlet />
  </main>`,
})
export class AppComponent {}
