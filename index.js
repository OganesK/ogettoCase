import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import { Keyboard } from "telegram-keyboard";
import regexp from 'node-regexp'

import { BOT_TOKEN, API_URI, usersDB } from "./config.js";
import { GET_CATS_QUERY, GET_CHILDREN_CATEGORIES, GET_PRODUCTS_QUERY, GET_PRODUCT_QUERY,  } from "./queries.js";
import { CREATE_EMPTY_CART_MUTATION, SET_BILLING_ADRESS_TO_CART_MUTATION, SET_SHIPPING_ADRESS_TO_CART_MUTATION, SET_GUEST_EMAIL_ON_CART_MUTATION, PLACE_ORDER_MUTATION } from './mutations.js';

const bot = new Telegraf(BOT_TOKEN);

const placeOrder = async (userId) => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: SET_GUEST_EMAIL_ON_CART_MUTATION, variables:{
            cart_id:usersDB[userId].cart_id,
        }})
      })
        .then(r => r.json())
}

const setEmail = async (userId) => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: SET_GUEST_EMAIL_ON_CART_MUTATION, variables:{
            cart_id:usersDB[userId].cart_id,
            email:usersDB[userId].email,
        }})
      })
        .then(r => r.json())
}

const setBillingAdress = async (userId) => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: SET_BILLING_ADRESS_TO_CART_MUTATION, variables:{
            cart_id:usersDB[userId].cart_id,
            fName: usersDB[userId].fName,
            lName:usersDB[userId].lName,
            company:'',
            street:usersDB[userId].street,
            city:usersDB[userId].city,
            region:usersDB[userId].region,
            region_id:usersDB[userId].region_number,
            countrt_code:usersDB[userId].country_number,
            phone:usersDB[userId].phone,
            postcode:usersDB[userId].postcode
        }})
      })
        .then(r => r.json())
}

const setShippingAdress = async (userId) => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: SET_SHIPPING_ADRESS_TO_CART_MUTATION, variables:{
            cart_id:usersDB[userId].cart_id,
            fName: usersDB[userId].fName,
            lName:usersDB[userId].lName,
            company:'',
            street:usersDB[userId].street,
            city:usersDB[userId].city,
            region:usersDB[userId].region,
            region_id:usersDB[userId].region_number,
            countrt_code:usersDB[userId].country_number,
            phone:usersDB[userId].phone,
            postcode:usersDB[userId].postcode
        }})
      })
        .then(r => r.json())
}
const createEmptyCart = async () => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: CREATE_EMPTY_CART_MUTATION})
      })
        .then(r => r.json())

    return(res.data.createEmptyCart)
}

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

const getProduct = async (sku) => {
    const res = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: GET_PRODUCT_QUERY, variables:{
            sku:sku
        }})
      })
        .then(r => r.json())

    return res.data.products.items[0]
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

bot.action('AddToCart', async ctx => {
    ctx.reply('Пожалуйста, укажите количество товара в формате "Количество:N": ')
})

bot.hears(/(?<=Имя:).*$/g, async ctx => {
    usersDB[ctx.chat.id] = {
        fName:ctx.message.text.slice(4).split(' ')[0],
        lName:ctx.message.text.slice(4).split(' ')[1]
    }
    console.log(usersDB)
})

const re = regexp().start('firstname').global().multiline().toRegExp()

bot.hears(re, async ctx => {
    const data = ctx.message.text.split('\n')
    usersDB[ctx.chat.id]['firstname'] = data[1].split(':')[1]
    usersDB[ctx.chat.id]['lastname'] = data[1].split(':')[1]
    usersDB[ctx.chat.id]['street'] = data[1].split(':')[1]
    usersDB[ctx.chat.id]['city'] = data[2].split(':')[1]
    usersDB[ctx.chat.id]['region'] = data[3].split(':')[1]
    usersDB[ctx.chat.id]['region_number'] = data[4].split(':')[1]
    usersDB[ctx.chat.id]['postcode'] = data[5].split(':')[1]
    usersDB[ctx.chat.id]['country_number'] = data[6].split(':')[1]
    usersDB[ctx.chat.id]['phone'] = data[7].split(':')[1]
    usersDB[ctx.chat.id]['email'] = data[8].split(':')[1]

    await setShippingAdress(ctx.chat.id)
    await setBillingAdress(ctx.chat.id)
    await setEmail(ctx.chat.id)

    await placeOrder(ctx.chat.id)
})

bot.hears(/(?<=Количество:).*$/g, async ctx => {
    const cart_id =  await createEmptyCart();
    usersDB[ctx.chat.id]["cart_id"] = cart_id
    ctx.reply(`Отлично! Вот id вашей корзины: ${cart_id}.\n Пожалуйста, введите 
    firstname:
    lastname:
    company:
    street:
    city:
    region:
    region_id:
    postcode:
    country_code:
    telephone:
    email:`)
})

bot.action(/(?<=Sku_).*$/g, async ctx => {
    const res = await getProduct(ctx.callbackQuery.data.slice(4))
    const colors = res.configurable_options[0].values.reduce((acc, variant) => {
        acc.push(variant.label)
        return acc
    }, [])
    const sizes = res.configurable_options[1].values.reduce((acc, variant) => {
        acc.push(variant.label)
        return acc
    }, [])
    const caption = `**Description:** ${res.variants[0].product.description.html.replace(/<[^>]*>?/gm, '')}\n` + `**Price:** ${res.variants[0].product.price_range.minimum_price.regular_price.value} USD`
    await ctx.telegram.sendPhoto(ctx.chat.id,res.variants[0].product.image.url)
    ctx.telegram.sendMessage(ctx.chat.id, caption, {
        reply_markup:{
            inline_keyboard:[colors.map(color=>(
                {
                    text:color, callback_data:'Color_' + color
                }
            )),
            sizes.map(size => (
                {
                    text:size, callback_data:'Size_' + size
                }
            )),
            [{text:"Добавить в корзину", callback_data:'AddToCart'}]
        ]
        }}
    )
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
        let count = 1;
        ctx.telegram.sendMessage(ctx.chat.id, formattedCats, {
        reply_markup:{
            inline_keyboard:[
                res.data.products.items.map(item => (
                    {
                        text:count++, callback_data:'Sku_' + item.sku
                    }
                ))
            ]
        }
    })
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

bot.command('name', async ctx => {
    ctx.reply('Введите пожалуйста свое имя:')
})

bot.command('adress', async ctx => {
    ctx.reply('Введите пожалуйста адрес в формате: Адрес:\nУлица:\nГород:\nРегион:\nНомер региона:\nИндекс:\nНомер города:\nИндекс:')
})

start(bot)