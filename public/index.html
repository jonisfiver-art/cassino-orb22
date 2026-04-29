const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Banco Conectado!"))
  .catch(err => console.error("Erro no Banco:", err));

const User = mongoose.model('User', {
    username: { type: String, unique: true },
    password: { type: String },
    balance: { type: Number, default: 0 }
});

const TOKEN = process.env.SUITPAY_TOKEN;

app.post('/auth', async (req, res) => {
    try {
        const { username, password, type } = req.body;
        if (type === 'cadastro') {
            const existe = await User.findOne({ username });
            if (existe) return res.status(400).json({ error: "Usuário já existe" });
            const user = await User.create({ username, password });
            return res.json(user);
        }
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ error: "Login inválido" });
        res.json(user);
    } catch (e) { res.status(500).json({ error: "Erro" }); }
});

app.post('/pix', async (req, res) => {
    try {
        const { valor, nome } = req.body;
        // SuitPay exige um CPF válido ou um simulado que eles aceitem
        const response = await axios.post('https://api.suitpay.app/api/v1/gateway/request-qrcode', {
            requestNumber: nome + "_" + Date.now(),
            dueDate: "2026-12-31",
            amount: parseFloat(valor),
            client: {
                name: nome,
                document: "15254131770", // CPF Simulado que costuma passar
                email: "cliente@email.com"
            }
        }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });

        res.json(response.data);
    } catch (error) {
        console.error("ERRO SUITPAY:", error.response?.data || error.message);
        res.status(500).json({ error: "Falha ao gerar Pix no banco" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor Online"));