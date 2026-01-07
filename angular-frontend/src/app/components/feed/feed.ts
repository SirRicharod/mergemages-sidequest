// src/app/components/feed/feed.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SearchMode = 'requests' | 'offers';
type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

interface Sidequest {
  id: number;
  title: string;
  description: string;
  urgent: boolean;
  author: string;
  createdAt: string;
  type: 'request' | 'offer';
  skills?: string[];   // NEW (optional)
  tags?: string[];     // NEW (optional)
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
    { id: 1, title: 'Turn my 2D logo into a 3D model', description: 'Looking for Blender help. I have SVG and references.', urgent: true, author: 'Ember', createdAt: '2026-01-05', type: 'request', skills: ['blender', '3d'], tags: ['design'] },
    { id: 2, title: 'I can design logos and brand kits', description: 'Offering graphic design help. Quick turnaround.', urgent: false, author: 'Moeke', createdAt: '2026-01-03', type: 'offer', skills: ['logo', 'branding'], tags: ['design'] },
    { id: 3, title: 'Create animated landing page with GSAP', description: 'Need smooth scroll and section reveals.', urgent: false, author: 'Courtney', createdAt: '2026-01-02', type: 'request', skills: ['gsap', 'frontend'], tags: ['web'] },
    { id: 4, title: 'I build REST APIs (Laravel, Node)', description: 'Happy to help with backend tasks and auth.', urgent: false, author: 'Sage', createdAt: '2026-01-01', type: 'offer', skills: ['laravel', 'node', 'api'], tags: ['backend'] }
  ];

  get visible(): Sidequest[] {
    const q = this.searchQuery.trim().toLowerCase();

    // 1) Filter by post type (requests/offers)
    let base = this.items.filter(x =>
      this.searchMode === 'requests' ? x.type === 'request' : x.type === 'offer'
    );

    // 2) Apply urgent-only
    if (this.urgentOnly) base = base.filter(x => x.urgent);

    // 3) Apply search query by mode
    if (q) {
      base = base.filter(x => {
        switch (this.queryMode) {
          case 'keywords':
            return (x.title + ' ' + x.description).toLowerCase().includes(q);
          case 'profile':
            return x.author.toLowerCase().includes(q);
          case 'skills':
            return (x.skills || []).some(s => s.toLowerCase().includes(q));
          case 'tags':
            return (x.tags || []).some(t => t.toLowerCase().includes(q));
          default:
            return true;
        }
      });
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
      type,
      skills: [],
      tags: []
    });
  }
}
