import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Detecta el idioma de la ruta actual
 * Extrae el prefijo de idioma de la URL (/es, /en, etc.)
 */
function getLocaleFromRoute(): string {
  if (typeof window === 'undefined') {
    return 'es'; // Default para SSR
  }
  
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(segment => segment);
  
  if (segments.length > 0 && (segments[0] === 'es' || segments[0] === 'en')) {
    return segments[0];
  }
  
  // Fallback a localStorage o default
  return localStorage.getItem('language') || 'es';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: getLocaleFromRoute() },
    provideRouter(
      routes,
      withRouterConfig({
        canceledNavigationResolution: 'computed'
      })
    )
  ]
};
