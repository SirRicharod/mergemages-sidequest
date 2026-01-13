// src/app/components/feed/feed.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService, Post, PostStatus } from '../../services/posts.service';

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
  status: PostStatus;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class FeedComponent implements OnInit {
  private postsService = inject(PostsService);
  
  @Input() urgentOnly: boolean = false;
  @Input() searchMode: SearchMode = 'requests';
  @Input() searchQuery: string = '';
  @Input() queryMode: QueryMode = 'keywords';

  items: Sidequest[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.postsService.getPosts().subscribe({
      next: (response) => {
        // Map backend Post to frontend Sidequest and filter out deleted
        this.items = response.posts
          .filter(post => post.status !== 'deleted')
          .map(post => ({
            id: parseInt(post.post_id),
            title: post.title,
            description: post.body,
            type: 'request' as PostType, // Default for now
            urgent: false, // Default for now
            deadline: null,
            points: post.bounty_points,
            author: post.author?.name || 'Unknown',
            createdAt: new Date(post.created_at).toISOString().slice(0, 10),
            status: post.status
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.loading = false;
      }
    });
  }

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

  addPost(title: string, description: string, points: number): void {
    this.postsService.createPost({
      title,
      body: description,
      bounty_points: points
    }).subscribe({
      next: () => {
        this.loadPosts(); // Reload to show the new post
      },
      error: (err) => {
        console.error('Failed to create post:', err);
      }
    });
  }
}
