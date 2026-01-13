import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() isAuthenticated = false;
  @Input() username: string | null = null;

  // Provide from parent (AppComponent or page) to open mobile search popup
  @Input() openMobileSearch: (() => void) | null = null;
  private auth = inject(AuthService);

  onLogout(): void {
    this.auth.logout().subscribe();
  }
}
