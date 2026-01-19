import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  // The URL to your Laravel backend
  private apiUrl = 'http://localhost:8000/api/reviews';

  constructor(private http: HttpClient) { }

  postReview(reviewData: any): Observable<any> {
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, reviewData, { headers });
  }
}