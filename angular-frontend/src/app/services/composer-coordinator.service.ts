import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComposerCoordinatorService {
  private _open = new Subject<void>();
  readonly open$ = this._open.asObservable();

  requestOpen(): void {
    this._open.next();
  }
}