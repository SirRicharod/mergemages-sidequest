import { Component, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

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
  imports: [
    CommonModule,
    FormsModule,
    ProfileCardComponent,
    PostComposerComponent,
    FeedComponent,
    RightSidebarComponent,
    BottomNavComponent,
    MobileSearchComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private router = inject(Router);
  private composerCoordinator = inject(ComposerCoordinatorService);
  private mobileSearchService = inject(MobileSearchService);

  @ViewChild('composerRef') composerRef?: PostComposerComponent;
  @ViewChild('feedRef') feedRef?: FeedComponent;
  @ViewChild('mobileSearchRef') mobileSearchRef?: MobileSearchComponent;

  private subs = new Subscription();

  // Feed filters
  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;
  searchQuery = '';
  queryMode: QueryMode = 'keywords';

  // Example badges
  badges = ['Helper', 'Designer', 'Top Contributor'];

  ngOnInit(): void {
    // Open composer when requested globally
    this.subs.add(this.composerCoordinator.open$.subscribe(() => this.openPostPopup()));

    // Open mobile search when requested globally
    this.subs.add(this.mobileSearchService.open$.subscribe(() => this.mobileSearchRef?.open()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Composer popup controls
  openPostPopup(): void {
    this.composerRef?.togglePopup();
  }

  // Direct open (when already on Home)
  openMobileSearch(): void {
    this.mobileSearchRef?.open();
  }

  // Phone-mode search: navigate to Home first, then open the popup
  openMobileSearchFromNav(): void {
    const isOnHome = this.router.url === '/' || this.router.url.startsWith('/?');
    if (isOnHome) {
      this.mobileSearchRef?.open();
      return;
    }
    this.router.navigate(['/']).then(() => {
      const navSub = this.router.events.subscribe(evt => {
        if (evt instanceof NavigationEnd) {
          this.mobileSearchRef?.open();
          navSub.unsubscribe();
        }
      });
    });
  }

  // Post submission handler
  onSubmitPost(feed: FeedComponent, evt: {
    title: string;
    description: string;
    type: 'request' | 'offer';
    deadline: string | null;
    boost: boolean;
    xpReward: number;
  }): void {
    feed.addPost(evt.title, evt.description, evt.type, evt.xpReward);
  }

  // Filters
  toggleUrgent(): void { this.urgentOnly = !this.urgentOnly; }
  toggleSearchMode(): void { this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests'; }

  onSearchChange(evt: { query: string; mode: QueryMode }): void {
    this.searchQuery = evt.query;
    this.queryMode = evt.mode;
  }

  submitMobileSearch(evt: { query: string; mode: QueryMode }): void {
    this.onSearchChange(evt);
  }
}
