import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { Router } from '@angular/router';
import { ComposerCoordinatorService } from '../../components/composer-coordinator.service';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class QuestsComponent {
  searchMode: 'requests' | 'offers' = 'requests';
  mobileSearchVisible = false;
  mobileQuery = '';
  mobileQueryMode: QueryMode = 'keywords';

  constructor(private router: Router, private composerCoordinator: ComposerCoordinatorService) { }

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }

  openPostPopup(): void {
    // Navigate to Home, then request composer open
    this.router.navigate(['/']).then(() => {
      this.composerCoordinator.requestOpen();
    });
  }
}
