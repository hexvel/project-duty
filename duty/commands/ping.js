export const ping = async (api, message, event) => {
    console.log(message)
    await api.messages.edit({
        peer_id: message.peerId,
        message_id: message.id,
        message: "Понг"
    })
    return "ok"
}