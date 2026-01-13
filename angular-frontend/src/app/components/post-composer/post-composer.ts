// src/app/components/post-composer/post-composer.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

type PostType = 'request' | 'offer';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-composer.html',
  styleUrls: ['./post-composer.css']
})
export class PostComposerComponent {
  auth = inject(AuthService);
  
  // Popup visibility (kept from previous step)
  popupVisible = false;
  validationError = '';

  // Check if user has insufficient XP
  get hasInsufficientXp(): boolean {
    const currentXp = this.auth.currentUser()?.xp_balance || 0;
    return this.xpReward > currentXp;
  }

  get xpShortfall(): number {
    const currentXp = this.auth.currentUser()?.xp_balance || 0;
    return Math.max(0, this.xpReward - currentXp);
  }

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
    const selectedDate = new Date(this.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);


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
    if (selectedDate.getTime() < today.getTime()) {
      this.validationError = 'The deadline cannot be in the past.';
      return;
    }
    if (this.xpReward < 100 || this.xpReward > 500) {
      this.validationError = 'XP Reward must be between 100 and 500';
      return;
    }
    if (this.hasInsufficientXp) {
      this.validationError = `Insufficient XP. You need ${this.xpShortfall} more XP to create this post.`;
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
}
