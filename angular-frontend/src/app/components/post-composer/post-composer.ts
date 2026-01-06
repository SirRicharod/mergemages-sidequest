// src/app/components/post-composer/post-composer.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-composer.html',
  styleUrls: ['./post-composer.css']
})
export class PostComposerComponent {
  text = '';
  urgent = false;

  @Output() submitPost = new EventEmitter<{ text: string; urgent: boolean }>();

  onSubmit() {
    const trimmed = this.text.trim();
    if (!trimmed) return;
    this.submitPost.emit({ text: trimmed, urgent: this.urgent });
    this.text = '';
    this.urgent = false;
  }
}
