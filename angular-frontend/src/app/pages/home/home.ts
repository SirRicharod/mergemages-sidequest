// src/app/pages/home/home.ts
import { Component, ViewChild } from '@angular/core';
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
  @ViewChild('composerRef') composerRef?: PostComposerComponent;
  @ViewChild('feedRef') feedRef?: FeedComponent;

  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;
  searchQuery = '';
  queryMode: QueryMode = 'keywords';

  avatarUrl: string | null = null;
  username = 'Sage Stockmans';
  email = 'sage.stockmans@proton.me';
  points = 120;
  badges = ['Helper', 'Designer', 'Top Contributor'];

  openPostPopup(): void {
    this.composerRef?.openPopup();
  }

  onSubmitPost(feed: FeedComponent, evt: {
    title: string; description: string; type: 'request' | 'offer';
    tags: string[]; deadline: string | null; boost: boolean;
  }) {
    const textLines = [
      evt.title,
      evt.description,
      evt.deadline ? `Deadline: ${evt.deadline}` : '',
      evt.tags.length ? `Tags: ${evt.tags.join(', ')}` : '',
      evt.boost ? 'Boosted' : ''
    ].filter(Boolean);
    const text = textLines.join('\n');
    feed.addPost(text, false, evt.type);
  }

  toggleUrgent(): void { this.urgentOnly = !this.urgentOnly; }
  toggleSearchMode(): void { this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests'; }
  onSearchChange(evt: { query: string; mode: QueryMode }) { this.searchQuery = evt.query; this.queryMode = evt.mode; }
}
