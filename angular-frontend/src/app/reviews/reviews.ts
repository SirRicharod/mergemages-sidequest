import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../services/review'; 

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class Reviews {
  rating: number = 5;
  comment: string = '';
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Hier injecteren we de tools die we nodig hebben
  constructor(
    private reviewService: ReviewService, 
    private cdr: ChangeDetectorRef
  ) {}

  submitReview() {
    // 1. Start het verzenden
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const targetUserId = 'a0ce6cd7-da41-4b1f-83ea-4e089b5114e5'; 

    const data = {
      target_user_id: targetUserId,
      rating: this.rating,
      comment: this.comment
    };

    console.log('Versturen...', data);

    this.reviewService.postReview(data).subscribe({
      next: (res) => {
        console.log('Gelukt!', res);
        
        // 2. Update de status
        this.successMessage = 'Review geplaatst! 🎉';
        this.comment = ''; 
        this.isSubmitting = false;

        // 3. Vertel Angular dat het scherm ververst moet worden
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Foutje:', err);
        this.errorMessage = 'Er ging iets mis. Ben je wel ingelogd?';
        this.isSubmitting = false;

        // Ook bij een fout het scherm updaten om de foutmelding te tonen
        this.cdr.detectChanges();
      }
    });
  }
}