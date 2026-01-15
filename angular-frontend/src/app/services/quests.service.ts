import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Sidequest } from '../components/feed/feed';

@Injectable({ providedIn: 'root' })
export class QuestsService {
    private auth = inject(AuthService);
    private readonly MAX_ACTIVE = 5;

    private _active = signal<Sidequest[]>([]);
    readonly active = computed(() => this._active());
    readonly count = computed(() => this._active().length);
    readonly canAccept = computed(() => this._active().length < this.MAX_ACTIVE);

    add(q: Sidequest): boolean {
        // block self-accept
        if (this.auth.currentUser()?.id?.toString() === q.authorUserId) return false;
        // cap
        if (!this.canAccept()) return false;
        // dedupe
        if (this._active().some(x => x.id === q.id)) return true;
        this._active.set([...this._active(), q]);
        return true;
    }

    remove(id: number): void {
        this._active.set(this._active().filter(x => x.id !== id));
    }

    clear(): void {
        this._active.set([]);
    }

    maxActive(): number {
        return this.MAX_ACTIVE;
    }
}
