# ⚽ WhatsApp FootBot (Em construção 🛠️)

Bot autônomo para WhatsApp que entrega boletins e placares de partidas de futebol em tempo real, desenvolvido com foco em alta eficiência e baixo consumo de memória (conexão direta via socket, sem Chrome/Puppeteer).

---

## ⚡ Tecnologias
- Node.js (v20+) + TypeScript (ESM)
- @whiskeysockets/baileys (WebSocket direto)
- Football-Data.org API
- Axios
- Node-Cron

---

## 🕹️ Comandos Disponíveis
| Comando | Ação |
| :--- | :--- |
| `!ping` | Checa a prontidão e conectividade |
| `!proximosjogos` | Partidas e placares de hoje |
| `!jogospassados` | Histórico dos confrontos recentes |