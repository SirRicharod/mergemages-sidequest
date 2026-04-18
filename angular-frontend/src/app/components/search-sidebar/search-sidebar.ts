// src/app/components/search-sidebar/search-sidebar.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PostTypeMode = 'requests' | 'offers';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-sidebar.html',
  styleUrls: ['./search-sidebar.css']
})
export class RightSidebarComponent {
  @Input() searchMode: PostTypeMode = 'requests';
  @Input() urgentOnly = false;

  @Output() toggleSearchMode = new EventEmitter<void>();
  @Output() toggleUrgent = new EventEmitter<void>();
}
