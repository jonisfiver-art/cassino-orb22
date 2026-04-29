const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());

// Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Banco OK")).catch(err => console.log("Erro Banco"));

// Modelo do Usuário
const User = mongoose.model('User', { 
    username: { type: String, unique: true }, 
    password: { type: String }, 
    balance: { type: Number, default: 0 } 
});

const TOKEN = process.env.SUITPAY_TOKEN;

// --- TELA INICIAL (HTML + CSS + REACT) ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORB22 CASINO - Oficial</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #050505; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .sidebar { background: #0b0b0b; border-right: 1px solid #1a1a1a; }
        .gold-text { color: #f3ba2f; }
        .gold-bg { background: #f3ba2f; color: #000; font-weight: 800; }
        .card-bg { background: #121212; border: 1px solid #1a1a1a; transition: 0.3s; }
        .card-bg:hover { border-color: #f3ba2f; transform: translateY(-5px); }
        .banner-bg { background: linear-gradient(135deg, #1a1a1a 0%, #050505 100%); border: 1px solid #222; }
        iframe { width: 100%; height: 90vh; border: none; border-radius: 20px; margin-top: 20px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;

        function App() {
            const [user, setUser] = useState(null);
            const [balance, setBalance] = useState(0);
            const [view, setView] = useState("home"); // home, perfil
            const [gameUrl, setGameUrl] = useState(null);
            const [isLogin, setIsLogin] = useState(true);
            const [showDep, setShowDep] = useState(false);
            const [pix, setPix] = useState(null);
            const [amt, setAmt] = useState("");
            
            const [valSaque, setValSaque] = useState("");
            const [pixSaque, setPixSaque] = useState("");

            const games = [
                { id: 1, n: "Fortune Tiger", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Tiger_Logo.png", u: "https://m.pg-nmga.com/126/index.html" },
                { id: 2, n: "Fortune Rabbit", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Rabbit_Logo.png", u: "https://m.pg-nmga.com/1543462/index.html" },
                { id: 3, n: "Aviator", i: "https://upload.wikimedia.org/wikipedia/pt/0/0e/Aviator_Logo.png", u: "https://demo.spribe.io/games/aviator?currency=BRL&lang=pt" },
                { id: 4, n: "Gates of Olympus", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Gates-of-Olympus_Logo.png", u: "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate" },
                { id: 5, n: "Sweet Bonanza", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Sweet-Bonanza_Logo.png", u: "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20fruitsw" },
                { id: 6, n: "Mines", i: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Xf2W6V6R5uM5_I-n1PAt-1Pz5m6XpW0j0A&s", u: "https://demo.spribe.io/games/mines" }
            ];

            const handleAuth = async (e) => {
                e.preventDefault();
                const u = e.target.u.value;
                const p = e.target.p.value;
                const res = await fetch('/auth', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: u, password: p, type: isLogin ? 'login' : 'cadastro' }) });
                const data = await res.json();
                if(data.error) return alert(data.error);
                setUser(data); setBalance(data.balance);
            };

            const gerarPix = async () => {
                if (amt < 5) return alert("Mínimo R$ 5");
                setPix("CARREGANDO");
                const res = await fetch('/pix', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ valor: amt, nome: user.username }) });
                const data = await res.json();
                setPix(data);
            };

            const sacar = async () => {
                if (valSaque < 30) return alert("Mínimo R$ 30");
                const res = await fetch('/sacar', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ valor: valSaque, chavePix: pixSaque, username: user.username }) });
                const data = await res.json();
                if(data.success) { alert("Saque solicitado!"); window.location.reload(); }
            };

            if (!user) return (
                <div className="h-screen flex items-center justify-center p-4">
                    <div className="bg-[#121212] p-10 rounded-[40px] text-center w-full max-w-sm border border-white/10 shadow-2xl">
                        <h1 className="text-5xl font-black gold-text mb-8 italic uppercase tracking-tighter">ORB22</h1>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input name="u" placeholder="Usuário" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <input name="p" type="password" placeholder="Senha" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <button className="gold-bg w-full py-4 rounded-2xl uppercase">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
                        </form>
                        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-[10px] text-gray-500 uppercase font-bold underline">
                            {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Login'}
                        </button>
                    </div>
                </div>
            );

            return (
                <div className="flex min-h-screen">
                    {/* SIDEBAR */}
                    <aside className="w-64 sidebar hidden lg:flex flex-col p-6 space-y-6">
                        <div className="text-2xl font-black gold-text italic mb-6">ORB22 <span className="text-white text-xs block opacity-50">CASINO</span></div>
                        <nav className="space-y-2 flex-1">
                            <button onClick={() => {setView('home'); setGameUrl(null);}} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-bold"><i className="fa fa-home gold-text"></i> Início</button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-bold opacity-50"><i className="fa fa-slot-machine"></i> Slots</button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-bold opacity-50"><i className="fa fa-video"></i> Cassino Ao Vivo</button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-bold opacity-50"><i className="fa fa-plane"></i> Aviator</button>
                            <button onClick={() => setView('perfil')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-bold"><i className="fa fa-user gold-text"></i> VIP Club</button>
                        </nav>
                        <div className="banner-bg p-4 rounded-2xl text-center">
                            <p className="text-[10px] font-bold uppercase mb-2">Bônus de Boas-Vindas</p>
                            <p className="text-xl font-black gold-text italic leading-none mb-4">100% ATÉ R$500</p>
                            <button className="gold-bg w-full py-2 rounded-xl text-[10px]">Resgatar Bônus</button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 flex flex-col overflow-y-auto max-h-screen">
                        {/* HEADER */}
                        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 sticky top-0 bg-[#050505] z-40">
                            <div className="lg:hidden text-2xl font-black gold-text italic">ORB22</div>
                            <div className="flex items-center gap-6 ml-auto">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 font-bold leading-none">R$ {balance.toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-600 font-bold">Saldo</p>
                                </div>
                                <button onClick={() => setShowDep(true)} className="gold-bg px-6 py-2 rounded-xl text-xs">Depósito</button>
                                <div onClick={() => setView('perfil')} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer border border-white/10 hover:border-yellow-500 transition"><i className="fa fa-user text-xs"></i></div>
                            </div>
                        </header>

                        {/* CONTENT AREA */}
                        <main className="p-8">
                            {gameUrl ? (
                                <div className="animate-in zoom-in">
                                    <button onClick={() => setGameUrl(null)} className="mb-4 text-yellow-500 font-bold uppercase text-xs">← Sair do Jogo</button>
                                    <iframe src={gameUrl} allowFullScreen></iframe>
                                </div>
                            ) : view === 'perfil' ? (
                                <div className="max-w-xl mx-auto banner-bg p-10 rounded-[40px] text-center animate-in fade-in">
                                    <h2 className="text-3xl font-black gold-text italic mb-10 uppercase italic">CONFIGURAÇÕES: {user.username}</h2>
                                    <div className="bg-black/50 p-8 rounded-[32px] text-left space-y-4 mb-8 border border-white/5 shadow-2xl">
                                        <h3 className="gold-text font-black italic uppercase text-sm italic">Área de Saque (Mín R$ 30)</h3>
                                        <input type="number" value={valSaque} onChange={e => setValSaque(e.target.value)} placeholder="Valor R$" className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                                        <input type="text" value={pixSaque} onChange={e => setPixSaque(e.target.value)} placeholder="Chave Pix (CPF)" className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                                        <button onClick={sacar} className="w-full gold-bg py-4 rounded-2xl text-xs uppercase">Solicitar Saque</button>
                                    </div>
                                    <button onClick={() => window.location.reload()} className="text-red-500 font-bold uppercase text-[10px] underline tracking-widest">Sair da Conta</button>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {/* CAROUSEL MOCK */}
                                    <div className="banner-bg h-64 rounded-[40px] p-12 flex flex-col justify-center relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <p className="text-xs font-bold uppercase mb-4 tracking-widest">BÔNUS DE BOAS-VINDAS</p>
                                            <h2 className="text-5xl font-black italic gold-text leading-none mb-6 italic">100% ATÉ <br/> R$500</h2>
                                            <button className="gold-bg px-8 py-3 rounded-2xl uppercase text-xs">Resgatar Agora</button>
                                        </div>
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[15rem] opacity-20 pointer-events-none group-hover:scale-110 transition duration-700 italic font-black text-white">777</div>
                                    </div>

                                    {/* GRID GAMES */}
                                    <div>
                                        <h3 className="text-xl font-black italic mb-8 uppercase flex items-center gap-3 italic">
                                            <div className="w-2 h-6 gold-bg rounded-full"></div> Jogos em Destaque
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                                            {games.map(g => (
                                                <div key={g.id} onClick={() => setGameUrl(g.u)} className="card-bg rounded-[32px] p-2 cursor-pointer group">
                                                    <div className="aspect-[3/4] rounded-[24px] overflow-hidden bg-black mb-3">
                                                        <img src={g.i} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                                    </div>
                                                    <p className="font-black text-[10px] uppercase italic truncate px-2 mb-2">{g.n}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>

                    {/* MODAL DEPÓSITO */}
                    {showDep && (
                        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100]">
                            <div className="card-bg p-10 rounded-[48px] w-full max-w-sm text-center relative border-white/10 shadow-2xl">
                                <button onClick={() => {setShowDep(false); setPix(null);}} className="absolute top-8 right-8 text-gray-500 font-bold">✕</button>
                                <h2 className="text-2xl font-black italic mb-8 uppercase gold-text italic">Depositar Pix</h2>
                                {!pix ? (
                                    <div className="space-y-6">
                                        <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Valor R$" className="w-full p-5 bg-black border border-white/10 rounded-3xl text-3xl font-black outline-none text-center italic gold-text" />
                                        <button onClick={gerarPix} className="gold-bg w-full py-5 rounded-3xl text-sm uppercase">Gerar QR Code</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 flex flex-col items-center">
                                        {pix === "CARREGANDO" ? <p className="animate-pulse">Gerando Pix...</p> : (
                                            <>
                                                <div className="bg-white p-3 rounded-3xl"><img src={"data:image/png;base64," + pix.qrcodeBase64} className="w-56 h-56" /></div>
                                                <button onClick={() => {navigator.clipboard.writeText(pix.copyPaste); alert("Copiado!");}} className="text-[9px] break-all text-gray-500 bg-black p-4 rounded-2xl w-full border border-white/5 leading-relaxed italic">{pix.copyPaste}</button>
                                                <p className="gold-text font-black text-xs animate-pulse italic uppercase tracking-widest leading-none mt-4">Aguardando Pagamento...</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
    try {
        const { username, password, type } = req.body;
        if (type === 'cadastro') {
            const existe = await User.findOne({ username });
            if (existe) return res.status(400).json({ error: "Nome indisponível" });
            const user = await User.create({ username, password });
            return res.json(user);
        }
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ error: "Erro no Login" });
        res.json(user);
    } catch (e) { res.status(500).json({ error: "Erro" }); }
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

app.post('/sacar', async (req, res) => {
    try {
        const { valor, chavePix, username } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.balance < valor) return res.status(400).json({ error: "Saldo insuficiente" });
        await axios.post('https://api.suitpay.app/api/v1/gateway/pix-payment', { value: valor, key: chavePix, typeKey: 'CPF' }, { headers: { 'Authorization': 'Bearer ' + TOKEN } });
        user.balance -= valor; await user.save();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Erro" }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor Online"));