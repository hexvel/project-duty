export const add_user = async (api, message, event) => {
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
        return "ok"
    } catch (e) {
        return `Произошка ошибка\n${e}`
    }
}