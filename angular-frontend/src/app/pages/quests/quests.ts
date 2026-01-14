// src/app/pages/quests/quests.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { Router } from '@angular/router';
import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { QuestsService } from '../../services/quests.service';

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
  mobileQueryMode: 'keywords' | 'profile' | 'skills' | 'tags' = 'keywords';

  private quests = inject(QuestsService);

  constructor(private router: Router, private composerCoordinator: ComposerCoordinatorService) { }

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }

  openPostPopup(): void {
    this.router.navigate(['/']).then(() => this.composerCoordinator.requestOpen());
  }

  // expose signals for template
  get active() { return this.quests.active(); }
  get max() { return this.quests.maxActive(); }
  remove(id: number) { this.quests.remove(id); }
}
