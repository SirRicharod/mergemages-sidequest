import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PostStatus = 'created' | 'in_progress' | 'completed' | 'deleted';
export type PostType = 'request' | 'offer';

export interface Post {
  post_id: string;
  author_user_id: string;
  accepted_user_id?: string | null;
  title: string;
  body: string;
  type: PostType;
  status: PostStatus;
  bounty_points: number;
  urgent?: boolean;
  created_at: string;
  updated_at: string;
  comments_count?: number;
  author?: {
    name: string;
    avatar_url?: string;
  };
  accepter?: {
    user_id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface CreatePostRequest {
  title: string;
  body: string;
  type: PostType;
  bounty_points: number;
  boost?: boolean;
}

export interface CreatePostResponse {
  message: string;
  post: Post;
  xp_balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all posts (excluding deleted)
   */
  getPosts(): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(`${this.apiUrl}/posts`);
  }

  /**
   * Create a new post
   */
  createPost(data: CreatePostRequest): Observable<CreatePostResponse> {
    return this.http.post<CreatePostResponse>(`${this.apiUrl}/posts`, data);
  }

  /**
   * Update post status
   */
  updatePostStatus(postId: string, status: PostStatus): Observable<any> {
    return this.http.patch(`${this.apiUrl}/posts/${postId}/status`, { status });
  }

  /**
   * Accept a quest
   */
  acceptQuest(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/accept`, {});
  }

  /**
   * Complete a quest (creator only)
   */
  completeQuest(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/complete`, {});
  }
}
