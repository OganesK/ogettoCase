import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import { Keyboard } from "telegram-keyboard";

import { BOT_TOKEN, API_URI } from "./config.js";
import { GET_CATS_QUERY, GET_CHILDREN_CATEGORIES, GET_PRODUCTS_QUERY } from "./queries.js";

const bot = new Telegraf(BOT_TOKEN);


const getCategories = async () => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: GET_CATS_QUERY})
      })
        .then(r => r.json())

    return res.data.categoryList
}

const getProducts = async (parentUid) => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: GET_PRODUCTS_QUERY, variables:{
            id:parentUid
        }})
      })
        .then(r => r.json())
    return res;
}

const getParentCategories = async (parentUid,is_anchor) => {
    console.log(is_anchor)
    if(Number(is_anchor) === 1){
        console.log('HUETA')
        return("Anchor")
    }
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: GET_CHILDREN_CATEGORIES, variables:{
            id:parentUid
        }})
      })
        .then(r => r.json())
    return res;
}


const start = async (bot) => {
    const cats = await getCategories();
    console.log(cats)
    bot.launch();
}

bot.hears('Категории', async ctx => {
    const keyboard = Keyboard.make([
        ['Меню', 'Корзина', 'Заказы']
    ])
    const cats = await getCategories();
    let cCount = 1;
    const formattedCats = cats[0].children.reduce((acc, child)=>{
        acc += (String(cCount++) + '. ' + child.name + '\n')
        return acc
    }, '')
    let count = 1;
    ctx.telegram.sendMessage(ctx.chat.id, formattedCats, {
        reply_markup:{
            inline_keyboard:[
                cats[0].children.map(cat => (
                    {
                        text:count++, callback_data:cat.is_anchor + 'Category_uid_' + cat.uid
                    }
                ))
            ]
        }
    })
})

bot.hears('Меню', async ctx => {
    const keyboard = Keyboard.make([
        ['Категории', 'Корзина', 'Заказы']
    ])
    ctx.reply('Доступные команды: ', keyboard.reply())
})

bot.hears('Корзина', async ctx => {
    const keyboard = Keyboard.make([
        ['Категории', 'Меню', 'Заказы']
    ])
    ctx.reply('Ваша корзина: ', keyboard.reply())
})

bot.action(/(?<=Category_uid_).*$/g, async ctx => {
    const res = await getParentCategories(ctx.callbackQuery.data.slice(14), ctx.callbackQuery.data[0])
    let Count = 1;
    if(res === 'Anchor'){
        let ccCount = 1
        const res = await getProducts(ctx.callbackQuery.data.slice(14));
        console.log(res)
        const formattedCats = res.data.products.items.reduce((acc, item)=>{
            acc += (String(ccCount++) + '. ' + item.name + '\n')
            return acc
        }, '')
        ctx.reply(formattedCats)
    }else{
        const formattedCats = res.data.categories.items.reduce((acc, child)=>{
            acc += (String(Count++) + '. ' + child.name + '\n')
            return acc
        }, '')
        let cCount = 1;
        ctx.telegram.sendMessage(ctx.chat.id, formattedCats, {
            reply_markup:{
                inline_keyboard:[
                    res.data.categories.items.map(cat => (
                        {
                            text:cCount++, callback_data:cat.is_anchor + 'Category_uid_' + cat.uid
                        }
                    ))
                ]
            }
        })
    }
    
})

bot.command('start', async  ctx => {
    const keyboard = Keyboard.make([
        ['Категории', 'Корзина', 'Заказы']
    ])
    await ctx.reply('Привет! Я телеграм-бот магазина Name! Через меня можно оформить интернет-заказ!', keyboard.reply())
})

start(bot)