const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Заповніть усі обов\'язкові поля' });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.MY_EMAIL,
            to: process.env.MY_EMAIL,
            replyTo: email,
            subject: `CV Form: Нове повідомлення від ${name}`,
            text: `Ім'я: ${name}\nEmail: ${email}\nТелефон: ${phone}\nПовідомлення: ${message}`
        });
        
        res.status(200).json({ success: true, message: 'Повідомлення надіслано!' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.listen(3000, () => {
    console.log('Бекенд запущено на http://localhost:3000');
});