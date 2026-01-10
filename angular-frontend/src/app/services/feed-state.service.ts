import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FeedMode = 'requests' | 'offers';

@Injectable({ providedIn: 'root' })
export class FeedStateService {
  readonly mode$ = new BehaviorSubject<FeedMode>('requests');

  toggle(): void {
    this.mode$.next(this.mode$.value === 'requests' ? 'offers' : 'requests');
  }

  set(mode: FeedMode): void {
    this.mode$.next(mode);
  }
}
