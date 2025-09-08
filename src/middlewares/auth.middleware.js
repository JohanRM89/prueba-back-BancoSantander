import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token de acceso requerido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Usuario no válido" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

    const hasPermission = roles.some((r) => userRoles.includes(r));
    if (!hasPermission) {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción",
      });
    }
    next();
  };
};
