import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface RegisterArgs {
  requestId: string;
  formData: Partial<{ username: string | null; password: string | null }>;
}

@Injectable({
  providedIn: 'root',
})
export class AccoutService {
  private _url = 'http://localhost:4200/api/register';

  constructor(private httpClient: HttpClient) {}

  register(args: RegisterArgs) {
    try {
      this.httpClient.post(this._url, args).subscribe((res) => {
        console.log('Registered successfullly: ', res);
      });
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }
}
