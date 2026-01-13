import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { MobileSearchService } from './services/mobile-search.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  private mobileSearchService = inject(MobileSearchService);
  auth = inject(AuthService);
  openMobileSearch = () => this.mobileSearchService.requestOpen();
}