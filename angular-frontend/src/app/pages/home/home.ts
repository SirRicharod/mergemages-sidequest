// src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../components/profile-card/profile-card';
import { PostComposerComponent } from '../../components/post-composer/post-composer';
import { FeedComponent } from '../../components/feed/feed';
import { RightSidebarComponent } from '../../components/search-sidebar/search-sidebar';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, PostComposerComponent, FeedComponent, RightSidebarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  // filters
  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;

  // search state (driven by right sidebar)
  searchQuery = '';
  queryMode: QueryMode = 'keywords';

  // demo user
  avatarUrl: string | null = null;
  username = 'Sage Stockmans';
  email = 'sage.stockmans@proton.me';
  points = 120;
  badges = ['Helper', 'Designer', 'Top Contributor'];

  onSubmitPost(feed: FeedComponent, evt: { text: string; urgent: boolean; type?: 'request' | 'offer' }) {
    feed.addPost(evt.text, evt.urgent, evt.type ?? 'request');
  }

  toggleUrgent(): void { this.urgentOnly = !this.urgentOnly; }
  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }

  onSearchChange(evt: { query: string; mode: QueryMode }) {
    this.searchQuery = evt.query;
    this.queryMode = evt.mode;
  }
}
