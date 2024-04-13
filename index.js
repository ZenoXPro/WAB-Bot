const { makeWASocket, useMultiFileAuthState, } = require('@whiskeysockets/baileys')
const pino = require('pino')

async function connectWhatsapp() {
    const auth = await useMultiFileAuthState("session");
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ["ZenoXPro", "Safari", "1.0.0"],
        auth: auth.state,
        logger: pino({level: "silent"}),
    });

    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", async({ connection }) =>{
        if (connection === "open") {
            console.log("Bot sudah Aktif 😁😁");
        } else if (connection === "close") {
            await connectWhatsapp();
        }
    });

    socket.ev.on("messages.upsert", async ({ messages, type }) => {
        const chat = messages[0]
        const pesan = ( chat.message?.extendTextMessage?.text ?? chat.message?.ephemeralMessage?.message?.extendTextMessage ?? chat.message?.conversation )
        ?.toLowerCase() || "";

        if (pesan == '.cek bot') {
            await socket.sendMessage(chat.key.remoteJid, { text: "Bot ZenoXPro sudah Aktif 😁😁 dan siap melayanimu!"}, { quoted: chat})
        };
  
        if (pesan == 'lah ngatur') {
            await socket.sendMessage(chat.key.remoteJid, { text: "Apa coba 🗿"}, { quoted: chat})
        }
    })  
}

connectWhatsapp()