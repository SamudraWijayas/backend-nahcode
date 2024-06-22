import { query } from "../database/db.js";
import Users from "../model/UsersModel.js";

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Mohon Login ke akun anda" });
    }

    try {
        const user = await Users.findOne(req.session.userId);
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        req.user = user; // Tambahkan objek user ke dalam req
        next();
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
}

export const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) return res.status(404).json({ msg: "User tidak ditemukan" });
        if (req.user.role !== "admin") return res.status(403).json({ msg: "Akses terlarang" });

        next();
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
}
