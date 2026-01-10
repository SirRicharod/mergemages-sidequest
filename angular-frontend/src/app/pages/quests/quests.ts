import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class QuestsComponent {
  searchMode: 'requests' | 'offers' = 'requests';

  mobileSearchVisible = false;
  mobileQuery = '';
  mobileQueryMode: QueryMode = 'keywords';

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }

  openPostPopup(): void {
    alert('Make post not available on Messages page yet. Please use the Feed.');
  }
}
