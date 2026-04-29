const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());

// Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Banco OK")).catch(err => console.log("Erro Banco"));

// Modelo do Usuário atualizado com ID e Progresso VIP
const User = mongoose.model('User', { 
    username: { type: String, unique: true }, 
    password: { type: String }, 
    balance: { type: Number, default: 0 },
    player_id: { type: String },
    wagered: { type: Number, default: 0 }
});

const TOKEN = process.env.SUITPAY_TOKEN;

// --- INTERFACE DO CASSINO (EXATAMENTE COMO NA FOTO) ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORB22 - Premium</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { background: #ffb800; color: #fff; font-family: 'Inter', sans-serif; margin:0; }
        .main-container { background: #000; min-height: 100vh; }
        .gold-text { color: #ffb800; }
        .gold-bg { background: #ffb800; color: #000; font-weight: 900; }
        .vip-card { background: #1a1a1a; border-radius: 15px; padding: 15px; position: relative; }
        .vip-progress-bg { background: #333; height: 10px; border-radius: 10px; margin: 10px 0; overflow: hidden; }
        .vip-progress-fill { background: #00ff00; height: 100%; width: 59%; border-radius: 10px; }
        .menu-row { background: #ffb800; color: #000; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e6a700; }
        .game-card { border-radius: 20px; overflow: hidden; background: #111; transition: 0.3s; border: 1px solid #222; }
        .game-card:hover { transform: scale(1.05); border-color: #ffb800; }
        iframe { width: 100%; height: 90vh; border: none; background: #000; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;

        function App() {
            const [user, setUser] = useState(null);
            const [balance, setBalance] = useState(0);
            const [view, setView] = useState("home"); 
            const [activeGame, setActiveGame] = useState(null);
            const [showDep, setShowDep] = useState(false);
            const [isLogin, setIsLogin] = useState(true);
            const [pix, setPix] = useState(null);
            const [amt, setAmt] = useState("");

            // JOGOS REAIS DO SLOTSLAUNCH / 55BB
            const games = [
                { id: 1, n: "Fortune Tiger", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Tiger_Logo.png", u: "https://m.pg-nmga.com/126/index.html" },
                { id: 2, n: "Fortune Rabbit", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Rabbit_Logo.png", u: "https://m.pg-nmga.com/1543462/index.html" },
                { id: 3, n: "Aviator", i: "https://upload.wikimedia.org/wikipedia/pt/0/0e/Aviator_Logo.png", u: "https://demo.spribe.io/games/aviator" },
                { id: 4, n: "Fortune Ox", i: "https://img.bet.global/api/v1/vms/assets/v2/Fortune-Ox_Logo.png", u: "https://m.pg-nmga.com/98/index.html" },
                { id: 5, n: "Fortune Mouse", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Mouse_Logo.png", u: "https://m.pg-nmga.com/68/index.html" },
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

            if (!user) return (
                <div className="main-container flex items-center justify-center p-4">
                    <div className="bg-[#121212] p-8 rounded-[40px] text-center w-full max-w-sm border border-white/10 shadow-2xl">
                        <h1 className="text-5xl font-black gold-text mb-8 italic uppercase tracking-tighter">ORB22</h1>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input name="u" placeholder="Usuário" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <input name="p" type="password" placeholder="Senha" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <button className="gold-bg w-full py-4 rounded-2xl uppercase">Entrar Agora</button>
                        </form>
                        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-[10px] text-gray-500 uppercase font-bold underline">
                            {isLogin ? 'Criar Conta' : 'Voltar ao Login'}
                        </button>
                    </div>
                </div>
            );

            return (
                <div className="main-container">
                    {/* HEADER IDENTICO À FOTO */}
                    <header className="p-4 flex flex-col gap-4 sticky top-0 z-50 bg-[#ffb800]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div onClick={() => setView('perfil')} className="w-14 h-14 rounded-full border-4 border-black/20 overflow-hidden cursor-pointer shadow-lg">
                                    <img src="https://img.freepik.com/vetores-premium/personagem-de-coelho-fofo-dos-desenhos-animados_1057-23425.jpg" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-black font-black text-sm">{user.username} <i className="fa fa-caret-down ml-1"></i></p>
                                    <p className="text-black/60 text-[10px] font-bold">ID: {user.player_id} <i className="fa fa-copy"></i></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-black/10 px-3 py-2 rounded-full flex items-center gap-2">
                                    <span className="text-black font-black italic">🇧🇷 {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    <i className="fa fa-sync-alt text-black/40 text-xs"></i>
                                </div>
                                <i className="fa fa-headset text-black text-xl ml-2"></i>
                            </div>
                        </div>

                        {/* BOTOES RAPIDOS DA FOTO */}
                        <div className="flex justify-around items-center pt-2">
                            <div className="text-center space-y-1">
                                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto border border-black/10"><i className="fa fa-wallet text-black text-xl"></i></div>
                                <p className="text-[9px] font-black text-black uppercase">Saques</p>
                            </div>
                            <div onClick={() => setShowDep(true)} className="text-center space-y-1 cursor-pointer">
                                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto border border-black/10 relative">
                                    <i className="fa fa-plus-circle text-blue-700 text-xl"></i>
                                    <span className="absolute -top-2 -right-2 bg-green-500 text-[8px] px-1 rounded text-white">+0,5%</span>
                                </div>
                                <p className="text-[9px] font-black text-black uppercase">Depósito</p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto border border-black/10"><i className="fa fa-piggy-bank text-black text-xl"></i></div>
                                <p className="text-[9px] font-black text-black uppercase">Juros</p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto border border-black/10 text-black font-black text-xl italic">15</div>
                                <p className="text-[9px] font-black text-black uppercase">Fundo</p>
                            </div>
                        </div>
                    </header>

                    <main className="p-4 lg:p-8">
                        {activeGame ? (
                            <div className="animate-in zoom-in duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <button onClick={() => setActiveGame(null)} className="gold-bg px-4 py-2 rounded-xl text-xs uppercase">← Sair</button>
                                    <a href={activeGame.u} target="_blank" className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold">TELA CHEIA (SEM ERRO 403)</a>
                                </div>
                                <iframe src={activeGame.u}></iframe>
                            </div>
                        ) : view === 'perfil' ? (
                            <div className="max-w-xl mx-auto space-y-4 animate-in fade-in">
                                {/* BARRA VIP DA FOTO */}
                                <div className="bg-[#121212] p-5 rounded-[25px] border border-white/5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-black italic text-xl">V0</div>
                                            <span className="text-4xl font-black italic italic">V0</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold">Bônus de Nível <span className="gold-text">1,00</span></p>
                                            <p className="text-[9px] text-gray-500 uppercase">VIP requer <span className="underline">Apostas</span> 81,35</p>
                                        </div>
                                    </div>
                                    <div className="vip-progress-bg"><div className="vip-progress-fill"></div></div>
                                    <p className="text-center text-[9px] text-gray-500 font-bold">118,65 / 200,00</p>
                                </div>

                                {/* LISTA DE MENU */}
                                <div className="space-y-1">
                                    <button className="menu-row rounded-t-[20px]"><span><i className="fa fa-file-invoice mr-3"></i> Meus Registros</span> <i className="fa fa-chevron-right"></i></button>
                                    <button className="menu-row rounded-b-[20px]"><span><i className="fa fa-credit-card mr-3"></i> Gestão de Saques</span> <i className="fa fa-chevron-right"></i></button>
                                </div>
                                <button onClick={() => setView('home')} className="w-full py-4 text-gray-500 font-bold text-xs uppercase underline">Voltar</button>
                                <button onClick={() => window.location.reload()} className="w-full py-4 text-red-500 font-bold text-xs uppercase underline">Sair da Conta</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* BANNER PROMO */}
                                <div className="bg-gradient-to-r from-[#1a1a1a] to-black p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
                                    <p className="gold-text font-black text-xs uppercase mb-2">BÔNUS 1º DEPÓSITO</p>
                                    <h2 className="text-4xl font-black italic uppercase leading-none mb-4 italic">100% ATÉ <br/> R$500</h2>
                                    <button onClick={() => setShowDep(true)} className="gold-bg px-8 py-3 rounded-2xl text-xs uppercase">Resgatar Agora</button>
                                    <span className="absolute right-0 bottom-0 text-[180px] opacity-10 rotate-12 italic font-black">777</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {games.map(g => (
                                        <div key={g.id} onClick={() => setActiveGame(g)} className="game-card p-2 cursor-pointer group">
                                            <div className="aspect-[4/5] rounded-[20px] overflow-hidden mb-2">
                                                <img src={g.i} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase italic text-center truncate">{g.n}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* MODAL DEPOSITO */}
                    {showDep && (
                        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
                            <div className="bg-[#111] p-10 rounded-[48px] w-full max-w-sm text-center relative border border-white/5">
                                <button onClick={() => {setShowDep(false); setPix(null);}} className="absolute top-8 right-8 text-gray-500 font-bold">✕</button>
                                <h2 className="text-2xl font-black italic gold-text uppercase mb-8">Depósito Pix</h2>
                                {!pix ? (
                                    <div className="space-y-6">
                                        <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0,00" className="w-full p-5 bg-black border border-white/10 rounded-3xl text-3xl font-black outline-none text-center gold-text" />
                                        <button onClick={gerarPix} className="gold-bg w-full py-5 rounded-3xl text-sm uppercase italic font-black">Gerar QR Code</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 flex flex-col items-center">
                                        {pix === "CARREGANDO" ? <p className="animate-pulse font-black gold-text">Acessando SuitPay...</p> : (
                                            <>
                                                <div className="bg-white p-3 rounded-3xl shadow-2xl"><img src={"data:image/png;base64," + pix.qrcodeBase64} className="w-56 h-56" /></div>
                                                <button onClick={() => {navigator.clipboard.writeText(pix.copyPaste); alert("Código Copiado!");}} className="text-[8px] bg-black p-4 rounded-2xl w-full border border-white/5 opacity-50 break-all leading-relaxed font-black uppercase">{pix.copyPaste}</button>
                                                <p className="gold-text font-black text-[10px] animate-pulse uppercase tracking-[3px] mt-4">Aguardando Pagamento...</p>
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

// APIs (Login, Pix, Saque)
app.post('/auth', async (req, res) => {
    try {
        const { username, password, type } = req.body;
        if (type === 'cadastro') {
            const existe = await User.findOne({ username });
            if (existe) return res.status(400).json({ error: "Nome indisponível" });
            const p_id = Math.floor(100000000 + Math.random() * 900000000);
            const user = await User.create({ username, password, player_id: p_id.toString() });
            return res.json(user);
        }
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ error: "Dados incorretos" });
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
    } catch (e) { res.status(500).json({ error: "Erro Pix" }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Cassino Pronto!"));