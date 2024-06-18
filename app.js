const telegramAPI = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')
const token = '7172405038:AAHQZ8kkQRyf-4GtUyMjzrLjgOKy6fvHe-o';

const bot = new telegramAPI(token, {polling: true});

bot.setMyCommands( [
	{command: '/start', description: 'Тыкни сюда чтобы начать!'},
	{command: '/info', description: 'Тыки сюда чтобы получить инфу!'},
	{command: '/game', description: 'Тыки сюда чтобы сыграть со мной!'},
] )
const chats = {};
const lives = {};
const maxLives = 3;
const startGame = async (chatID) => {
	lives[chatID] = maxLives;
	await bot.sendMessage(chatID, `Сейчас я загадаю цифру от 0 до 9. А ты должен ее угадать!) `);
	const randomNum = Math.floor(Math.random() * 10);
	chats[chatID] = randomNum;
	console.log(chats[chatID])
	await bot.sendMessage(chatID, 'Начнем игру! У тебя есть 3 жизни.');
	await bot.sendMessage(chatID, "Приступай!", gameOptions);
}



const start = () => {
	bot.on("text", async msg => {
		const text = msg.text;
		const textFrom = msg.from.first_name;
		const chatID = msg.chat.id;
		if (text === "/start") {
			await bot.sendMessage(chatID, `Иоу, Привет ${textFrom}! Меня создал Sako чтобы развлекать вас!`)
			return bot.sendSticker(chatID, 'https://sl.combot.org/shironaporno/webp/9xf09f928b.webp')
		}
		if (text === "/info") {
			return bot.sendMessage(chatID, `Кароч, тебя зовут ${textFrom}.\nТвой юзернейм: ${msg.from.username}`)	
		}
		if (text === "/game") {
			return startGame(chatID);
		}
		
		return bot.sendMessage(chatID, 'Я тебя не понимаю! А можно на татарском?')
	})
	console.log('Бот успешно запущен!')
}

bot.on('callback_query',async msg => {
	const data = msg.data;
	const person = msg.message.chat.first_name
	const chatID = msg.message.chat.id;
	if (data === "/again") {
		return startGame(chatID);
	}
	if (!(chatID in lives)) {
    return startGame(chatID);
  }
	if(data == chats[chatID]) {
		await bot.sendMessage(chatID, `Иоу, дружище! ${person} Именно ты ВЫЙГРАЛ!`, againOptions)
		return await bot.sendSticker(chatID, `https://sl.combot.org/gifshlrona_by_fstikbot/webp/24xf09f8c9f.webp`)
	}else {
		lives[chatID]--;
		if(lives[chatID] > 0) {
			return await bot.sendMessage(chatID, `Не, нихуя. У тебя осталось ${lives[chatID]} жизней.`)
		}else {
      return await bot.sendMessage(chatID, 'Пиздец. У тебя закончились жизни. Попробуй еще раз.', againOptions);
    }
	}

})

start();