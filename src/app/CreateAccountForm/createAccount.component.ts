import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-create-account-form',
  imports: [FormsModule],
  template: `<div class="wrapper">
    <h1>Create an account</h1>
    <p>Username: {{ username }}</p>
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
export class CreateAccountFormComponent {
  isLoading = false;

  username = '';
  password = '';

  constructor(private fingerprintService: FingerprintjsProAngularService) {}

  async handleSubmit() {
    this.isLoading = true;
    alert(`${this.username}, ${this.password}`);

    try {
      const data = await this.fingerprintService.getVisitorData();

      // 
      // 
      
      console.log(`
        Visitor ID: ${data.visitorId}
        Request ID: ${data.requestId}`);
        

    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      this.isLoading = false;
    }
  }
}
