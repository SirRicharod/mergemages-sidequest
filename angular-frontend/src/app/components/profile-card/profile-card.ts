import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.css']
})
export class ProfileCardComponent {
  @Input() avatarUrl: string | null = null;
  @Input() username = '';
  @Input() email = '';
  @Input() points = 0;
  @Input() badges: string[] = [];

  // New: ongoing quests count (for a clean summary under points)
  @Input() ongoingQuests = 0;
}
