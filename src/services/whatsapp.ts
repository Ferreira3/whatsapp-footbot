import dotenv from 'dotenv';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { formatMatches, getMatches } from './football.js';

dotenv.config();

const commands: Record<string, () => Promise<string>> = {
    '!ping': async () => 'Pong! Bot acordado e respondendo.',
    '!proximosjogos': async () => formatMatches(await getMatches()),
    '!jogospassados': async () => {
        const dateTo = new Date().toISOString().split('T')[0];
        const dateFrom = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
        return formatMatches(await getMatches(dateFrom, dateTo));
    }
};

export async function connectToWhatsapp() {
    // Lê as chaves da pasta 'auth_info' ou inicializa um estado zerado
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const socket = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }), // Silencia o spam interno da biblioteca
        printQRInTerminal: false // Desativa o QR padrão
    });

    socket.ev.on('connection.update', (update) => {
        const { connection, qr } = update;

        if (update.connection === 'close') {
            const statusCode = (update.lastDisconnect?.error as Boom)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(
                `Conexão fechou. Código: ${statusCode}. Deseja reconectar? ${shouldReconnect}`
            );

            if (shouldReconnect) {
                connectToWhatsapp(); // Redisca porque foi só uma queda temporária
            } else {
                console.log('Sessão encerrada no celular. Limpe a pasta auth_info.');
            }
        }

        // Se veio código de pareamento, joga no terminal
        if (qr) {
            console.log('Escaneie o QR Code para se conectar:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('Conectado com sucesso.');
        }
    });

    socket.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;
        const msg = m.messages[0];

        // Trava de segurança: ignora mensagem sem conteúdo ou enviada por você mesmo
        if (!msg.message || msg.key.fromMe) return;

        // Extrai o texto (mensagem simples ou com formatação/link)
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const fromWho = msg.key.remoteJid;
        console.log(`Mensagem de [${fromWho}]: ${text}`);
        const command = text?.toLowerCase().trim();
        if (!command) return;

        const acao = commands[command];
        if (acao && fromWho) {
            const resposta = await acao();
            await socket.sendMessage(fromWho, { text: resposta });
        }
    });

    // Salva as credenciais sempre que elas são atualizadas
    socket.ev.on('creds.update', saveCreds);

    console.log('Credenciais salvas na pasta.');

    return socket;
}
