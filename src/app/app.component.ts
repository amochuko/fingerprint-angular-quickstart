import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FingerprintComponent } from './fingerprint/fingerprint.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FingerprintComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fingerprint angular quickstart';
}
