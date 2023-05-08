const get_all_history = async (api, chat_id, offset = 0) => {
    let chat = await api.messages.getHistory({count: 1, peer_id: chat_id, offset: offset})
    let count = chat['count']
    while (offset < count) {
        try {chat = await api.messages.getHistory({count: 200, peer_id: chat_id, offset: offset})}
        catch (e) {continue;}
        offset += 200
        return chat['items']
    }

}

export const delete_messages_from_user = async (res, api, message, event) => {
    const member_id = event['object']['user_id']
    const chat_id = message.peerId
    let amount = event['object']['amount'] ? 'amount' in event['object'] : false
    if (amount) {
        amount = event['object']['amount']
    }

    let message_ids = []
    const message_id = await api.messages.send({peer_id: chat_id, message: "✅ Удаляю сообщения...", random_id: 0})

    for (let message of await get_all_history(api, chat_id)) {
        let timestamp = Math.floor(Date.now() / 1000);
        if (timestamp - message['date'] >= 86400) {
            break;
        }
        if (message['from_id'] === member_id) {
            message_ids.push(message['id'].toString())
        }
        if (amount) {
            if (amount <= message_ids.length) {
                let count = (message_ids.length) - (message_ids.length - amount);
                message_ids = message_ids.slice(0, count)
            }
        }
    }
    try {
        await api.messages.delete({
            message_ids: message_ids,
            delete_for_all: 1,
            spam: 1 ? event['object']['is_spam'] : 0
        });
        await api.messages.edit({peer_id: chat_id, message: "✅ Сообщения успешно удалены.", message_id: message_id})
        res.send("ok")
    } catch (e) {
        if (e.code === 924) {
            const send_message = "❗ Не удалось удалить сообщения.\n" +
                "Невозможно удалить сообщение, возможно пользователь администратор."
            await api.messages.edit({peer_id: chat_id, message: send_message, message_id: message_id})
            res.send('ok')
        } else {
            const send_message = "❗ Не удалось удалить сообщения.\n" +
                `Ошибка со стороны серверов VK: ${e}`
            await api.messages.edit({peer_id: chat_id, message: send_message, message_id: message_id})
            res.send('ok')
        }
    }
}