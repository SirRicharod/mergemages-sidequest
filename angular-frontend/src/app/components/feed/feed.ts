// src/app/components/feed/feed.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SearchMode = 'requests' | 'offers';

interface Sidequest {
  id: number;
  title: string;
  description: string;
  urgent: boolean;
  author: string;
  createdAt: string;
  type: 'request' | 'offer'; // NEW: distinguishes post type
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
  @Input() searchMode: SearchMode = 'requests';

  // REPLACE WITH API!!!!!!!!!!!!!!!
  items: Sidequest[] = [
    {
      id: 1,
      title: 'Turn my 2D logo into a 3D model',
      description: 'Looking for Blender help. I have SVG and references.',
      urgent: true,
      author: 'Ember',
      createdAt: '2026-01-05',
      type: 'request'
    },
    {
      id: 2,
      title: 'I can design logos and brand kits',
      description: 'Offering graphic design help. Quick turnaround.',
      urgent: false,
      author: 'Moeke',
      createdAt: '2026-01-03',
      type: 'offer'
    },
    {
      id: 3,
      title: 'Create animated landing page with GSAP',
      description: 'Need smooth scroll and section reveals.',
      urgent: false,
      author: 'Courtney',
      createdAt: '2026-01-02',
      type: 'request'
    },
    {
      id: 4,
      title: 'I build REST APIs (Laravel, Node)',
      description: 'Happy to help with backend tasks and auth.',
      urgent: false,
      author: 'Sage',
      createdAt: '2026-01-01',
      type: 'offer'
    }
  ];

  get visible(): Sidequest[] {
    // Filter by switch type
    let base = this.items.filter(x =>
      this.searchMode === 'requests' ? x.type === 'request' : x.type === 'offer'
    );
    // Apply urgent-only filter
    if (this.urgentOnly) {
      base = base.filter(x => x.urgent);
    }
    return base;
  }

  addPost(text: string, urgent: boolean, type: 'request' | 'offer' = 'request') {
    this.items.unshift({
      id: Date.now(),
      title: text.slice(0, 40),
      description: text,
      urgent,
      author: 'You',
      createdAt: new Date().toISOString().slice(0, 10),
      type
    });
  }
}
