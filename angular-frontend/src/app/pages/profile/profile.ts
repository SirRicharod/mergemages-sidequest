import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  // Feed mode toggle (kept consistent across pages)
  searchMode: 'requests' | 'offers' = 'requests';

  // Mobile search overlay state
  mobileSearchVisible = false;
  mobileQuery = '';
  mobileQueryMode: QueryMode = 'keywords';

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }
  submitMobileSearch(): void {
    // Optionally route to feed with query via a shared service or router state
    this.mobileSearchVisible = false;
  }

  // Optional hook if you want to open post from profile
  openPostPopup?(): void;
}
