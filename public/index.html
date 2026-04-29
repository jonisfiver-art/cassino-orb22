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
        body { background: #000; color: #fff; font-family: 'Inter', sans-serif; margin: 0; overflow-x: hidden; }
        .gold-header { background: #ffb800; color: #000; }
        .vip-card { background: #121212; border-radius: 20px; padding: 15px; border: 1px solid #222; }
        .vip-bar { height: 8px; background: #333; border-radius: 10px; margin: 10px 0; overflow: hidden; }
        .vip-inner { height: 100%; background: #00ff00; width: 59.3%; }
        .game-card { background: #111; border-radius: 20px; overflow: hidden; border: 1px solid #1a1a1a; transition: 0.3s; cursor:pointer; }
        .game-card:hover { border-color: #ffb800; transform: translateY(-3px); }
        .quick-btn { background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); border-radius: 15px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin: 0 auto; cursor:pointer; }
        .menu-row { background: #ffb800; color: #000; padding: 18px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; border-bottom: 1px solid #e6a700; cursor: pointer; }
        .wheel-container { position: relative; width: 280px; height: 300px; margin: 0 auto; }
        .wheel-canvas { width: 250px; height: 250px; border-radius: 50%; border: 8px solid #ffb800; transition: transform 5s cubic-bezier(0.1, 0, 0.1, 1); background: conic-gradient(#222 0deg 60deg, #333 60deg 120deg, #222 120deg 180deg, #333 180deg 240deg, #222 240deg 300deg, #333 300deg 360deg); position: relative; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .wheel-label { position: absolute; font-weight: 900; color: #ffb800; font-size: 14px; width: 100%; text-align: center; }
        .pointer { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); z-index: 20; color: #ffb800; font-size: 30px; }
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
            const [showSacar, setShowSacar] = useState(false);
            const [showWheel, setShowWheel] = useState(false);
            const [rotation, setRotation] = useState(0);
            const [isSpinning, setIsSpinning] = useState(false);
            const [pix, setPix] = useState(null);
            const [amt, setAmt] = useState("");
            const [isLogin, setIsLogin] = useState(true);

            const games = [
                { id: 1, n: "Fortune Tiger", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Tiger_Logo.png", u: "https://m.pg-nmga.com/126/index.html" },
                { id: 2, n: "Fortune Rabbit", i: "https://vms-static.m-content.io/api/v1/vms/assets/v2/Fortune-Rabbit_Logo.png", u: "https://m.pg-nmga.com/1543462/index.html" },
                { id: 3, n: "Aviator", i: "https://upload.wikimedia.org/wikipedia/pt/0/0e/Aviator_Logo.png", u: "https://demo.spribe.io/games/aviator" },
                { id: 4, n: "Mines", i: "https://demo.spribe.io/assets/mines.png", u: "https://demo.spribe.io/games/mines" }
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
                setPix("LOADING");
                const res = await fetch('/pix', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ valor: amt, nome: user.username }) });
                const data = await res.json();
                setPix(data);
            };

            const girarRoleta = () => {
                if (isSpinning) return;
                setIsSpinning(true);
                const realPrize = Math.floor(Math.random() * (10 - 5 + 1) + 5);
                const targetAngle = realPrize === 5 ? 90 : 210; 
                setRotation((360 * 5) + targetAngle);

                setTimeout(async () => {
                    alert("Você ganhou R$ " + realPrize + ",00 de bônus!");
                    const res = await fetch('/add-prize', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: user.username, amount: realPrize }) });
                    const data = await res.json();
                    setBalance(data.newBalance);
                    setIsSpinning(false);
                    setShowWheel(false);
                    setRotation(0);
                }, 5500);
            };

            if (!user) return (
                <div className="h-screen flex items-center justify-center p-4 bg-[#050505]">
                    <div className="bg-[#111] p-10 rounded-[40px] text-center w-full max-w-sm border border-white/5 shadow-2xl">
                        <h1 className="text-5xl font-black text-[#ffb800] mb-8 italic uppercase tracking-tighter italic">ORB22</h1>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <input name="u" placeholder="Usuário" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <input name="p" type="password" placeholder="Senha" required className="w-full p-4 bg-black border border-white/10 rounded-2xl outline-none" />
                            <button className="bg-[#ffb800] text-black font-black w-full py-4 rounded-2xl uppercase italic">Entrar</button>
                        </form>
                        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-[10px] text-gray-500 uppercase font-bold underline italic">{isLogin ? 'Registrar' : 'Login'}</button>
                    </div>
                </div>
            );

            return (
                <div className="min-h-screen pb-20">
                    <header className="gold-header p-4 space-y-4 sticky top-0 z-50 shadow-xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div onClick={() => setView('perfil')} className="w-12 h-12 rounded-full border-2 border-black/20 overflow-hidden cursor-pointer"><img src="https://img.freepik.com/vetores-premium/personagem-de-coelho-fofo-dos-desenhos-animados_1057-23425.jpg" className="w-full h-full object-cover" /></div>
                                <div className="leading-tight"><p className="font-black text-sm">{user.username} <i className="fa fa-caret-down"></i></p><p className="text-[9px] font-bold opacity-60 uppercase">ID: {user.player_id}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-black/10 px-3 py-1.5 rounded-full font-black italic">🇧🇷 R$ {balance.toFixed(2)}</div>
                                <i className="fa fa-headset text-xl" onClick={()=>alert("Suporte em breve!")}></i>
                            </div>
                        </div>

                        <div className="flex justify-around items-center">
                            <div className="text-center space-y-1" onClick={()=>setShowSacar(true)}><div className="quick-btn"><i className="fa fa-wallet text-xl"></i></div><p className="text-[9px] font-black uppercase">Saques</p></div>
                            <div onClick={() => setShowDep(true)} className="text-center space-y-1 cursor-pointer"><div className="quick-btn relative border-blue-500"><i className="fa fa-plus-circle text-blue-600 text-xl"></i><span className="absolute -top-1 -right-2 bg-green-500 text-white text-[7px] px-1 rounded-sm">+0,5%</span></div><p className="text-[9px] font-black uppercase">Depósito</p></div>
                            <div className="text-center space-y-1" onClick={()=>setShowWheel(true)}><div className="quick-btn relative border-red-500"><i className="fa fa-gift text-red-600 text-xl"></i><span className="absolute -top-1 -right-2 bg-green-500 text-white text-[7px] px-1 rounded-sm">GIRO</span></div><p className="text-[9px] font-black uppercase text-red-600">Oferta</p></div>
                            <div className="text-center space-y-1" onClick={()=>alert("VIP 2 necessário")}><div className="quick-btn font-black text-xl italic text-black">15</div><p className="text-[9px] font-black uppercase">Fundo</p></div>
                        </div>
                    </header>

                    <main className="p-4">
                        {view === 'perfil' ? (
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="vip-card">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-green-500 flex items-center justify-center text-green-500 font-black italic">0</div><span className="text-4xl font-black italic">V0</span></div>
                                        <div className="text-right"><p className="text-[11px] font-bold">Bônus Nível <span className="text-white">1,00</span></p><p className="text-[9px] text-gray-500 uppercase">VIP Requer <span className="underline">Apostas</span> 81,35</p></div>
                                    </div>
                                    <div className="vip-bar"><div className="vip-inner"></div></div>
                                    <p className="text-center text-[10px] font-black text-gray-500">118.65 / 200.00</p>
                                </div>
                                <div className="rounded-[20px] overflow-hidden shadow-2xl">
                                    <div className="menu-row"><span><i className="fa fa-file-invoice mr-3"></i> Meus Registros</span> <i className="fa fa-chevron-right"></i></div>
                                    <div className="menu-row" onClick={()=>setShowSacar(true)}><span><i className="fa fa-credit-card mr-3"></i> Gestão de saques</span> <i className="fa fa-chevron-right"></i></div>
                                </div>
                                <button onClick={() => setView('home')} className="w-full py-4 text-gray-500 font-bold uppercase text-xs mt-4 underline italic">Voltar</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {games.map(g => (
                                    <div key={g.id} onClick={() => window.open(g.u, '_blank')} className="game-card p-2 text-center group">
                                        <div className="aspect-[1/1.2] rounded-[15px] overflow-hidden mb-2"><img src={g.i} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /></div>
                                        <p className="text-[10px] font-black uppercase italic truncate">{g.n}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>

                    {/* MODAL ROLETA */}
                    {showWheel && (
                        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[101] backdrop-blur-md">
                            <div className="bg-[#111] p-8 rounded-[40px] text-center relative border border-white/10 w-full max-w-sm">
                                <button onClick={() => setShowWheel(false)} className="absolute top-4 right-4 text-gray-500">✕</button>
                                <h2 className="text-xl font-black text-[#ffb800] mb-6">GIRO DA SORTE</h2>
                                <div className="wheel-container"><div className="pointer">▼</div><div className="wheel-canvas" style={{transform: `rotate(${rotation}deg)`}}><div className="wheel-label" style={{transform: 'rotate(30deg) translateY(-80px)'}}>R$ 50</div><div className="wheel-label" style={{transform: 'rotate(90deg) translateY(-80px)'}}>R$ 5</div><div className="wheel-label" style={{transform: 'rotate(150deg) translateY(-80px)'}}>R$ 20</div><div className="wheel-label" style={{transform: 'rotate(210deg) translateY(-80px)'}}>R$ 10</div><div className="wheel-label" style={{transform: 'rotate(270deg) translateY(-80px)'}}>R$ 40</div><div className="wheel-label" style={{transform: 'rotate(330deg) translateY(-80px)'}}>R$ 30</div></div></div>
                                <button onClick={girarRoleta} disabled={isSpinning} className="mt-8 gold-bg w-full py-5 rounded-3xl uppercase font-black italic">GIRAR AGORA</button>
                            </div>
                        </div>
                    )}

                    {/* MODAL DEPÓSITO */}
                    {showDep && (
                        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
                            <div className="bg-[#111] p-10 rounded-[48px] w-full max-w-sm text-center relative border border-white/5">
                                <button onClick={() => {setShowDep(false); setPix(null);}} className="absolute top-8 right-8 text-gray-500 font-bold">✕</button>
                                <h2 className="text-2xl font-black gold-text uppercase mb-8 italic">Depositar Pix</h2>
                                {!pix ? (
                                    <div className="space-y-6"><input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0,00" className="w-full p-5 bg-black border border-white/10 rounded-3xl text-3xl font-black outline-none text-center text-[#ffb800]" /><button onClick={gerarPix} className="bg-[#ffb800] text-black w-full py-5 rounded-3xl text-sm font-black uppercase italic">Gerar Pix</button></div>
                                ) : (
                                    <div className="space-y-6 flex flex-col items-center">
                                        {pix === "LOADING" ? <p className="animate-pulse gold-text font-black">Gerando...</p> : (
                                            <>
                                                <div className="bg-white p-3 rounded-3xl shadow-2xl"><img src={"data:image/png;base64," + pix.qrcodeBase64} /></div>
                                                <button onClick={() => {navigator.clipboard.writeText(pix.copyPaste); alert("Copiado!");}} className="text-[8px] bg-black p-4 rounded-2xl w-full border border-white/5 opacity-60 break-all leading-relaxed font-black uppercase italic">{pix.copyPaste}</button>
                                                <p className="gold-text font-black text-xs animate-pulse uppercase tracking-[4px] mt-4">Aguardando...</p>
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
