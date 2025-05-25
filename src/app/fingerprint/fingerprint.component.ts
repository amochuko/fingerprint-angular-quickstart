import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';
import { AccountService } from '../services/account/account.service';

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

      console.log(`
            Visitor ID: ${data.visitorId}
            Request ID: ${data.requestId}`);

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
