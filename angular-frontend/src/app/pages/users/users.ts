import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, BottomNavComponent],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private composerCoordinator = inject(ComposerCoordinatorService);

  users: any[] = [];
  selectedUser: any = null;
  isSingleProfile = false;
  loading = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.isSingleProfile = true;
        this.selectedUser = null;
        this.loading = true;
        this.cdr.detectChanges();
        this.loadUserProfile(userId);
      } else {
        this.isSingleProfile = false;
        this.loading = true;
        this.fetchUsers();
      }
    });
  }

  openPostFromNav(): void {
    const isOnHome = this.router.url === '/' || this.router.url.startsWith('/?');
    if (isOnHome) {
      this.composerCoordinator.requestOpen();
      return;
    }
    this.router.navigate(['/']).then(() => {
      const sub = this.router.events.subscribe(evt => {
        if (evt instanceof NavigationEnd) {
          this.composerCoordinator.requestOpen();
          sub.unsubscribe();
        }
      });
    });
  }

  loadUserProfile(id: string) {
    this.userService.getUserProfile(id).subscribe({
      next: (response: any) => {
        this.selectedUser = response.user || response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fout:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchUsers() {
    this.http.get<any>('http://127.0.0.1:8000/api/users').subscribe({
      next: (response) => {
        this.users = response.users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
