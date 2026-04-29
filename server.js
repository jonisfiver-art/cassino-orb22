const express = require('express'); 
const axios = require('axios'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const app = express(); 

app.use(express.json()); 
app.use(cors()); 
app.use(express.static('public')); 

// Conecta ao banco sem deixar o servidor cair se falhar
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Banco OK"))
  .catch(err => console.log("Erro ao conectar no banco, mas o servidor continua ligado."));

const User = mongoose.model('User', { 
    username: { type: String, unique: true }, 
    password: { type: String }, 
    balance: { type: Number, default: 0 }, 
    player_id: { type: String } 
});

const TOKEN = process.env.SUITPAY_TOKEN;

// Rota inicial
app.get('/', (req, res) => { res.send("Servidor ORB22 Ativo!"); });

// Suas rotas de auth e pix aqui...
app.post('/auth', async (req, res) => { /* seu código de login */ });
app.post('/pix', async (req, res) => { /* seu código de pix */ });

// A LINHA QUE MANDA NO RENDER:
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Online na porta ${PORT}`);
});
