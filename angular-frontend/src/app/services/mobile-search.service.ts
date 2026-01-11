import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class MobileSearchService {
    private _open = new Subject<void>();
    open$ = this._open.asObservable();
    requestOpen() { this._open.next(); }
}