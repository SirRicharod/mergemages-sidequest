import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { MobileSearchService } from './services/mobile-search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  private mobileSearchService = inject(MobileSearchService);

  // Provide a callback function for Navbar Input
  openMobileSearch = () => {
    this.mobileSearchService.requestOpen();
  };
}
