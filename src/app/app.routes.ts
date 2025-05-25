import { Routes } from '@angular/router';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { SuccessComponent } from './success/success.component';

export const routes: Routes = [
  {
    path: '',
    component: FingerprintComponent,
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
];
