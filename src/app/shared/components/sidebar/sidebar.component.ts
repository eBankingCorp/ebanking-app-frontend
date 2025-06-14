import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CryptoAccessService } from '../../../core/services/crypto-access.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: [`
    /* Optional: Add any component-specific styles here */
    :host {
      display: block;
      height: 100%;
    }

    /* Active link highlight animation */
    a.border-l-2 {
      position: relative;
      overflow: hidden;
    }

    a.border-l-2::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, #6366f1, #9333ea);
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
    }

    /* Disabled link styles */
    a.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  hasCryptoAccess = false;
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private cryptoAccessService: CryptoAccessService
  ) {}

  ngOnInit(): void {
    // Subscribe to crypto access state
    this.cryptoAccessService.hasAccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasAccess => {
        this.hasCryptoAccess = hasAccess;
      });

    // If you need to do anything on component initialization
    if (!this.authService.currentUserValue) {
      console.log(this.authService.getCurrentUser());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInitials(): string {
    const user = this.authService.currentUserValue;
    if (!user || !user.username) {
      return 'U';
    }

    // Get first letter of first and last name if possible
    const nameParts = user.username.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }

    // Otherwise just use the first letter
    return user.username[0].toUpperCase();
  }

  logout(): void {
    // Check if the logout method returns an observable
    const logoutOperation = this.authService.logout();

    if (logoutOperation && typeof logoutOperation.subscribe === 'function') {
      // If it's an observable, subscribe to it
      logoutOperation.subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('Logout failed:', err);
          this.router.navigate(['/login']); // Redirect even if logout fails
        }
      });
    } else {
      // If it's not an observable (void return type), just navigate
      this.router.navigate(['/login']);
    }
  }
}
