// src/app/components/profile-card/profile-card.ts
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
  @Input() username = 'User';
  @Input() email = 'user@example.com';
  @Input() points = 0;
  @Input() badges: string[] = [];
}
