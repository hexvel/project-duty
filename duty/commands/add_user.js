export const add_user = async (res, api, message, event) => {
    try {
        await api.messages.addChatUser({
            chat_id: message.peerId - 2000000000,
            user_id: event['object']['user_id']
        })
        await api.messages.edit({
            peer_id: message.peerId,
            message_id: message.id,
            message: "✅ Пригласил."
        })
        res.send("ok")
    } catch (e) {
        if (e.code === 15) {
            await api.messages.send({
                peer_id: message.peerId,
                message: "❎ Не удалось добавить участника\nВозможно он(-а) не в моих друзьях.",
                random_id: 0
            })
        }
        res.send(`Произошка ошибка\n${e}`)
    }
}