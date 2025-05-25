import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [RouterModule],
  templateUrl: 'success.component.html',
  styleUrl: 'success.component.css',
})
export class SuccessComponent {
  private router = inject(Router);

  username =
    this.router.getCurrentNavigation()?.extras.state?.['username'] ?? 'User';
  requestId =
    this.router.getCurrentNavigation()?.extras.state?.['requestId'] ??
    'Unknown';
}
