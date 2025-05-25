import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
}
