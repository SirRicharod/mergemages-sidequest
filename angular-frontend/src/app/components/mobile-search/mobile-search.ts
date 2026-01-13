import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type QueryMode = 'keywords' | 'profile' | 'skills';

@Component({
  selector: 'app-mobile-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-search.html',
  styleUrls: ['./mobile-search.css']
})
export class MobileSearchComponent {
  visible = false;

  query = '';
  mode: QueryMode = 'keywords';

  @Output() searchChange = new EventEmitter<{ query: string; mode: QueryMode }>();

  open(): void {
    this.visible = true;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.visible = false;
    document.body.style.overflow = '';
  }

  submit(): void {
    this.searchChange.emit({ query: this.query.trim(), mode: this.mode });
    this.close();
  }

  clear(): void {
    this.query = '';
  }
}
