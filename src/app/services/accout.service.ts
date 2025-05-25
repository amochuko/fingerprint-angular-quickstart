import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';

interface RegisterArgs {
  requestId: string;
  formData: Partial<{ username: string | null; password: string | null }>;
}

@Injectable({
  providedIn: 'root',
})
export class AccoutService {
  private _url = 'http://localhost:4200/api/register';

  constructor(
    private httpClient: HttpClient,
    private fingerprintService: FingerprintjsProAngularService
  ) {}

  register(args: RegisterArgs) {
    try {
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }
}
