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

  @Output() submitPost = new EventEmitter<{
    title: string;
    description: string;
    type: PostType;
    tags: string[];           // ← will carry selectedTags
    deadline: string | null;
    boost: boolean;
  }>();

  togglePopup(open?: boolean): void {
    this.popupVisible = open ?? !this.popupVisible;
    document.body.style.overflow = this.popupVisible ? 'hidden' : '';
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
    this.togglePopup(false);
  }
}
