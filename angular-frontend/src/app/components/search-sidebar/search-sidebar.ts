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
  @Input() searchMode: PostTypeMode = 'requests';
  @Input() urgentOnly = false;

  @Output() toggleSearchMode = new EventEmitter<void>();
  @Output() toggleUrgent = new EventEmitter<void>();

  query = '';
  mode: QueryMode = 'keywords';

  @Output() searchChange = new EventEmitter<{ query: string; mode: QueryMode }>();

  // simple debounce
  private debounceTimer: any;
  private readonly debounceMs = 300;

  submitSearch(): void {
    const q = this.query.trim();
    if (q.length === 0) {
      // emit empty search to clear results/filters
      this.searchChange.emit({ query: '', mode: this.mode });
      return;
    }
    if (q.length < 2) return; // minimal length to avoid noise
    this.searchChange.emit({ query: q, mode: this.mode });
  }

  onModeChange(): void {
    this.submitSearch();
  }

  onQueryChange(val: string): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.submitSearch(), this.debounceMs);
  }

  clearQuery(): void {
    this.query = '';
    this.searchChange.emit({ query: '', mode: this.mode });
  }
}
