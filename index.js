import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./config.js";

const bot = new Telegraf(BOT_TOKEN);

bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Привет! Я телеграм-бот магазина Name! Через меня можно оформить интернет-заказ!')
})

bot.launch();