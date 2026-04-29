const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Banco OK")).catch(err => console.log("Erro Banco"));

// Modelo do Usuário com ID igual da foto
const User = mongoose.model('User', { 
    username: { type: String, unique: true }, 
    password: { type: String }, 
    balance: { type: Number, default: 0 },
    player_id: { type: String }
});

const TOKEN = process.env.SUITPAY_TOKEN;

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORB22 - Oficial</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { background: #000; color: #fff; font-family: 'Inter', sans-serif; margin: 0; }
        .gold-header { background: #ffb800; color: #000; }
        .vip-card { background: #121212; border-radius: 20px; padding: 15px; border: 1px solid #222; }
        .vip-bar { height: 8px; background: #333; border-radius: 10px; margin: 10px 0; overflow: hidden; }
        .vip-inner { height: 100%; background: #00ff00; width: 59.3%; }
        .game-card { background: #111; border-radius: 20px; overflow: hidden; border: 1px solid #1a1a1a; transition: 0.3s; }
        .game-card:hover { border-color: #ffb800; transform: translateY(-3px); }
        .quick-btn { background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); border-radius: 15px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .menu-row { background: #ffb800; color: #000; padding: 18px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; border-bottom: 1px solid #e6a700; cursor: pointer; }
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
            const [showDep, setShowDep] = useState(false);
            const [pix, setPix] = useState(null);
            const [amt, setAmt] = useState("");
            const [isLogin, setIsLogin] = useState(true);

            // JOGOS DO SLOTSLAUNCH (ABREM EM NOVA ABA PARA EVITAR ERRO 403)
            const games = [
                { id: 1, n: "Fortune Tiger", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Tiger_Logo.png", u: "https://m.pg-nmga.com/126/index.html" },
                { id: 2, n: "Fortune Rabbit", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Rabbit_Logo.png", u: "https://m.pg-nmga.com/1543462/index.html" },
                { id: 3, n: "Aviator", i: "https://upload.wikimedia.org/wikipedia/pt/0/0e/Aviator_Logo.png", u: "https://demo.spribe.io/games/aviator" },
                { id: 4, n: "Fortune Ox", i: "https://img.bet.global/api/v1/vms/assets/v2/Fortune-Ox_Logo.png", u: "https://m.pg-nmga.com/98/index.html" },
                { id: 5, n: "Fortune Mouse", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Mouse_Logo.png", u: "https://m.pg-nmga.com/68/index.html" },
                { id: 6, n: "Mines", i: "https://demo.spribe.io/assets/mines.png", u: "https://demo.spribe.io/games/mines" }
            ];

            const handleAuth = async (e) => {
                e.preventDefault();
                const res = await fetch('/auth', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: e.target.u.value, password: e.target.p.value, type: isLogin ? 'login' : 'cadastro' }) });
                const data = await res.json();
                if(data.error) return alert(data.error);
                setUser(data); setBalance(data.balance);
            };

            const gerarPix = async () => {
                if (amt < 5) return alert("Mínimo R$ 5");
                setPix("LOADING");
                const res = await fetch('/pix', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ valor: amt, nome: user.username }) });
                const data = await res.json();
                setPix(data);
            };

            if (!user) return (
                <div className="h-screen flex items-center justify-center p-4 bg-[#050505]">
                    <div className="bg-[#111] p-10 rounded-[40px] text-center w-full max-w-sm border border-white/5 shadow-2xl">
                        <h1 className="text-5xl font-black text-[#ffb800] mb-8 italic uppercase tracking-tighter">ORB22</h1>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input name="u" placeholder="Usuário" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <input name="p" type="password" placeholder="Senha" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <button className="bg-[#ffb800] text-black font-black w-full py-4 rounded-2xl uppercase">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
                        </form>
                        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-[10px] text-gray-500 uppercase font-bold underline italic">{isLogin ? 'Criar Conta' : 'Login'}</button>
                    </div>
                </div>
            );

            return (
                <div className="min-h-screen pb-20">
                    {/* CABEÇALHO IGUAL À FOTO */}
                    <header className="gold-header p-4 space-y-4 sticky top-0 z-50 shadow-xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div onClick={() => setView('perfil')} className="w-12 h-12 rounded-full border-2 border-black/20 overflow-hidden cursor-pointer">
                                    <img src="https://img.freepik.com/vetores-premium/personagem-de-coelho-fofo-dos-desenhos-animados_1057-23425.jpg" className="w-full h-full object-cover" />
                                </div>
                                <div className="leading-tight">
                                    <p className="font-black text-sm">{user.username} <i className="fa fa-caret-down text-[10px]"></i></p>
                                    <p className="text-[9px] font-bold opacity-60">ID: {user.player_id} <i className="fa fa-copy"></i></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-black/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="font-black italic">🇧🇷 {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    <i className="fa fa-sync-alt opacity-40 text-[10px]"></i>
                                </div>
                                <i className="fa fa-headset text-xl"></i>
                                <i className="fa fa-comments text-xl"></i>
                            </div>
                        </div>

                        {/* BOTOES RAPIDOS DA FOTO */}
                        <div className="flex justify-around items-center">
                            <div className="text-center space-y-1">
                                <div className="quick-btn"><i className="fa fa-wallet text-xl"></i></div>
                                <p className="text-[9px] font-black uppercase">Saques</p>
                            </div>
                            <div onClick={() => setShowDep(true)} className="text-center space-y-1 cursor-pointer">
                                <div className="quick-btn relative"><i className="fa fa-plus-circle text-blue-600 text-xl"></i><span className="absolute -top-1 -right-2 bg-green-500 text-white text-[7px] px-1 rounded-sm">+0,5%</span></div>
                                <p className="text-[9px] font-black uppercase">Depósito</p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="quick-btn relative"><i className="fa fa-piggy-bank text-xl"></i><span className="absolute -top-1 -right-2 bg-green-500 text-white text-[7px] px-1 rounded-sm">200%</span></div>
                                <p className="text-[9px] font-black uppercase">Juros</p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="quick-btn font-black text-xl italic relative text-black">15<span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-[7px] px-1 rounded-full font-bold">15</span></div>
                                <p className="text-[9px] font-black uppercase">Fundo</p>
                            </div>
                        </div>
                    </header>

                    <main className="p-4">
                        {view === 'perfil' ? (
                            <div className="max-w-md mx-auto space-y-4 animate-in fade-in">
                                {/* VIP BOX IGUAL DA FOTO */}
                                <div className="vip-card">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border border-green-500 flex items-center justify-center text-green-500 font-black italic text-xl">0</div>
                                            <span className="text-4xl font-black italic">V0</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold">Bônus de Nível <span className="text-white">1,00</span></p>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold">VIP requer <span className="text-white underline">Apostas</span> 81,35</p>
                                        </div>
                                    </div>
                                    <div className="vip-bar"><div className="vip-inner"></div></div>
                                    <p className="text-center text-[10px] font-black text-gray-500 italic">118.65 / 200.00</p>
                                </div>

                                <div className="rounded-[20px] overflow-hidden">
                                    <div className="menu-row"><span><i className="fa fa-file-invoice mr-3"></i> Meus Registros</span> <i className="fa fa-chevron-right"></i></div>
                                    <div className="menu-row"><span><i className="fa fa-credit-card mr-3"></i> Gestão de saques</span> <i className="fa fa-chevron-right"></i></div>
                                </div>
                                <button onClick={() => setView('home')} className="w-full text-gray-500 font-bold uppercase text-xs mt-4 underline italic">Voltar ao Início</button>
                                <button onClick={() => window.location.reload()} className="w-full text-red-500 font-bold uppercase text-xs mt-4 underline">Sair da Conta</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* BANNER */}
                                <div className="bg-gradient-to-r from-[#1a1a1a] to-black p-8 rounded-[30px] border border-white/5 relative overflow-hidden">
                                    <p className="text-[#ffb800] font-black text-xs uppercase mb-2 italic">Bônus de Boas-Vindas</p>
                                    <h2 className="text-4xl font-black uppercase italic leading-none mb-4 italic">100% ATÉ <br/> R$500</h2>
                                    <button onClick={() => setShowDep(true)} className="bg-[#ffb800] text-black px-6 py-2 rounded-xl text-xs font-black uppercase italic">Resgatar Agora</button>
                                </div>

                                {/* JOGOS */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {games.map(g => (
                                        <a key={g.id} href={g.u} target="_blank" className="game-card p-2 text-center group">
                                            <div className="aspect-[1/1.2] rounded-[15px] overflow-hidden mb-2">
                                                <img src={g.i} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase italic truncate">{g.n}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* MODAL DEPÓSITO PIX */}
                    {showDep && (
                        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
                            <div className="bg-[#111] p-10 rounded-[48px] w-full max-w-sm text-center relative border border-white/5">
                                <button onClick={() => {setShowDep(false); setPix(null);}} className="absolute top-8 right-8 text-gray-500 font-bold text-xl">✕</button>
                                <h2 className="text-2xl font-black italic text-[#ffb800] uppercase mb-8 italic">Depositar Pix</h2>
                                {!pix ? (
                                    <div className="space-y-6">
                                        <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0,00" className="w-full p-5 bg-black border border-white/10 rounded-3xl text-3xl font-black outline-none text-center text-[#ffb800]" />
                                        <button onClick={gerarPix} className="bg-[#ffb800] text-black w-full py-5 rounded-3xl text-sm font-black uppercase italic">Gerar QR Code</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 flex flex-col items-center animate-in zoom-in">
                                        {pix === "LOADING" ? <p className="animate-pulse font-black text-[#ffb800]">Solicitando ao Banco...</p> : (
                                            <>
                                                <div className="bg-white p-3 rounded-3xl shadow-2xl"><img src={"data:image/png;base64," + pix.qrcodeBase64} className="w-56 h-56" /></div>
                                                <button onClick={() => {navigator.clipboard.writeText(pix.copyPaste); alert("Copiado!");}} className="text-[8px] bg-black p-4 rounded-2xl w-full border border-white/5 opacity-50 break-all leading-relaxed uppercase italic">{pix.copyPaste}</button>
                                                <p className="text-[#ffb800] font-black text-[10px] animate-pulse uppercase tracking-[4px] mt-4">Aguardando Pagamento...</p>
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

// APIs
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
app.listen(PORT, () => console.log("Servidor Online"));