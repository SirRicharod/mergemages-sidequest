import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComposerCoordinatorService {
  // Emits each time any page requests to open the composer
  private _openRequests = new BehaviorSubject<number>(0);
  readonly openRequests$ = this._openRequests.asObservable();

  requestOpen(): void {
    this._openRequests.next(Date.now());
  }
}
