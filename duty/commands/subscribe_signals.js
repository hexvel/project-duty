import fs from 'fs';

const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

export async function subscribe_signals(res, api, message, event) {
    const chat = event['object']['chat']
    const send_message = "✅ Отлично, теперь я дежурный в этой беседе.\nИнформация и беседе:\n" +
        `Iris chatId: ${chat}
        Id чата: ${message.peer_id - 2000000000}
        Панель: В разработке.`

    database.chats[chat] = {
        chat_id: message.peer_id - 2000000000,
        installed: true
    }

    fs.writeFileSync('./database.json', JSON.stringify(database));
    await api.messages.send({
        peer_id: message.peer_id,
        message: send_message,
        random_id: 0
    })

    res.send("ok")
}