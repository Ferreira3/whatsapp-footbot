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
    if (!matches || matches.length === 0) return 'Nenhum jogo foi encontrado.';

    return matches
        .map((j) => {
            const homeTeam = j.homeTeam.name;
            const awayTeam = j.awayTeam.name;
            const homeScore = j.score.fullTime.home ?? '-';
            const awayScore = j.score.fullTime.away ?? '-';

            return `⚽ *${homeTeam}* ${homeScore} x ${awayScore} *${awayTeam}*`;
        })
        .join('\n');
}
