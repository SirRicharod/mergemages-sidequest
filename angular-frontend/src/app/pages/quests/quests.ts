import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { Router } from '@angular/router';
import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { PostsService, Post } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

type QueryMode = 'keywords' | 'profile' | 'skills' | 'tags';

interface QuestWithState extends Post {
  isCompleting?: boolean;
  isDeleting?: boolean;
  isCanceling?: boolean;
}

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class QuestsComponent implements OnInit {
  private postsService = inject(PostsService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  
  searchMode: 'requests' | 'offers' = 'requests';
  mobileSearchVisible = false;
  mobileQuery = '';
  mobileQueryMode: QueryMode = 'keywords';
  activeTab: 'ongoing' | 'completed' | 'created' = 'ongoing';

  loading = signal(false);
  allQuests = signal<QuestWithState[]>([]);
  
  get currentUserId(): string | undefined {
    return this.auth.currentUser()?.user_id;
  }

  // Quests that the current user has accepted (status: in_progress)
  ongoingQuests = computed(() => {
    const userId = this.currentUserId;
    if (!userId) return [];
    
    return this.allQuests().filter(quest => 
      (quest.accepted_user_id === userId || quest.author_user_id === userId) &&
      quest.status === 'in_progress'
    );
  });

  // Quests that are completed and involve the current user
  completedQuests = computed(() => {
    const userId = this.currentUserId;
    if (!userId) return [];
    
    return this.allQuests().filter(quest => 
      (quest.accepted_user_id === userId || quest.author_user_id === userId) &&
      quest.status === 'completed'
    );
  });

  // Quests created by the current user
  createdQuests = computed(() => {
    const userId = this.currentUserId;
    if (!userId) return [];
    
    return this.allQuests().filter(quest => 
      quest.author_user_id === userId
    );
  });

  constructor(private router: Router, private composerCoordinator: ComposerCoordinatorService) { }

  ngOnInit(): void {
    this.loadQuests();
  }

  loadQuests(): void {
    this.loading.set(true);
    this.postsService.getPosts().subscribe({
      next: (response) => {
        this.allQuests.set(response.posts.filter(p => p.status !== 'deleted'));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load quests:', err);
        this.loading.set(false);
      }
    });
  }

  completeQuest(quest: QuestWithState): void {
    if (!this.auth.currentUser()) {
      this.toast.warning('You must be logged in to complete a quest.');
      return;
    }

    if (quest.author_user_id !== this.currentUserId) {
      this.toast.error('Only the quest creator can mark it as completed.');
      return;
    }

    if (!confirm(`Mark "${quest.title}" as completed? This will award ${quest.bounty_points} XP to ${quest.accepter?.name || 'the accepter'}.`)) {
      return;
    }

    quest.isCompleting = true;

    this.postsService.completeQuest(quest.post_id).subscribe({
      next: (response) => {
        console.log('Quest completed:', response);
        quest.status = 'completed';
        quest.isCompleting = false;
        this.allQuests.update(quests => [...quests]);
        this.toast.success(`Quest completed! ${response.awarded_to?.name} earned ${response.quest.bounty_points} XP!`);
      },
      error: (err) => {
        console.error('Failed to complete quest:', err);
        quest.isCompleting = false;
        this.allQuests.update(quests => [...quests]);
        
        if (err.status === 403) {
          this.toast.error(err.error?.message || 'Only the quest creator can mark it as completed.');
        } else if (err.status === 400) {
          this.toast.error(err.error?.message || 'Quest cannot be completed at this time.');
        } else if (err.status === 401) {
          this.toast.error('Your session has expired. Please log in again.');
        } else {
          this.toast.error('Failed to complete quest. Please try again.');
        }
      }
    });
  }

  cancelQuest(quest: QuestWithState): void {
    if (!this.auth.currentUser()) {
      this.toast.warning('You must be logged in to cancel a quest.');
      return;
    }

    if (quest.accepted_user_id !== this.currentUserId) {
      this.toast.error('Only the accepter can cancel a quest.');
      return;
    }

    if (!confirm(`Cancel "${quest.title}"? This will allow others to accept it again.`)) {
      return;
    }

    quest.isCanceling = true;

    this.postsService.cancelQuest(quest.post_id).subscribe({
      next: (response) => {
        console.log('Quest canceled:', response);
        // Remove from local ongoing list
        this.allQuests.update(quests => quests.filter(q => q.post_id !== quest.post_id));
        this.toast.info('Quest canceled. It is now available for others to accept.');
      },
      error: (err) => {
        console.error('Failed to cancel quest:', err);
        quest.isCanceling = false;
        this.allQuests.update(quests => [...quests]);
        
        if (err.status === 403) {
          this.toast.error(err.error?.message || 'Only the accepter can cancel a quest.');
        } else if (err.status === 400) {
          this.toast.error(err.error?.message || 'Cannot cancel this quest.');
        } else if (err.status === 401) {
          this.toast.error('Your session has expired. Please log in again.');
        } else {
          this.toast.error('Failed to cancel quest. Please try again.');
        }
      }
    });
  }
  deleteQuest(quest: QuestWithState): void {
    if (!this.auth.currentUser()) {
      this.toast.warning('You must be logged in to delete a quest.');
      return;
    }

    if (quest.author_user_id !== this.currentUserId) {
      this.toast.error('Only the quest creator can delete it.');
      return;
    }

    if (quest.status !== 'created') {
      this.toast.error('Cannot delete a quest that has been accepted or completed.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${quest.title}"? This action cannot be undone.`)) {
      return;
    }

    quest.isDeleting = true;

    this.postsService.deleteQuest(quest.post_id).subscribe({
      next: (response) => {
        console.log('Quest deleted:', response);
        // Remove from local list by filtering it out
        this.allQuests.update(quests => quests.filter(q => q.post_id !== quest.post_id));
        this.toast.success('Quest deleted successfully!');
      },
      error: (err) => {
        console.error('Failed to delete quest:', err);
        quest.isDeleting = false;
        this.allQuests.update(quests => [...quests]);
        
        if (err.status === 403) {
          this.toast.error(err.error?.message || 'Only the quest creator can delete it.');
        } else if (err.status === 400) {
          this.toast.error(err.error?.message || 'Cannot delete this quest.');
        } else if (err.status === 401) {
          this.toast.error('Your session has expired. Please log in again.');
        } else {
          this.toast.error('Failed to delete quest. Please try again.');
        }
      }
    });
  }

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
