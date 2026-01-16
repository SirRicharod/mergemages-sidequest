import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show" role="alert" [class.border-success]="toast.type === 'success'"
             [class.border-danger]="toast.type === 'error'" [class.border-info]="toast.type === 'info'"
             [class.border-warning]="toast.type === 'warning'">
          <div class="toast-header" [class.bg-success]="toast.type === 'success'"
               [class.bg-danger]="toast.type === 'error'" [class.bg-info]="toast.type === 'info'"
               [class.bg-warning]="toast.type === 'warning'" [class.text-white]="toast.type !== 'warning'">
            @if (toast.type === 'success') {
              <i class="bi bi-check-circle-fill me-2"></i>
            } @else if (toast.type === 'error') {
              <i class="bi bi-x-circle-fill me-2"></i>
            } @else if (toast.type === 'warning') {
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
            } @else {
              <i class="bi bi-info-circle-fill me-2"></i>
            }
            <strong class="me-auto">
              @if (toast.type === 'success') { Success }
              @else if (toast.type === 'error') { Error }
              @else if (toast.type === 'warning') { Warning }
              @else { Info }
            </strong>
            <button type="button" class="btn-close btn-close-white" 
                    (click)="toastService.remove(toast.id)"></button>
          </div>
          <div class="toast-body">
            {{ toast.message }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast {
      min-width: 300px;
      margin-bottom: 0.5rem;
      display: block !important;
      opacity: 1 !important;
    }
    .toast-header {
      border-bottom: none;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
