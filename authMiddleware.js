// Crear un archivo authMiddleware.js
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next(); // Usuario autenticado
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
};

module.exports = isAuthenticated;