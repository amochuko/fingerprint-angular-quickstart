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
