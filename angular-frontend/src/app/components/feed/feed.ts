import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService, PostStatus } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { QuestsService } from '../../services/quests.service';

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
  authorAvatar?: string | null;
  authorUserId: string;
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
  auth = inject(AuthService);
  private quests = inject(QuestsService);

  @Input() set urgentOnly(value: boolean) { this._urgentOnly.set(value); }
  @Input() set searchMode(value: SearchMode) { this._searchMode.set(value); }
  @Input() set searchQuery(value: string) { this._searchQuery.set(value); }
  @Input() set queryMode(value: QueryMode) { this._queryMode.set(value); }

  private _urgentOnly = signal(false);
  private _searchMode = signal<SearchMode>('requests');
  private _searchQuery = signal('');
  private _queryMode = signal<QueryMode>('keywords');

  items = signal<Sidequest[]>([]);
  loading = signal(true);

  visible = computed(() => {
    const allItems = this.items();
    const mode = this._searchMode();
    const urgent = this._urgentOnly();
    const query = this._searchQuery();
    const qMode = this._queryMode();

    let base = allItems.filter(x => mode === 'requests' ? x.type === 'request' : x.type === 'offer');
    if (urgent) base = base.filter(x => x.urgent);
    const q = query.trim().toLowerCase();
    if (q) {
      base = base.filter(x => {
        switch (qMode) {
          case 'keywords': return (x.title + ' ' + x.description).toLowerCase().includes(q);
          case 'profile': return x.author.toLowerCase().includes(q);
          default: return true;
        }
      });
    }
    return base;
  });

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postsService.getPosts().subscribe({
      next: (response) => {
        const posts = response.posts
          .filter(post => post.status !== 'deleted')
          .map((post, idx) => {
            const idNum = parseInt(post.post_id);
            return {
              id: Number.isFinite(idNum) ? idNum : Date.now() + idx,
              title: post.title,
              description: post.body,
              type: post.type as PostType,
              urgent: false,
              deadline: null,
              points: post.bounty_points,
              author: post.author?.name || 'Unknown',
              authorAvatar: post.author?.avatar_url || null,
              authorUserId: post.author_user_id,
              createdAt: new Date(post.created_at).toISOString().slice(0, 10),
              status: post.status
            } as Sidequest;
          });
        this.items.set(posts);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.loading.set(false);
      }
    });
  }

  addPost(title: string, description: string, type: PostType, points: number): void {
    this.postsService.createPost({
      title,
      body: description,
      type,
      bounty_points: points
    }).subscribe({
      next: (response) => {
        this.auth.updateXpBalance(response.xp_balance);
        this.loadPosts();
      },
      error: (err) => {
        console.error('Failed to create post:', err);
        if (err.status === 400 && err.error?.message === 'Insufficient XP balance') {
          alert(`Insufficient XP! You have ${err.error.current_balance} XP but need ${err.error.required} XP.`);
        } else {
          alert('Failed to create post. Please try again.');
        }
      }
    });
  }

  canAccept(): boolean { return this.quests.canAccept(); }

  acceptQuest(item: Sidequest): void {
    const ok = this.quests.add(item); // boolean
    if (!ok) {
      alert(`You cannot accept this quest. Either it's yours or you reached the max (${this.quests.maxActive()}).`);
      return;
    }
    // Optional backend status update (non-blocking)
    this.postsService.updatePostStatus(String(item.id), 'in_progress').subscribe({
      next: () => { },
      error: (err) => console.warn('Status update failed (local quest kept):', err)
    });
  }
}
