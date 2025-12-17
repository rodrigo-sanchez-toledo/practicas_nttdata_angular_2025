# Angular i18n Migration Guide - From ngx-translate to Angular Native i18n

## Overview
This project has been successfully migrated from **ngx-translate** to **Angular's Native i18n system**. The migration provides better performance, smaller bundle sizes, and native Angular support.

## What Changed

### 1. **Removed Dependencies**
- `@ngx-translate/core` - Removed
- `@ngx-translate/http-loader` - Removed

The project now uses Angular's built-in i18n support which is included in `@angular/localize`.

### 2. **App Component (app.ts)**
**Before:**
```typescript
import { TranslateService } from '@ngx-translate/core';

export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('language') || 'es';
    this.translate.use(savedLang);
  }
}
```

**After:**
```typescript
export class AppComponent {}
```

The app component is now simplified since language management is handled by Angular's routing and build system.

### 3. **Translation Files Structure**

#### Base Translation File (Spanish - Source)
- **Location:** `front_angular/messages.xlf`
- **Format:** XLIFF 1.2 (XML Localization Interchange File Format)
- **Source Language:** Spanish (es)

#### Localized Translation Files
- **English Translation:** `src/locale/messages.en.xlf`
- **Format:** XLIFF 1.2
- **Contains:** English translations with source Spanish text for reference

### 4. **Template Changes**
All templates already use Angular's native i18n syntax:

```html
<!-- Marked for translation with unique ID -->
<h1 i18n="@@home.title">Bienvenido a la página principal</h1>
<label i18n="@@form.nombre">Nombre:</label>
```

The `i18n="@@key"` attribute marks text for translation. The `@@` prefix ensures a stable custom ID.

### 5. **Angular Configuration (angular.json)**
```json
{
  "i18n": {
    "sourceLocale": "es",
    "locales": {
      "en": {
        "translation": "src/locale/messages.en.xlf",
        "baseHref": ""
      }
    }
  },
  "architect": {
    "build": {
      "options": {
        "localize": true,
        "polyfills": ["@angular/localize/init"]
      },
      "configurations": {
        "es": { "localize": ["es"] },
        "en": { "localize": ["en"] }
      }
    },
    "serve": {
      "configurations": {
        "es": { "buildTarget": "front_angular:build:es" },
        "en": { "buildTarget": "front_angular:build:en" }
      }
    }
  }
}
```

### 6. **Language Switcher Component**
The `LanguageSwitcherComponent` remains in place but now navigates to locale-prefixed routes:

```typescript
onLanguageChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const language = target.value;
  
  this.currentLanguage = language;
  localStorage.setItem('language', language);
  
  // Navigate to locale-prefixed route
  window.location.href = `/${language}`;
}
```

## Building and Serving

### Development

**Serve Spanish version (default):**
```bash
npm start
# or
ng serve
```

**Serve English version:**
```bash
ng serve --configuration=en
```

**Serve Spanish version explicitly:**
```bash
ng serve --configuration=es
```

### Production

**Build all locales:**
```bash
npm run build
# or
ng build
```

Output structure:
```
dist/
├── es/              # Spanish version (main)
│   ├── index.html
│   ├── main.js
│   └── ...
└── en/              # English version
    ├── index.html
    ├── main.js
    └── ...
```

**Build specific locale:**
```bash
ng build --configuration=es
ng build --configuration=en
```

## Translation Workflow

### 1. **Extracting Translations**
When you add new i18n-marked content:
```bash
ng extract-i18n
```

This generates/updates `messages.xlf` with new strings.

### 2. **Translating to New Languages**

1. Copy `messages.xlf` to `src/locale/messages.{lang}.xlf`
2. Update the `target-language` attribute in the file header
3. Translate all `<target>` elements
4. Add configuration to `angular.json`:

```json
"locales": {
  "fr": {
    "translation": "src/locale/messages.fr.xlf",
    "baseHref": ""
  }
}
```

### 3. **Updating Existing Translations**
- Edit the `.xlf` files directly in the `<target>` elements
- Do NOT modify `<source>` elements (they're auto-generated)
- The IDs (e.g., `home.title`) help identify strings across locales

## File Structure

```
front_angular/
├── messages.xlf                    # Base Spanish translation (auto-generated)
├── src/
│   ├── locale/
│   │   └── messages.en.xlf        # English translations
│   ├── app/
│   │   ├── features/
│   │   │   ├── about/
│   │   │   │   └── about.html     # Contains i18n attributes
│   │   │   ├── form-reactivo/
│   │   │   │   └── form-reactivo.html
│   │   │   ├── home/
│   │   │   │   └── home.html
│   │   │   └── products/
│   │   │       └── products.html
│   │   ├── app.ts                # No longer uses TranslateService
│   │   └── ...
│   └── main.ts                   # Includes @angular/localize reference
├── angular.json                  # i18n configuration
└── package.json                  # No ngx-translate dependencies
```

## Key Benefits

✅ **Smaller Bundle Size** - No external translation library needed
✅ **Better Performance** - Build-time translation, no runtime overhead
✅ **Native Angular Support** - Official Angular feature
✅ **Type Safety** - Works well with TypeScript
✅ **Separation by Build** - Each locale gets its own optimized build
✅ **Simpler Architecture** - No service management needed

## Dynamic Translation (if needed)

For runtime translation needs (e.g., translating API responses), you can still use a service-based approach:

```typescript
import { Injectable } from '@angular/core';
import { LOCALE_ID, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations: Record<string, Record<string, string>> = {
    es: { /* Spanish translations */ },
    en: { /* English translations */ }
  };

  constructor(@Inject(LOCALE_ID) private localeId: string) {}

  translate(key: string): string {
    return this.translations[this.localeId]?.[key] || key;
  }
}
```

## Troubleshooting

### Issue: Build fails with localization error
**Solution:** Ensure all `i18n` attributes have stable IDs:
```html
<!-- ✅ Correct -->
<h1 i18n="@@home.title">Title</h1>

<!-- ❌ Incorrect -->
<h1 i18n>Title</h1>
```

### Issue: Translations not appearing
**Solution:** Verify translation file has correct locale ID:
- Spanish: `source-language="es"` (no target-language)
- English: `target-language="en"`

### Issue: Routes not switching locale
**Solution:** Ensure language-switcher routes to `/{locale}` and the build is configured with `localize: true`.

## Next Steps

1. Test the application in both Spanish and English
2. Deploy separate builds for each locale or use dynamic locale loading
3. Consider adding more locales following the same pattern
4. Monitor bundle sizes in production

## Additional Resources

- [Angular i18n Official Documentation](https://angular.io/guide/i18n-overview)
- [XLIFF Format Specification](http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html)
- [Angular Build Configuration](https://angular.io/cli/build)
