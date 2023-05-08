import fs from 'fs';

const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

export async function subscribe_signals(res, api, message, event, panel) {
    const chat = event['object']['chat']
    const send_message = "✅ Отлично, теперь я дежурный в этой беседе.\nИнформация и беседе:\n" +
        `Iris chatId: ${chat}
        Id чата: ${message.peerId - 2000000000}
        Панель: ${panel}`

    let _obj = {};

    database.chats = _obj[chat] = {
        chat_id: message.peerId - 2000000000,
        installed: true
    }

    fs.writeFileSync('./database.json', JSON.stringify(database));
    await api.messages.send({
        peer_id: message.peerId,
        message: send_message,
        random_id: 0
    })

    res.send("ok")
}