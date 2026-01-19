import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { Router, ActivatedRoute } from '@angular/router'; // <--- ActivatedRoute toegevoegd
import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { Reviews } from '../../reviews/reviews';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, Reviews],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  searchMode: 'requests' | 'offers' = 'requests';
  mobileSearchVisible = false;
  showAvatarMenu = false;

  // NEW: Tracks whether we're looking at ourselves or someone else
  isOwnProfile: boolean = true; 
  currentUserId: string | null = null; // Useful to pass to the Reviews component later

  defaultAvatar = 'https://ui-avatars.com/api/?name=Sage+Stockmans&background=0D8ABC&color=fff&size=150';

  user: any = {
    firstName: 'Laden...', 
    lastName: '',
    email: '',
    points: 0,
    badges: [],
    bio: '',
    avatarUrl: this.defaultAvatar 
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute, // <--- Injecteren om URL te lezen
    private composerCoordinator: ComposerCoordinatorService,
    private http: HttpClient,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    // 1. Check if there's an ID in the URL (e.g. /profile/12)
    const userIdFromUrl = this.route.snapshot.paramMap.get('id');

    if (userIdFromUrl) {
      // SITUATION A: We're visiting someone else
      this.isOwnProfile = false;
      this.currentUserId = userIdFromUrl;
      this.fetchOtherUser(userIdFromUrl);
    } else {
      // SITUATION B: We're visiting our own profile
      this.isOwnProfile = true;
      this.fetchMyProfile();
    }
  }

  // --- FETCH OWN PROFILE ---
  fetchMyProfile() {
    this.http.get<any>('http://127.0.0.1:8000/api/profile').subscribe({
      next: (response) => {
        this.updateUserData(response.user);
      },
      error: (err) => this.handleError(err)
    });
  }

  // --- FETCH OTHER PROFILE ---
  fetchOtherUser(id: string) {
    this.http.get<any>(`http://127.0.0.1:8000/api/users/${id}`).subscribe({
      next: (user) => {
        this.updateUserData(user);
      },
      error: (err) => this.handleError(err)
    });
  }

  // --- GENERAL FUNCTION TO PROCESS DATA ---
  // This prevents us from having to write the same code twice
  updateUserData(data: any) {
    setTimeout(() => {
        const fullName = data.name || 'Gebruiker';
        const parts = fullName.split(' ');

        this.user = {
            firstName: parts[0],
            lastName: parts.slice(1).join(' '),
            email: data.email,
            points: data.points || 0,
            badges: data.badges || [],
            bio: data.bio || '',
            // Avatar URL or default
            avatarUrl: data.avatar_url ? data.avatar_url : this.defaultAvatar
        };

        // If we're on our own profile, save our ID (if the backend returns it)
        if (this.isOwnProfile && data.user_id) {
            this.currentUserId = data.user_id;
        }

        this.cd.markForCheck(); 
        this.cd.detectChanges();
    }, 0); 
  }

  handleError(err: any) {
    console.error('Error loading profile:', err);
    setTimeout(() => {
        this.user.firstName = 'Unknown';
        this.user.lastName = 'Adventurer';
        this.cd.detectChanges();
    }, 0);
  }

  // --- AVATAR FUNCTIONS ---

  toggleAvatarMenu(): void {
    // Security: You can't open the menu on someone else's profile
    if (!this.isOwnProfile) return;
    this.showAvatarMenu = !this.showAvatarMenu;
  }

  triggerUpload(): void {
    if (!this.isOwnProfile) return;
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
    this.showAvatarMenu = false;
  }

  onProfileImageChange(event: any): void {
    if (!this.isOwnProfile) return; // Extra check

    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatarUrl = e.target.result;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);

      this.http.post<any>('http://127.0.0.1:8000/api/user/avatar', formData).subscribe({
        next: (response) => {
           setTimeout(() => {
               this.user.avatarUrl = response.avatar_url;
               this.cd.detectChanges();
           }, 0);
        },
        error: (err) => console.error(err)
      });
    }
  }

  removePhoto(): void {
    if (!this.isOwnProfile) return;
    this.user.avatarUrl = this.defaultAvatar;
    this.showAvatarMenu = false;
  }

  // --- OVERIGE FUNCTIES ---

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }

  openPostPopup(): void {
    this.router.navigate(['/']).then(() => {
      this.composerCoordinator.requestOpen();
    });
  }
}