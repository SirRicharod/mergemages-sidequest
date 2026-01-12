import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { Router } from '@angular/router';
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
    private composerCoordinator: ComposerCoordinatorService,
    private http: HttpClient,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.http.get<any>('http://127.0.0.1:8000/api/profile').subscribe({
      next: (response) => {
        // We gebruiken setTimeout om de update UIT de huidige check-cyclus te halen.
        // Dit lost de NG0100 fout op!
        setTimeout(() => {
            const data = response.user;
            const fullName = data.name || 'Gebruiker';
            const parts = fullName.split(' ');

            this.user = {
                firstName: parts[0],
                lastName: parts.slice(1).join(' '),
                email: data.email,
                points: data.points || 0,
                badges: data.badges || [],
                bio: data.bio || '',
                // Als de URL null is, pakken we de default
                avatarUrl: data.avatar_url ? data.avatar_url : this.defaultAvatar
            };

            // Nu de browser rustig is, updaten we het scherm
            this.cd.markForCheck(); 
            this.cd.detectChanges();
        }, 0); 
      },
      error: (err) => {
        console.error('Fout:', err);
        // Ook bij een fout wachten we even om de crash te voorkomen
        setTimeout(() => {
            this.user.firstName = 'Gast';
            this.cd.detectChanges();
        }, 0);
      }
    });
  }

  toggleAvatarMenu(): void {
    this.showAvatarMenu = !this.showAvatarMenu;
  }

  triggerUpload(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
    this.showAvatarMenu = false;
  }

  onProfileImageChange(event: any): void {
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
           // Ook hier veilig updaten
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
    this.user.avatarUrl = this.defaultAvatar;
    this.showAvatarMenu = false;
  }

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === 'requests' ? 'offers' : 'requests';
  }

  openPostPopup(): void {
    this.router.navigate(['/']).then(() => {
      this.composerCoordinator.requestOpen();
    });
  }
}