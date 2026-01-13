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
  validationError = '';

  // Form model
  title = '';
  description = '';
  type: PostType = 'request';       // "I'm looking for" vs "I can do"
  deadline: string = '';            // yyyy-MM-dd
  boost = false;
  xpReward = 100;                   // XP points to reward (100-500)

  @Output() submitPost = new EventEmitter<{
    title: string;
    description: string;
    type: PostType;
    deadline: string | null;
    boost: boolean;
    xpReward: number;
  }>();

  togglePopup(open?: boolean): void {
    this.popupVisible = open ?? !this.popupVisible;
    document.body.style.overflow = this.popupVisible ? 'hidden' : '';
  }

  onSubmit(): void {
    const title = this.title.trim();
    const description = this.description.trim();

    // Validation checks
    if (!title) {
      this.validationError = 'Please enter a title';
      return;
    }
    if (!description) {
      this.validationError = 'Please enter a description';
      return;
    }
    if (!this.deadline) {
      this.validationError = 'Please select a deadline';
      return;
    }
    if (this.isPastDate(this.deadline)) {
      this.validationError = 'Deadline cannot be in the past';
      return;
    }
    if (this.xpReward < 100 || this.xpReward > 500) {
      this.validationError = 'XP Reward must be between 100 and 500';
      return;
    }

    // Clear any previous errors
    this.validationError = '';

    this.submitPost.emit({
      title,
      description,
      type: this.type,
      deadline: this.deadline || null,
      boost: this.boost,
      xpReward: this.xpReward
    });

    // Reset and close
    this.title = '';
    this.description = '';
    this.type = 'request';
    this.deadline = '';
    this.boost = false;
    this.xpReward = 100;
    this.togglePopup(false);
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
    const [y, m, d] = dateStr.split('-').map(Number);
    const selected = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    return selected < todayMidnight;
  }
}
