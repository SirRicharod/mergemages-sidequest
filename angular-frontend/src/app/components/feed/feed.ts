import { Component, Input, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostsService, PostStatus } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

type PostType = 'request' | 'offer';
type SearchMode = 'requests' | 'offers';

export interface Sidequest {
  id: number;
  realId: string; 
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
  
  // For quest acceptance
  isAccepting?: boolean;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.html',
  styleUrls: ['./feed.css']
})
export class FeedComponent implements OnInit {
  private postsService = inject(PostsService);
  private cdRef = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  @Input() set urgentOnly(value: boolean) { this._urgentOnly.set(value); }
  @Input() set searchMode(value: SearchMode) { this._searchMode.set(value); }

  private _urgentOnly = signal(false);
  private _searchMode = signal<SearchMode>('requests');

  items = signal<Sidequest[]>([]);
  loading = signal(true);
  visibleCount = signal(20);

  visible = computed(() => {
    const allItems = this.items();
    const mode = this._searchMode();
    const urgent = this._urgentOnly();

    let base = allItems.filter(x => mode === 'requests' ? x.type === 'request' : x.type === 'offer');
    if (urgent) base = base.filter(x => x.urgent);
    return base.slice(0, this.visibleCount());
  });

  filteredTotal = computed(() => {
    const allItems = this.items();
    const mode = this._searchMode();
    const urgent = this._urgentOnly();

    let base = allItems.filter(x => mode === 'requests' ? x.type === 'request' : x.type === 'offer');
    if (urgent) base = base.filter(x => x.urgent);
    return base.length;
  });

  hasMore = computed(() => this.visible().length < this.filteredTotal());

  ngOnInit(): void {
    this.loadPosts();
  }

  loadMore(): void {
    this.visibleCount.update(count => count + 20);
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postsService.getPosts().subscribe({
      next: (response) => {
        const posts = response.posts
          .filter(post => post.status !== 'deleted')
          .map((post, idx) => {
            const idNum = parseInt(post.post_id);
            const avatarUrl = post.author?.avatar_url;
            // Check if avatar_url is already a full URL or just a path
            const fullAvatarUrl = avatarUrl && avatarUrl.trim() 
              ? (avatarUrl.startsWith('http') ? avatarUrl : `http://127.0.0.1:8000/storage/${avatarUrl}`)
              : null;
            
            return {
              id: Number.isFinite(idNum) ? idNum : Date.now() + idx,
              realId: post.post_id,
              title: post.title,
              description: post.body,
              type: post.type as PostType,
              urgent: post.urgent || false,
              deadline: null,
              points: post.bounty_points,
              author: post.author?.name || 'Unknown',
              authorAvatar: fullAvatarUrl,
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

  addPost(title: string, description: string, type: PostType, points: number, boost?: boolean): void {
    this.postsService.createPost({
      title,
      body: description,
      type,
      bounty_points: points,
      boost: boost ?? false
    }).subscribe({
      next: (response) => {
        this.auth.updateXpBalance(response.xp_balance);
        this.loadPosts();
      },
      error: (err) => {
        console.error('Failed to create post:', err);
        if (err.status === 400 && err.error?.message === 'Insufficient XP balance') {
          this.toast.error(`Insufficient XP! You have ${err.error.current_balance} XP but need ${err.error.required} XP.`);
        } else {
          this.toast.error('Failed to create post. Please try again.');
        }
      }
    });
  }

  acceptQuest(quest: Sidequest): void {
    if (!this.auth.currentUser()) {
      this.toast.warning('You must be logged in to accept a quest.');
      return;
    }

    if (quest.status !== 'created') {
      this.toast.warning('This quest is not available for acceptance.');
      return;
    }

    quest.isAccepting = true;
    this.items.update(items => [...items]);

    this.postsService.acceptQuest(quest.realId).subscribe({
      next: (response) => {
        quest.status = 'in_progress';
        quest.isAccepting = false;
        this.items.update(items => [...items]);
        this.cdRef.detectChanges();
        this.toast.success(`Quest accepted! You can now work on "${quest.title}".`);
      },
      error: (err) => {
        console.error('Failed to accept quest:', err);
        quest.isAccepting = false;
        this.items.update(items => [...items]);
        this.cdRef.detectChanges();
        
        if (err.status === 403) {
          this.toast.error(err.error?.message || 'You cannot accept your own quest.');
        } else if (err.status === 400) {
          this.toast.error(err.error?.message || 'This quest is not available.');
        } else if (err.status === 401) {
          this.toast.error('Your session has expired. Please log in again.');
        } else {
          this.toast.error(`Failed to accept quest. Error: ${err.status} - ${err.error?.message || 'Unknown error'}`);
        }
      }
    });
  }
}
