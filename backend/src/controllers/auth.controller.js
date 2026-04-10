const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({ message: 'Usuario registrado correctamente' });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const user = results[0];

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            const token = jwt.sign({ id: user.id }, 'secret_key', {
                expiresIn: '2h'
            });

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    );
};