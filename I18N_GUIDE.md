# Internacionalización (i18n) con ngx-translate

## Descripción

La aplicación Angular ahora soporta internacionalización con **ngx-translate**, permitiendo a los usuarios cambiar entre español (es) e inglés (en).

## Características

- ✅ Cambio de idioma dinámico sin recargar la página
- ✅ Persistencia del idioma seleccionado en localStorage
- ✅ Selector de idioma visual en la interfaz
- ✅ Traducciones para:
  - Navegación
  - Página de inicio
  - Formulario reactivo
  - Mensajes de error
  - Mensajes de validación

## Archivos Principales

### Archivos de Traducción (JSON)
- `src/assets/i18n/es.json` - Traducciones al español
- `src/assets/i18n/en.json` - Traducciones al inglés

### Servicio i18n
- `src/app/core/services/i18n.service.ts` - Maneja la lógica de traducción

### Componentes Actualizados
- `src/app/app.ts` - Incluye el inicializador de i18n
- `src/app/app.html` - Agregado el selector de idioma
- `src/app/features/home/home.ts` - Usa TranslateModule
- `src/app/features/form-reactivo/form-reactivo.ts` - Usa TranslateModule
- `src/app/shared/form-errors/form-errors.ts` - Usa TranslateModule

### Componente Selector de Idioma
- `src/app/shared/language-switcher/language-switcher.ts` - Componente para cambiar idioma

## Configuración

### app.config.ts
```typescript
provideHttpClient(),
TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
}).providers || []
```

## Uso en Templates

### Pipe de Traducción
```html
<!-- Traducción simple -->
<h1>{{ 'home.title' | translate }}</h1>

<!-- Con parámetros (si se necesitan) -->
<p>{{ 'form.success' | translate }}</p>
```

### Traducción en TypeScript
```typescript
this.translateService.get('form.success').subscribe(message => {
  alert(message);
});

// O de forma inmediata
const message = this.translateService.instant('form.unsaved');
```

## Agregar Nuevas Traducciones

1. **Edita los archivos JSON en `src/assets/i18n/`:**
   ```json
   {
     "nueva_seccion": {
       "clave": "Valor en español"
     }
   }
   ```

2. **Usa en el template:**
   ```html
   {{ 'nueva_seccion.clave' | translate }}
   ```

## Agregar Nuevo Idioma

1. **Crea un nuevo archivo JSON:**
   - `src/assets/i18n/fr.json` (para francés, por ejemplo)

2. **Actualiza I18nService:**
   ```typescript
   this.translateService.addLanguages(['es', 'en', 'fr']);
   ```

3. **Actualiza los métodos:**
   ```typescript
   getAvailableLanguages(): string[] {
     return ['es', 'en', 'fr'];
   }

   getLanguageLabel(language: string): string {
     const labels: Record<string, string> = {
       'es': 'Español',
       'en': 'English',
       'fr': 'Français'
     };
     return labels[language] || language;
   }
   ```

## Estructura de Traducciones

```json
{
  "nav": {
    "home": "Texto del menú"
  },
  "home": {
    "title": "Título de la página"
  },
  "form": {
    "title": "Título del formulario",
    "nombre": "Etiqueta del campo"
  },
  "errors": {
    "required": "Mensaje de error"
  }
}
```

## Persistencia

El idioma seleccionado se guarda automáticamente en `localStorage` con la clave `language`, por lo que se mantiene la preferencia del usuario incluso después de recargar la página.

## Componente Selector de Idioma

El componente `LanguageSwitcherComponent` proporciona una interfaz visual para cambiar el idioma. Se muestra en la parte superior de la aplicación.

```html
<app-language-switcher></app-language-switcher>
```

## Testing

Los tests necesitan ser actualizados para manejar las traducciones. Se recomienda usar `TranslateTestingModule` para tests.
