import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { FINGERPRINT_API_KEY_PUBLIC } from './utils/env';
import { provideFingerprintPro } from './utils/fingerprint.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideFingerprintPro({
      loadOptions: {
        apiKey: String(FINGERPRINT_API_KEY_PUBLIC),
        region: 'eu',
        // Ensure this matches your workspace region
        // For more information, see https://dev.fingerprint.com/docs/regions
      },
    }),
  ],
};
