const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Tenta conectar ao banco, se falhar ele avisa no log mas não desliga o servidor
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB com sucesso!"))
  .catch(err => console.log("Erro ao conectar no MongoDB. Verifique a senha e o IP no Atlas!", err));

const User = mongoose.model('User', {
    username: String,
    balance: { type: Number, default: 0 }
});

const MINHA_CHAVE = process.env.SUITPAY_TOKEN;

// ROTA: Cadastro e Login (Corrige o problema do cadastro)
app.post('/auth', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Nome vazio" });
        
        let user = await User.findOne({ username });
        if (!user) {
            user = await User.create({ username, balance: 0 });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// ROTA: Gerar Pix (Depósito)
app.post('/pix', async (req, res) => {
    try {
        const { valor, nome } = req.body;
        const response = await axios.post('https://api.suitpay.app/api/v1/gateway/request-qrcode', {
            requestNumber: nome + "_" + Date.now(),
            amount: valor,
            client: { name: nome, document: "12345678909", email: "c@e.com" }
        }, { headers: { 'Authorization': `Bearer ${MINHA_CHAVE}` } });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro na SuitPay" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));