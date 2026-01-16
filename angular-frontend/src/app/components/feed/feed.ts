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
  backendId: string; // UUID from backend
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
    const accepted = this.acceptedIds;

    let base = allItems
      .filter(x => !accepted.has(x.id))
      .filter(x => mode === 'requests' ? x.type === 'request' : x.type === 'offer');

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
            const backendId = String(post.post_id); // preserve original UUID
            return {
              backendId, // add stable key for tracking
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
            } as Sidequest & { backendId: string };
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


  itemKey(item: Sidequest, index: number): string {
    return `${item.authorUserId}-${item.title}-${item.createdAt}-${index}`;
  }
  canAccept(): boolean { return this.quests.canAccept(); }

  acceptQuest(item: Sidequest): void {
    if (!this.canAccept()) {
      alert(`Max ${this.quests.maxActive()} active quests reached.`);
      return;
    }
    // Subscribe to the accept call; the service handles DB status update
    this.quests.add(item).subscribe({
      next: () => {
        console.log('Quest accepted:', item.title);
        // Reload posts to reflect status change in feed
        this.loadPosts();
      },
      error: (err) => {
        console.error('Failed to accept quest:', err);
        alert(`Failed to accept quest: ${err.message || 'Please try again.'}`);
      }
    });
  }

  get acceptedIds(): Set<number> {
    return new Set(this.quests.active().map(q => q.id));
  }
}
