// Import dependencies
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Telegram bot instance
const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true });

// Create Express app instance
const app = express();

// Check if required environment variables are defined
if (!process.env.TELEGRAM_CHAT_ID) {
    console.error('Telegram chat ID not defined');
    process.exit(1);
}

if (!process.env.TELEGRAM_MESSAGE) {
    console.error('Telegram message not defined');
    process.exit(1);
}

// Define API routes
app.get('/', (req, res) => {
    res.send('Telegram API');
});

var intervalId;

app.get('/health', (req, res) => {
    res.send('OK');
});

app.get('/call', (req, res) => {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = process.env.TELEGRAM_MESSAGE;
    let counter = 0;

    const sendMessage = () => {
        counter++;
        const text = `${message} (${counter})`;
        bot.sendMessage(chatId, text)
            .then(() => {
                console.log(`Message sent successfully: ${text}`);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    sendMessage();

    if (intervalId) {
        clearInterval(intervalId)
    }
    intervalId = setInterval(sendMessage, 5000);

    res.send('Messages are being sent every 5 seconds');
});

bot.on('message', (msg) => {
    clearInterval(intervalId);
    console.log(`Message received from ${msg.from.first_name} ${msg.from.last_name}: ${msg.text}`);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
