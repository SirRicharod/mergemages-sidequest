import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { Router } from '@angular/router';
import { ComposerCoordinatorService } from '../../services/composer-coordinator.service';
import { Reviews } from '../../reviews/reviews';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, Reviews],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  searchMode: 'requests' | 'offers' = 'requests';
  mobileSearchVisible = false;
  
  // Hiermee bepalen we of het menu zichtbaar is
  showAvatarMenu = false;

  // We bewaren de standaard "Initialen Avatar" in een variabele zodat we kunnen resetten
  defaultAvatar = 'https://ui-avatars.com/api/?name=Sage+Stockmans&background=0D8ABC&color=fff&size=150';

  user = {
    firstName: 'Sage',
    lastName: 'Stockmans',
    email: 'sage.stockmans@proton.me',
    points: 120,
    badges: ['Helper', 'Designer', 'Top Contributor'],
    bio: 'Creatieve duizendpoot met een passie voor 3D design en community building. Altijd in voor een SideQuest!',
    // We starten met de standaard avatar
    avatarUrl: '' 
  };

  constructor(private router: Router, private composerCoordinator: ComposerCoordinatorService) {
    // Bij het starten zetten we de avatar goed
    this.user.avatarUrl = this.defaultAvatar;
  }

  // Toggle het menu open of dicht
  toggleAvatarMenu(): void {
    this.showAvatarMenu = !this.showAvatarMenu;
  }

  // 1. Functie: Foto uploaden (roept de verborgen input aan)
  triggerUpload(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
    this.showAvatarMenu = false; // Menu sluiten na klikken
  }

  // Het verwerken van het bestand (de preview)
  onProfileImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 2. Functie: Foto verwijderen
  removePhoto(): void {
    // We zetten hem terug naar de standaard letters
    this.user.avatarUrl = this.defaultAvatar;
    this.showAvatarMenu = false; // Menu sluiten
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