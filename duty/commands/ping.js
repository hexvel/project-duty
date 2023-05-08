export const ping = async (res, api, message) => {
    const pingTime = Date.now() - (message.date * 1000)

    await api.messages.edit({
        peer_id: message.peer_id,
        message_id: message.id,
        message: `ПОНГ КБ\nОтвет за: 0.${pingTime} мс.`
    })
    res.send("ok")
}