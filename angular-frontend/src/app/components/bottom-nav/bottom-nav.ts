import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

type Mode = 'requests' | 'offers';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrls: ['./bottom-nav.css']
})
export class BottomNavComponent {
  @Input() mode: Mode = 'requests';
  @Output() toggleMode = new EventEmitter<void>();
  @Output() makePost = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();

  constructor(private router: Router) { }

  get isOnFeed(): boolean {
    // Adjust if your feed is not '/'
    return this.router.url === '/' || this.router.url.startsWith('/?');
  }

  onFeedPress(): void {
    if (this.isOnFeed) {
      this.toggleMode.emit();
    } else {
      this.router.navigate(['/']);
    }
  }
}
