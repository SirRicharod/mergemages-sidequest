// src/app/components/search-sidebar/search-sidebar.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PostTypeMode = 'requests' | 'offers';
export type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-sidebar.html',
  styleUrls: ['./search-sidebar.css']
})
export class RightSidebarComponent {
  // Existing filters
  @Input() searchMode: PostTypeMode = 'requests';
  @Input() urgentOnly = false;

  @Output() toggleSearchMode = new EventEmitter<void>();
  @Output() toggleUrgent = new EventEmitter<void>();

  // Search inputs (kept local in the sidebar)
  query = '';
  mode: QueryMode = 'keywords';

  @Output() searchChange = new EventEmitter<{ query: string; mode: QueryMode }>();

  submitSearch(): void {
    this.searchChange.emit({ query: this.query.trim(), mode: this.mode });
  }

  onModeChange(): void {
    this.submitSearch();
  }
}
