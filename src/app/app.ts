import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LanguageSwitcherComponent],
  template: `
    <app-language-switcher></app-language-switcher>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
