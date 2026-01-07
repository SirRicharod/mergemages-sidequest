import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * HTTP Interceptor to add authentication token to requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Only access localStorage in browser
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // Clone the request and add the authorization header
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest);
    }
  }
  
  return next(req);
};
