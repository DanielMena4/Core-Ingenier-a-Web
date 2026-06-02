const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 8);

        await db.query(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );

        res.json({ message: 'Usuario registrado correctamente' });

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [results] = await db.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (!results.length)
            return res.status(404).json({ message: 'Usuario no encontrado' });

        const user = results[0];

        const valid = bcrypt.compareSync(password, user.password);

        if (!valid)
            return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '2h' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json(err);
    }
};