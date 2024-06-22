// Import modul yang diperlukan
import express from "express";
import { Login, logout, Me, Register } from "../controller/Auth.js";

const router = express.Router();

// Gunakan POST untuk operasi login
router.get("/me", Me);
router.post("/login", Login);
router.delete("/logout", logout);
router.post("/register", Register); // Tambahkan ini untuk registrasi

export default router;
