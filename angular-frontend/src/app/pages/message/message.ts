import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './message.html',
  styleUrls: ['./message.css']
})
export class MessagesComponent {
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
