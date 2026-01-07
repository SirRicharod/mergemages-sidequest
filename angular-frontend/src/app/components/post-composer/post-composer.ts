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
  // Popup visibility
  popupVisible = false;

  // Form model
  title = '';
  description = '';
  type: PostType = 'request';     // "I'm looking for" vs "I can do"
  tagsInput = '';                 // comma-separated
  deadline: string = '';          // yyyy-MM-dd
  boost = false;

  @Output() submitPost = new EventEmitter<{
    title: string;
    description: string;
    type: PostType;
    tags: string[];
    deadline: string | null;
    boost: boolean;
  }>();

  // Trigger from Home
  openPopup(): void {
    this.popupVisible = true;
    document.body.style.overflow = 'hidden';
  }
  closePopup(): void {
    this.popupVisible = false;
    document.body.style.overflow = '';
  }

  onSubmit(): void {
    const title = this.title.trim();
    const description = this.description.trim();
    if (!title || !description) return;

    const tags = this.tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    this.submitPost.emit({
      title,
      description,
      type: this.type,
      tags,
      deadline: this.deadline || null,
      boost: this.boost
    });

    // Reset and close
    this.title = '';
    this.description = '';
    this.type = 'request';
    this.tagsInput = '';
    this.deadline = '';
    this.boost = false;
    this.closePopup();
  }
}
