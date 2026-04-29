const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Conexão Segura com MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Cassino Conectado ao Banco!"))
  .catch(err => console.log("Erro de Conexão:", err));

const User = mongoose.model('User', {
    username: { type: String, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }
});

const MINHA_CHAVE = process.env.SUITPAY_TOKEN;

// LOGIN E CADASTRO REAL
app.post('/auth', async (req, res) => {
    try {
        const { username, password, type } = req.body;
        if (type === 'cadastro') {
            const existe = await User.findOne({ username });
            if (existe) return res.status(400).json({ error: "Usuário já existe!" });
            const user = await User.create({ username, password, balance: 0 });
            return res.json(user);
        } else {
            const user = await User.findOne({ username });
            if (!user || user.password !== password) return res.status(401).json({ error: "Dados incorretos!" });
            res.json(user);
        }
    } catch (error) { res.status(500).json({ error: "Erro no servidor" }); }
});

// DEPÓSITO PIX
app.post('/pix', async (req, res) => {
    try {
        const { valor, nome } = req.body;
        const response = await axios.post('https://api.suitpay.app/api/v1/gateway/request-qrcode', {
            requestNumber: nome + "_" + Date.now(),
            amount: valor,
            client: { name: nome, document: "12345678909", email: "c@e.com" }
        }, { headers: { 'Authorization': `Bearer ${MINHA_CHAVE}` } });
        res.json(response.data);
    } catch (error) { res.status(500).json({ error: "Erro SuitPay" }); }
});

// SAQUE (MÍNIMO 30)
app.post('/sacar', async (req, res) => {
    try {
        const { valor, chavePix, username } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.balance < valor) return res.status(400).json({ error: "Saldo insuficiente" });

        await axios.post('https://api.suitpay.app/api/v1/gateway/pix-payment', {
            value: valor,
            key: chavePix,
            typeKey: 'CPF'
        }, { headers: { 'Authorization': `Bearer ${MINHA_CHAVE}` } });

        user.balance -= valor;
        await user.save();
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Erro no saque" }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Cassino Online!"));