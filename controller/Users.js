import Users from "../model/UsersModel.js";
import argon2 from "argon2";
import fs from 'fs'; // Import module fs untuk manipulasi file

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const getUsersForComment = async (req, res) => {
    try {
        const response = await Users.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUsersById = async (req, res) => {
    try {
        const response = await Users.findOne(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createUsers = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password tidak cocok" });
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create(name, email, hashPassword, role);
        res.status(201).json({ msg: "Register berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    const id = req.params.id;
    let hashPassword;
    if (password === "" || password === null) {
        const user = await Users.findOne(id);
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword) return res.status(400).json({ msg: "Password tidak cocok" });

    const avatar = req.file ? `/uploads/profil/${req.file.filename}` : null;

    try {
        const user = await Users.findOne(id);
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        // Hapus avatar lama jika ada dan update avatar baru
        if (avatar && user.avatar) {
            try {
                fs.unlinkSync(`.${user.avatar}`);
            } catch (err) {
                console.error("Failed to delete old avatar:", err);
            }
        }

        // Update user dengan data baru termasuk avatar (jika ada)
        await Users.update(id, name, email, hashPassword, role, avatar || user.avatar);
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        // Jika terjadi error, hapus avatar yang telah di-upload
        if (avatar) {
            try {
                fs.unlinkSync(`.${avatar}`);
            } catch (err) {
                console.error("Failed to delete uploaded avatar:", err);
            }
        }
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Users.findOne(id);
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        // Hapus avatar terkait sebelum menghapus user
        if (user.avatar) {
            try {
                fs.unlinkSync(`.${user.avatar}`);
            } catch (err) {
                console.error("Failed to delete avatar:", err);
            }
        }

        await Users.delete(id);
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

