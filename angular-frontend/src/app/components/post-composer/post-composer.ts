// src/app/components/post-composer/post-composer.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PostType = 'request' | 'offer';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-composer.html',
  styleUrls: ['./post-composer.css']
})
export class PostComposerComponent {
  // Popup visibility (kept from previous step)
  popupVisible = false;

  // Preset school tags (extend as needed)
  readonly presetTags = [
    'art',
    'programming',
    'maths',
    'architecture',
    'design',
    'backend',
    'frontend',
    '3d',
    'illustration',
    'uiux'
  ];

  // Form model
  title = '';
  description = '';
  type: PostType = 'request';       // "I'm looking for" vs "I can do"
  selectedTags: string[] = [];      // MULTI-SELECT PRESET TAGS
  deadline: string = '';            // yyyy-MM-dd
  boost = false;
  deadlineError: string | null = null;

  @Output() submitPost = new EventEmitter<{
    title: string;
    description: string;
    type: PostType;
    tags: string[];           // ← will carry selectedTags
    deadline: string | null;
    boost: boolean;
  }>();

  openPopup(): void {
    this.popupVisible = true;
    document.body.style.overflow = 'hidden';
  }
  closePopup(): void {
    this.popupVisible = false;
    document.body.style.overflow = '';
  }

  toggleTag(tag: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedTags.includes(tag)) this.selectedTags = [...this.selectedTags, tag];
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
  }

  onSubmit(): void {
    const title = this.title.trim();
    const description = this.description.trim();
    if (!title || !description) return;

    // Validate deadline is not in the past (if provided)
    if (this.deadline) {
      if (this.isPastDate(this.deadline)) {
        this.deadlineError = 'Deadline cannot be in the past.';
        return;
      }
    }

    this.deadlineError = null;

    this.submitPost.emit({
      title,
      description,
      type: this.type,
      tags: this.selectedTags,
      deadline: this.deadline || null,
      boost: this.boost
    });

    // Reset and close
    this.title = '';
    this.description = '';
    this.type = 'request';
    this.selectedTags = [];
    this.deadline = '';
    this.boost = false;
    this.closePopup();
  }

  // Min date for the date input (today)
  get minDate(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Utility: check if yyyy-MM-dd is before today (local time)
  private isPastDate(dateStr: string): boolean {
    // Build Date objects at local midnight for accurate comparison
    const [y, m, d] = dateStr.split('-').map(Number);
    const selected = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    return selected < todayMidnight;
  }
}
