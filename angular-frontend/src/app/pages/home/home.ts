// src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../components/profile-card/profile-card';
import { PostComposerComponent } from '../../components/post-composer/post-composer';
import { FeedComponent } from '../../components/feed/feed';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, PostComposerComponent, FeedComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  searchMode: 'all' | 'switch' = 'all';
  urgentOnly = false;

  // Demo user data; later bind to real service
  avatarUrl: string | null = null;
  username = 'Sage Stockmans';
  email = 'sage.stockmans@proton.me';
  points = 120;
  badges = ['Helper', 'Designer', 'Top Contributor'];

  // reference to feed to push new posts (template var via ViewChild is alternative)
  onSubmitPost(feed: FeedComponent, evt: { text: string; urgent: boolean }) {
    feed.addPost(evt.text, evt.urgent);
  }

  toggleUrgent(): void { this.urgentOnly = !this.urgentOnly; }
  toggleSearchMode(): void { this.searchMode = this.searchMode === 'all' ? 'switch' : 'all'; }
}
