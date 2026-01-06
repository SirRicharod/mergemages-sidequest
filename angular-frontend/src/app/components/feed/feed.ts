// src/app/components/feed/feed.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SearchMode = 'all' | 'switch';

interface Sidequest {
  id: number;
  title: string;
  description: string;
  urgent: boolean;
  author: string;
  createdAt: string;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class FeedComponent {
  @Input() urgentOnly: boolean = false;
  @Input() searchMode: SearchMode = 'all';

  // PLACEHOLDER data; replace with API later
  items: Sidequest[] = [
    { id: 1, title: 'Turn my 2D logo into a 3D model', description: 'Looking for Blender help. I have SVG and references.', urgent: true, author: 'Ember', createdAt: '2026-01-05' },
    { id: 2, title: 'Build a REST API for a class project', description: 'Prefer Laravel or Node. Database schema provided.', urgent: false, author: 'Moeke', createdAt: '2026-01-03' },
    { id: 3, title: 'Create animated landing page with GSAP', description: 'Need smooth scroll and section reveals.', urgent: false, author: 'Courtney', createdAt: '2026-01-02' }
  ];

  get visible(): Sidequest[] {
    const base = this.urgentOnly ? this.items.filter(x => x.urgent) : this.items;
    if (this.searchMode === 'switch') {
      return base.filter(x => x.title.toLowerCase().includes('a'));
    }
    return base;
  }

  addPost(text: string, urgent: boolean) {
    this.items.unshift({
      id: Date.now(),
      title: text.slice(0, 40),
      description: text,
      urgent,
      author: 'You',
      createdAt: new Date().toISOString().slice(0, 10)
    });
  }
}
