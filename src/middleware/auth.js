export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Acceso denegado. Solo disponible para rol: ${role}` });
    }
    next();
  };
};