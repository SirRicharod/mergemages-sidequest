import { Component, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileCardComponent } from '../../components/profile-card/profile-card';
import { PostComposerComponent } from '../../components/post-composer/post-composer';
import { FeedComponent } from '../../components/feed/feed';
import { RightSidebarComponent } from '../../components/search-sidebar/search-sidebar';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';

import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

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
    BottomNavComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private composerCoordinator = inject(ComposerCoordinatorService);

  @ViewChild('composerRef') composerRef?: PostComposerComponent;
  @ViewChild('feedRef') feedRef?: FeedComponent;

  private subs = new Subscription();

  // Feed filters
  searchMode: 'requests' | 'offers' = 'requests';
  urgentOnly = false;

  // Example badges
  badges = ['Helper', 'Designer', 'Top Contributor'];

  ngOnInit(): void {
    // Open composer when requested globally
    this.subs.add(this.composerCoordinator.open$.subscribe(() => this.openPostPopup()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Composer popup controls
  openPostPopup(): void {
    this.composerRef?.togglePopup();
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
}
