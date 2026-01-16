// src/app/services/quests.service.ts
import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Sidequest } from '../components/feed/feed';
import { PostsService } from './posts.service';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QuestsService {
    private auth = inject(AuthService);
    private http = inject(HttpClient);
    private posts = inject(PostsService);
    private apiUrl = 'http://127.0.0.1:8000/api';
    private readonly MAX_ACTIVE = 5;

    private _active = signal<Sidequest[]>([]);
    readonly active = computed(() => this._active());
    readonly count = computed(() => this._active().length);
    readonly canAccept = computed(() => this._active().length < this.MAX_ACTIVE);

    constructor() {
        let lastUserId: number | null = null;
        effect(() => {
            const user = this.auth.currentUser();
            const uid = user?.id ?? null;
            if (uid !== lastUserId) {
                lastUserId = uid;
                if (uid) this.loadMine();
                else this._active.set([]);
            }
        });
    }

    loadMine(): void {
        this.http.get<{ quests: any[] }>(`${this.apiUrl}/quests`).pipe(
            tap(res => {
                const mapped = res.quests.map((post, idx) => ({
                    backendId: post.post_id, // UUID
                    id: Number.isFinite(parseInt(post.post_id)) ? parseInt(post.post_id) : Date.now() + idx,
                    title: post.title,
                    description: post.body,
                    type: post.type as 'request' | 'offer',
                    urgent: false,
                    deadline: null,
                    points: post.bounty_points,
                    author: post.author?.name || 'Unknown',
                    authorAvatar: post.author?.avatar_url || null,
                    authorUserId: post.author_user_id,
                    createdAt: new Date(post.created_at).toISOString().slice(0, 10),
                    status: post.status
                }));
                this._active.set(mapped);
            })
        ).subscribe();
    }

    /**
     * Accept a quest: POST to accept endpoint using backendId (UUID), update post status to 'in_progress', then add to local state
     */
    add(q: Sidequest): Observable<any> {
        if (this.auth.currentUser()?.id?.toString() === q.authorUserId) {
            return throwError(() => new Error('Cannot accept your own quest'));
        }
        if (!this.canAccept()) {
            return throwError(() => new Error(`Max ${this.MAX_ACTIVE} quests allowed`));
        }
        if (this._active().some(x => x.id === q.id)) {
            return throwError(() => new Error('Quest already accepted'));
        }

        // Use backendId (UUID) for the API call
        const postId = (q as any).backendId || q.id;
        return this.http.post(`${this.apiUrl}/quests/${postId}/accept`, {}).pipe(
            tap(() => {
                // Update post status in DB to 'in_progress'
                this.posts.updatePostStatus(String(postId), 'in_progress').subscribe({
                    error: (err) => console.warn('Status update failed:', err)
                });
                // Add to local active quests
                this._active.set([...this._active(), q]);
            }),
            catchError((err) => {
                console.error('Error accepting quest:', err);
                return throwError(() => err);
            })
        );
    }

    /**
     * Remove/abandon a quest: DELETE from quests endpoint using backendId (UUID), update post status back to 'created'
     */
    remove(idOrQuest: number | Sidequest): Observable<any> {
        // Support both numeric id and full quest object
        let postId: string;
        let questId: number;
        
        if (typeof idOrQuest === 'object') {
            postId = (idOrQuest as any).backendId || String(idOrQuest.id);
            questId = idOrQuest.id;
        } else {
            questId = idOrQuest;
            // Try to find the quest to get its backendId
            const quest = this._active().find(q => q.id === idOrQuest);
            postId = (quest as any)?.backendId || String(idOrQuest);
        }

        return this.http.delete(`${this.apiUrl}/quests/${postId}/remove`).pipe(
            tap(() => {
                // Update post status back to 'created'
                this.posts.updatePostStatus(postId, 'created').subscribe({
                    error: (err) => console.warn('Status revert failed:', err)
                });
                // Remove from local active quests
                this._active.set(this._active().filter(x => x.id !== questId));
            }),
            catchError((err) => {
                console.error('Error removing quest:', err);
                return throwError(() => err);
            })
        );
    }

    maxActive(): number { return this.MAX_ACTIVE; }
}
