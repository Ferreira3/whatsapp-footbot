import dotenv from 'dotenv';
import { connectToWhatsapp } from './services/whatsapp.js';
import { startScheduler } from './services/scheduler.js';

dotenv.config();
const testNumber = String(process.env.MY_TEST_NUMBER);
async function main() {
    const socket = await connectToWhatsapp();
    startScheduler(socket, testNumber); // Seu número ou grupo aqui
}

main();
