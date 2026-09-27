import cron from 'node-cron';
import { WASocket } from '@whiskeysockets/baileys';
import { getMatches, formatMatches } from './football.js';

export function startScheduler(socket: WASocket, targetChat: string) {
    // Agenda para rodar todo dia às 08:00
    cron.schedule(
        '0 8 * * *',
        async () => {
            console.log('⏰ Acorda já são 08h! Disparando boletim automático...');
            const matches = await getMatches();
            const text = formatMatches(matches);
            await socket.sendMessage(targetChat, {
                text: `📢 *BOM DIA! JOGOS DE HOJE:*\n\n${text}`
            });
        },
        { timezone: 'America/Sao_Paulo' }
    );
}
