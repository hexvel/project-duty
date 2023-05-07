export async function bind_chat(res, api, message) {
    await api.messages.send({
        peer_id: message.peerId,
        message: "✅ Чат успешно связан.",
        random_id: 0
    })

    res.send("ok")
}