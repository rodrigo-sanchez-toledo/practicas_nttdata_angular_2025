const express = require('express');
const path = require('path');
const app = express();

const distPath = path.join(__dirname, 'dist/front_angular/browser');

// Middleware para servir archivos estáticos
app.use(express.static(distPath));

// Servir /en/* desde /en/
app.use('/en', express.static(path.join(distPath, 'en')));

// Servir /es/* desde /es/
app.use('/es', express.static(path.join(distPath, 'es')));

// Manejo de SPA routing - si la ruta no existe, servir index.html del locale correcto
app.use((req, res) => {
  const pathname = req.path;
  
  // Detectar locale de la ruta
  const segments = pathname.split('/').filter(s => s);
  let locale = 'es'; // default
  
  if (segments[0] === 'en' || segments[0] === 'es') {
    locale = segments[0];
  }
  
  // Servir el index.html correspondiente al locale
  const indexPath = path.join(distPath, locale, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving from: ${distPath}`);
});
