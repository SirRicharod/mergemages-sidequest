// src/app/components/right-sidebar/right-sidebar.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type SearchMode = 'requests' | 'offers';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-sidebar.html',
  styleUrls: ['./search-sidebar.css']
})
export class RightSidebarComponent {
  @Input() searchMode: SearchMode = 'requests';
  @Input() urgentOnly: boolean = false;

  @Output() toggleSearchMode = new EventEmitter<void>();
  @Output() toggleUrgent = new EventEmitter<void>();
}
