export async function ban_get_reason(res, api, message, event) {
    if (event['object']['local_id'] !== 0) {
        let reply_to = await api.messages.getByConversationMessageId()
    }
    res.send("ok")
}