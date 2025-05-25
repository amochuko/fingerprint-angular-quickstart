import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';
import { AccoutService } from '../services/accout.service';

@Component({
  selector: 'app-fingerprint',
  imports: [ReactiveFormsModule],
  templateUrl: './fingerprint.component.html',
  styleUrl: './fingerprint.component.css',
})
export class FingerprintComponent {
  isLoading = signal(false);

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.min(8)]),
  });

  constructor(
    private accountService: AccoutService,
    private fingerprintService: FingerprintjsProAngularService
  ) {}

  async handleSubmit() {
    this.isLoading.set(true);
    const data = await this.fingerprintService.getVisitorData();
    this.accountService.register({
      formData: this.registerForm.value,
      requestId: data.requestId,
    });
  }
}
