const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// CONEXÃO COM O BANCO DE DADOS (Vamos configurar no Render)
mongoose.connect(process.env.MONGO_URL);

const User = mongoose.model('User', {
    username: String,
    balance: { type: Number, default: 0 }
});

const MINHA_CHAVE = process.env.SUITPAY_TOKEN;

// LOGIN E BUSCA DE SALDO
app.post('/auth', async (req, res) => {
    const { username } = req.body;
    let user = await User.findOne({ username });
    if (!user) user = await User.create({ username, balance: 0 });
    res.json(user);
});

// DEPÓSITO
app.post('/pix', async (req, res) => {
    try {
        const response = await axios.post('https://api.suitpay.app/api/v1/gateway/request-qrcode', {
            requestNumber: "DEP" + Math.floor(Math.random() * 999999),
            amount: req.body.valor,
            client: { name: req.body.nome, document: "12345678909", email: "c@e.com" }
        }, { headers: { 'Authorization': `Bearer ${MINHA_CHAVE}` } });
        res.json(response.data);
    } catch (error) { res.status(500).json({ error: "Erro" }); }
});

// SAQUE
app.post('/sacar', async (req, res) => {
    try {
        const { valor, chavePix, username } = req.body;
        const user = await User.findOne({ username });
        if (user.balance < valor) return res.status(400).json({ error: "Sem saldo" });

        await axios.post('https://api.suitpay.app/api/v1/gateway/pix-payment', {
            value: valor,
            key: chavePix,
            typeKey: 'CPF'
        }, { headers: { 'Authorization': `Bearer ${MINHA_CHAVE}` } });

        user.balance -= valor;
        await user.save();
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Erro Saque" }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor Online!"));