const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Banco OK")).catch(err => console.log("Erro Banco"));

const User = mongoose.model('User', { 
    username: { type: String, unique: true }, 
    password: { type: String }, 
    balance: { type: Number, default: 0 } 
});

const TOKEN = process.env.SUITPAY_TOKEN;

// Rota para o visual do site
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>ORB22 - Oficial</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>body { background:#050505; color:white; font-family:sans-serif; }</style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        function App() {
            const [user, setUser] = useState(null);
            const [balance, setBalance] = useState(0);
            const [isLogin, setIsLogin] = useState(true);
            const [pix, setPix] = useState(null);

            const handleAuth = async (e) => {
                e.preventDefault();
                const res = await fetch('/auth', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ username: e.target.u.value, password: e.target.p.value, type: isLogin ? 'login' : 'cadastro' })
                });
                const data = await res.json();
                if(data.error) return alert(data.error);
                setUser(data); setBalance(data.balance);
            };

            const gerarPix = async (amt) => {
                setPix("CARREGANDO");
                const res = await fetch('/pix', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ valor: amt, nome: user.username })
                });
                const data = await res.json();
                setPix(data);
            };

            if (!user) return (
                <div className="h-screen flex items-center justify-center">
                    <div className="bg-zinc-900 p-10 rounded-[40px] text-center w-full max-w-sm border border-white/10">
                        <h1 className="text-5xl font-black text-yellow-500 mb-8 italic italic tracking-tighter uppercase">ORB22</h1>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input name="u" placeholder="Usuário" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <input name="p" type="password" placeholder="Senha" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <button className="bg-yellow-500 text-black font-bold w-full py-4 rounded-2xl uppercase tracking-widest">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
                        </form>
                        <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-xs text-gray-500 underline uppercase">{isLogin ? 'Criar conta' : 'Fazer Login'}</button>
                    </div>
                </div>
            );

            return (
                <div className="min-h-screen">
                    <header className="p-6 flex justify-between items-center border-b border-white/10">
                        <span className="text-yellow-500 font-black italic text-3xl">ORB22</span>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase">Saldo</p>
                            <p className="font-black text-white italic">R$ {balance.toFixed(2)}</p>
                        </div>
                    </header>
                    <main className="p-10 text-center">
                        <h2 className="text-2xl font-bold mb-10 uppercase italic">Bem-vindo, {user.username}</h2>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5">🎰 Jogo 1</div>
                            <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5">🎰 Jogo 2</div>
                        </div>
                        <button onClick={() => { 
                            const val = prompt("Valor do depósito:");
                            if(val >= 5) gerarPix(val);
                        }} className="mt-10 bg-yellow-500 text-black font-bold px-10 py-4 rounded-full uppercase">Depositar via Pix</button>
                        
                        {pix && (
                            <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6">
                                <div className="bg-zinc-900 p-8 rounded-3xl max-w-sm w-full relative">
                                    <button onClick={() => setPix(null)} className="absolute top-4 right-4 text-gray-500">✕</button>
                                    {pix === "CARREGANDO" ? <p>Gerando...</p> : (
                                        <div className="text-center space-y-4">
                                            <div className="bg-white p-2 inline-block rounded-xl"><img src={"data:image/png;base64," + pix.qrcodeBase64} /></div>
                                            <p className="text-[8px] break-all text-gray-500">{pix.copyPaste}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            );
        }
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
    `);
});

// Rotas de API
app.post('/auth', async (req, res) => {
    const { username, password, type } = req.body;
    if (type === 'cadastro') {
        const existe = await User.findOne({ username });
        if (existe) return res.status(400).json({ error: "Já existe" });
        const user = await User.create({ username, password });
        return res.json(user);
    }
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: "Erro" });
    res.json(user);
});

app.post('/pix', async (req, res) => {
    try {
        const response = await axios.post('https://api.suitpay.app/api/v1/gateway/request-qrcode', {
            requestNumber: req.body.nome + "_" + Date.now(),
            dueDate: "2026-12-31",
            amount: parseFloat(req.body.valor),
            client: { name: req.body.nome, document: "15254131770", email: "c@e.com" }
        }, { headers: { 'Authorization': 'Bearer ' + TOKEN } });
        res.json(response.data);
    } catch (e) { res.status(500).json({ error: "Erro" }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Rodando"));