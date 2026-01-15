import { Component, ViewChild, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from '../../components/profile-card/profile-card';
import { PostComposerComponent } from '../../components/post-composer/post-composer';
import { FeedComponent } from '../../components/feed/feed';
import { RightSidebarComponent } from '../../components/search-sidebar/search-sidebar';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { MobileSearchComponent } from '../../components/mobile-search/mobile-search';
import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { MobileSearchService } from '../../services/mobile-search.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

type QueryMode = 'keywords' | 'profile' | 'skills';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileCardComponent, PostComposerComponent, FeedComponent, RightSidebarComponent, BottomNavComponent, MobileSearchComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  
  @ViewChild('composerRef') composerRef?: PostComposerComponent;
  @ViewChild('feedRef') feedRef?: FeedComponent;
  @ViewChild('mobileSearchRef') mobileSearchRef?: MobileSearchComponent;

  mobileSearchOpen = () => this.mobileSearchRef?.open();

  private sub?: Subscription;

  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;
  searchQuery = '';
  queryMode: QueryMode = 'keywords';

  badges = ['Helper', 'Designer', 'Top Contributor'];

  constructor(
    private composerCoordinator: ComposerCoordinatorService,
    private mobileSearchService: MobileSearchService
  ) { }

  ngOnInit(): void {
    this.sub = new Subscription();
    this.sub.add(this.composerCoordinator.open$.subscribe(() => this.openPostPopup()));
    this.sub = this.mobileSearchService.open$.subscribe(() => this.mobileSearchRef?.open());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  openPostPopup(): void {
    this.composerRef?.togglePopup();
  }

  openMobileSearch(): void {
    this.mobileSearchRef?.open();
  }

  onSubmitPost(feed: FeedComponent, evt: {
    title: string; description: string; type: 'request' | 'offer';
    deadline: string | null; boost: boolean; xpReward: number;
  }) {
    feed.addPost(evt.title, evt.description, evt.type, evt.xpReward);
  }

  toggleUrgent(): void { this.urgentOnly = !this.urgentOnly; }
  toggleSearchMode(): void { this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests'; }

  onSearchChange(evt: { query: string; mode: QueryMode }) {
    this.searchQuery = evt.query;
    this.queryMode = evt.mode;
  }

  submitMobileSearch(evt: { query: string; mode: QueryMode }) {
    this.onSearchChange(evt);
  }
}
