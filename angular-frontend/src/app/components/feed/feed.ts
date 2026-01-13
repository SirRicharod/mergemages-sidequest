// src/app/components/feed/feed.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type PostType = 'request' | 'offer';
type SearchMode = 'requests' | 'offers';
type QueryMode = 'keywords' | 'profile' | 'skills';

export interface Sidequest {
  id: number;
  title: string;
  description: string;
  type: PostType;
  urgent: boolean;
  deadline?: string | null;
  points: number;
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
  @Input() searchMode: SearchMode = 'requests';
  @Input() searchQuery: string = '';
  @Input() queryMode: QueryMode = 'keywords';

  items: Sidequest[] = [
    { id: 1, title: 'Turn my 2D logo into a 3D model', description: 'Looking for Blender help. I have SVG and references.', type: 'request', urgent: true, deadline: '2026-01-12', points: 50, author: 'Ember', createdAt: '2026-01-05' },
    { id: 2, title: 'I can design logos and brand kits', description: 'Offering graphic design help. Quick turnaround.', type: 'offer', urgent: false, deadline: null, points: 30, author: 'Moeke', createdAt: '2026-01-03' },
    { id: 3, title: 'Create animated landing page with GSAP', description: 'Need smooth scroll and section reveals.', type: 'request', urgent: false, deadline: '2026-01-20', points: 40, author: 'Courtney', createdAt: '2026-01-02' },
    { id: 4, title: 'I build REST APIs (Laravel, Node)', description: 'Happy to help with backend tasks and auth.', type: 'offer', urgent: false, deadline: null, points: 25, author: 'Sage', createdAt: '2026-01-01' }
  ];

  get visible(): Sidequest[] {
    let base = this.items.filter(x => this.searchMode === 'requests' ? x.type === 'request' : x.type === 'offer');
    if (this.urgentOnly) base = base.filter(x => x.urgent);
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      base = base.filter(x => {
        switch (this.queryMode) {
          case 'keywords': return (x.title + ' ' + x.description).toLowerCase().includes(q);
          case 'profile': return x.author.toLowerCase().includes(q);
          default: return true;
        }
      });
    }
    return base;
  }

  addPost(text: string, urgent: boolean, type: PostType = 'request') {
    const [firstLine, ...rest] = text.split('\n');
    this.items.unshift({
      id: Date.now(),
      title: firstLine || 'Untitled',
      description: rest.join('\n') || '',
      type,
      urgent,
      deadline: null,
      points: 10,
      author: 'You',
      createdAt: new Date().toISOString().slice(0, 10)
    });
  }
}
