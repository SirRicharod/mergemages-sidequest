// src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../components/profile-card/profile-card';
import { PostComposerComponent } from '../../components/post-composer/post-composer';
import { FeedComponent } from '../../components/feed/feed';
import { RightSidebarComponent } from '../../components/search-sidebar/search-sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, PostComposerComponent, FeedComponent, RightSidebarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;

  avatarUrl: string | null = null;
  username = 'Sage Stockmans';
  email = 'sage.stockmans@proton.me';
  points = 120;
  badges = ['Helper', 'Designer', 'Top Contributor'];

  onSubmitPost(feed: FeedComponent, evt: { text: string; urgent: boolean }) {
    feed.addPost(evt.text, evt.urgent, 'request');
  }

  toggleUrgent(): void { this.urgentOnly = !this.urgentOnly; }
  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }
}
