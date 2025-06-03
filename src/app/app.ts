import { Component } from '@angular/core';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';

@Component({
  selector: 'app-root',
  imports: [CreateAccountFormComponent],
  template: `<main class="main">
    <app-create-account-form />
  </main>`,
})
export class App {}
