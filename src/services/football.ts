import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export async function getMatches(dateFrom?: string, dateTo?: string) {
    try {
        const res = await axios.get('https://api.football-data.org/v4/matches', {
            headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY },
            params: { dateFrom, dateTo } // Se for undefined, o Axios simplesmente ignora
        });
        return res.data.matches;
    } catch (err: any) {
        if (err.response?.status === 429) console.log('Limite de requisições excedido!');
        return [];
    }
}

export function formatMatches(matches: any[]): string {
    if (!matches || matches.length === 0) return 'Nenhum jogo encontrado.';

    return matches.map((j) => {
        const liga = j.competition.name;
        const casa = j.homeTeam.name;
        const fora = j.awayTeam.name;
        const placar = `${j.score.fullTime.home ?? '-'} x ${j.score.fullTime.away ?? '-'}`;
        const status = j.status === 'IN_PLAY' ? '🔴 AO VIVO' : j.status === 'FINISHED' ? 'FT' : 'Agendado';

        return `🏆 *${liga}*\n⚽ ${casa} ${placar} ${fora}\n⏱️ Status: _${status}_\n`;
    }).join('\n');
}
