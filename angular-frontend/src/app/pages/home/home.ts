// src/app/pages/home/home.ts
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from '../../components/profile-card/profile-card';
import { PostComposerComponent } from '../../components/post-composer/post-composer';
import { FeedComponent } from '../../components/feed/feed';
import { RightSidebarComponent } from '../../components/search-sidebar/search-sidebar';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { ComposerCoordinatorService } from '../../components/composer-coordinator.service';
import { Subscription } from 'rxjs';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileCardComponent, PostComposerComponent, FeedComponent, RightSidebarComponent, BottomNavComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('composerRef') composerRef?: PostComposerComponent;
  @ViewChild('feedRef') feedRef?: FeedComponent;

  private sub?: Subscription;

  // Feed filters
  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;

  // Desktop mode
  searchQuery = '';
  queryMode: QueryMode = 'keywords';

  // Mobile mode
  mobileSearchVisible = false;
  mobileQuery = '';
  mobileQueryMode: QueryMode = 'keywords';

  // DEMO PLEASE IMPORT API
  avatarUrl: string | null = null;
  username = 'Sage Stockmans';
  email = 'sage.stockmans@proton.me';
  points = 120;
  badges = ['Helper', 'Designer', 'Top Contributor'];

  constructor(private composerCoordinator: ComposerCoordinatorService) { }

  ngOnInit(): void {
    this.sub = this.composerCoordinator.open$.subscribe(() => this.openPostPopup());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

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

  submitMobileSearch(): void {
    const q = this.mobileQuery.trim();
    this.searchQuery = q;
    this.queryMode = this.mobileQueryMode;
    this.mobileSearchVisible = false;
  }
}
