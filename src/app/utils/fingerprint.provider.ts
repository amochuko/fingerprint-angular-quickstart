import { EnvironmentProviders, Provider } from '@angular/core';
import {
  FingerprintjsProAngularModule,
  FpjsClientOptions,
} from '@fingerprintjs/fingerprintjs-pro-angular';

export function provideFingerprintPro(
  clientOptions: FpjsClientOptions
): Provider | EnvironmentProviders {
  const moduleWithProvider =
    FingerprintjsProAngularModule.forRoot(clientOptions);

  return moduleWithProvider.providers as Provider | EnvironmentProviders;
}
