import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <label for="language-select">Idioma / Language:</label>
      <select id="language-select" [value]="currentLanguage" (change)="onLanguageChange($event)">
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      <span class="current-lang">Actual: {{ currentLanguage }}</span>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    label {
      font-weight: 600;
      font-size: 14px;
    }
    
    select {
      padding: 6px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    select:hover {
      border-color: #999;
    }

    .current-lang {
      font-size: 12px;
      color: #666;
    }
  `]
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage: string = 'es';

  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener idioma actual desde la ruta o localStorage
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    if (pathSegments.length > 0 && (pathSegments[0] === 'es' || pathSegments[0] === 'en')) {
      this.currentLanguage = pathSegments[0];
    } else {
      const savedLanguage = localStorage.getItem('language');
      this.currentLanguage = savedLanguage || 'es';
    }
    
    localStorage.setItem('language', this.currentLanguage);
    console.log('Idioma inicial:', this.currentLanguage);
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const language = target.value;
    
    console.log('Cambiando idioma a:', language);
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    
    // Recargar la página con el nuevo idioma
    // En i18n, es necesario recargar para cambiar el locale
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    // Remover el idioma anterior si existe
    if (pathSegments[0] === 'es' || pathSegments[0] === 'en') {
      pathSegments.shift();
    }
    
    // Construir la nueva URL con el nuevo idioma
    const newPath = `/${language}/${pathSegments.join('/')}`;
    window.location.href = newPath;
  }
}
