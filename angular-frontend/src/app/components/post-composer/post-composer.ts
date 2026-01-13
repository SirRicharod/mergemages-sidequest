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

  // // Preset school tags (extend as needed)
  // readonly presetTags = [
  //   'art',
  //   'programming',
  //   'maths',
  //   'architecture',
  //   'design',
  //   'backend',
  //   'frontend',
  //   '3d',
  //   'illustration',
  //   'uiux'
  // ];

  // Form model
  title = '';
  description = '';
  type: PostType = 'request';       // "I'm looking for" vs "I can do"
  // selectedTags: string[] = [];      // MULTI-SELECT PRESET TAGS
  deadline: string = '';            // yyyy-MM-dd
  boost = false;
  xpReward = 100;                   // XP points to reward (100-500)

  @Output() submitPost = new EventEmitter<{
    title: string;
    description: string;
    type: PostType;
    // tags: string[];           // ← will carry selectedTags
    deadline: string | null;
    boost: boolean;
    xpReward: number;
  }>();

  togglePopup(open?: boolean): void {
    this.popupVisible = open ?? !this.popupVisible;
    document.body.style.overflow = this.popupVisible ? 'hidden' : '';
  }

  // toggleTag(tag: string, checked: boolean): void {
  //   if (checked) {
  //     if (!this.selectedTags.includes(tag)) this.selectedTags = [...this.selectedTags, tag];
  //   } else {
  //     this.selectedTags = this.selectedTags.filter(t => t !== tag);
  //   }
  // }

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
      this.validationError = 'Please select a valid deadline';
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
      // tags: this.selectedTags,
      deadline: this.deadline || null,
      boost: this.boost,
      xpReward: this.xpReward
    });

    // Reset and close
    this.title = '';
    this.description = '';
    this.type = 'request';
    // this.selectedTags = [];
    this.deadline = '';
    this.boost = false;
    this.xpReward = 100;
    this.togglePopup(false);
  }
}
