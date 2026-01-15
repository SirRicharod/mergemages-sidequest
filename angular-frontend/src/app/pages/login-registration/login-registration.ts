import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-registration.html',
  styleUrl: './login-registration.css',
})
export class LoginRegistration {
  // Toggle between login and register
  isLoginMode = signal(true);
  
  // Form data
  loginData = {
    email: '',
    password: ''
  };
  
  registerData = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };
  
  // UI state
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  // Password visibility toggles
  showLoginPassword = signal(false);
  showRegisterPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Toggle between login and registration forms
   */
  toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
    this.clearMessages();
    // Clear registration data when switching to login mode
    if (this.isLoginMode()) {
      this.clearRegisterData();
    }
  }

  /**
   * Toggle password visibility
   */
  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword.update(show => !show);
  }

  toggleRegisterPasswordVisibility(): void {
    this.showRegisterPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }

  /**
   * Handle login form submission
   */
  onLogin(): void {
    this.clearMessages();
    this.loading.set(true);

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set('Login successful!');
        // Redirect to home or dashboard after 500ms
        setTimeout(() => this.router.navigate(['/']), 500);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  /**
   * Handle registration form submission
   */
  onRegister(): void {
    this.clearMessages();
    
    // Client-side validation
    if (this.registerData.password !== this.registerData.passwordConfirmation) {
      this.errorMessage.set('Passwords do not match!');
      return;
    }
    
    if (this.registerData.password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long!');
      return;
    }
    
    this.loading.set(true);

    this.authService.register(
      this.registerData.name,
      this.registerData.email,
      this.registerData.password,
      this.registerData.passwordConfirmation
    ).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set('Registration successful! Please login.');
        const registeredEmail = this.registerData.email;
        this.clearRegisterData();
        // Switch to login mode after 1.5 seconds
        setTimeout(() => {
          this.isLoginMode.set(true);
          this.loginData.email = registeredEmail;
          this.clearMessages();
        }, 1500);
      },
      error: (error) => {
        this.loading.set(false);
        const errorMsg = error.error?.message || 'Registration failed. Please try again.';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  /**
   * Clear all messages
   */
  private clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  /**
   * Clear registration form data
   */
  private clearRegisterData(): void {
    this.registerData = {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    };
  }
}
