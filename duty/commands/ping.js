export const ping = async (res, api, message) => {
    const pingTime = Date.now() - (message.createdAt * 1000)

    await api.messages.edit({
        peer_id: message.peerId,
        message_id: message.id,
        message: `ПОНГ КБ\nОтвет за: 0.${pingTime} сек.`
    })
    res.send("ok")
}