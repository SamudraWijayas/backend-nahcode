import argon2 from "argon2";
import Users from "../model/UsersModel.js";

export const Login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ msg: "Email dan password harus diisi" });
  }

  try {
    const user = await Users.findByEmail(email); // Menggunakan findByEmail untuk mencari berdasarkan email
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const { id, name, role, avatar } = user;
    req.session.userId = id;
    req.session.cookie.maxAge = 2 * 60 * 60 * 1000; // Set maxAge to 2 hours

    res.status(200).json({ id: id, name: name, email: email, role: role, avatar: avatar });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.toString() });
  }
};

export const Me = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda" });
  }

  try {
    const user = await Users.findOne(userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const { id, name, email, role, avatar } = user;
    res.status(200).json({ id, name, email, role, avatar });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(400)
        .json({ msg: "Tidak dapat logout", error: err.message });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
// export const Register = async (req, res) => {
//     const { name, email, password, role } = req.body;

//     // Validasi input
//     if (!name || !email || !password || !role) {
//         return res.status(400).json({ msg: "Semua bidang harus diisi" });
//     }

//     try {
//         const existingUser = await Users.findByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({ msg: "Email sudah terdaftar" });
//         }

//         const hashedPassword = await argon2.hash(password);
//         await Users.create(name, email, hashedPassword, role);

//         res.status(201).json({ msg: "Registrasi berhasil" });
//     } catch (error) {
//         res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.toString() });
//     }
// };

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password tidak cocok" });
  }

  try {
    // Cek apakah email sudah digunakan
    const existingUser = await Users.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah digunakan" });
    }

    const hashPassword = await argon2.hash(password);
    const role = "user"; // Set role default sebagai user
    await Users.create(name, email, hashPassword, role);
    res.status(201).json({ msg: "Registrasi berhasil" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};
