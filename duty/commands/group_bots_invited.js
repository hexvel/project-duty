export async function group_bots_invited(res, api, event) {
    const group_id = event['object']['group_id'];
    let peer_id = null;

    let conversations = await api.messages.getConversations({})

    for (let conversation of conversations['items']) {
        if (conversation['conversation']['peer']['type'] !== 'chat') {
            continue
        }

        if (event['message']['conversation_message_id'] <= conversation['last_message']['conversation_message_id'] < event['message']['conversation_message_id'] + 200) {
            try {
                const message = await api.messages.getByConversationMessageId({
                    peer_id: conversation['conversation']['peer']['id'],
                    conversation_message_ids: event['message']['conversation_message_id']
                })

                if (message['items'][0]['from_id'] === event['message']['from_id'] && message['items'][0]['date'] === event['message']['date']) {
                    peer_id = message['items'][0]['peer_id']
                }
            } catch {
                // Я так понимаю тут continue; не нужен. Сложно переходить на ноду после питона xd
            }
        }
    }

    if (!peer_id) {
        res.send({
            response: "error",
            error_code: 10
        })
    }

    const group_info = await api.groups.getById({
        group_ids: group_id
    })

    try {
        await api.messages.setMemberRole({
            peer_id: peer_id,
            role: "admin",
            member_id: -group_id
        })

        await api.messages.send({
            peer_id: peer_id,
            message: `✅ Обнаружен групп-бот
                      Админка группе [club${group_id}|${group_info[0]['name']}] успешно выдана.`,
            random_id: 0
        })
        res.send("ok")
    } catch (e) {
        if (e.code) {
            await api.messages.send({
                peer_id: peer_id,
                message: `⚠ Ошибка при выдаче админки групп-боту [club${group_id}|${group_info[0]['name']}]\nНет доступа.`,
                random_id: 0
            })
            res.send("ok")
        } else {
            await api.messages.send({
                peer_id: peer_id,
                message: `⚠ Ошибка при выдаче админки групп-боту [club${group_id}|${group_info[0]['name']}]\nОшибка VK API: ${e.msg}`,
                random_id: 0
            })
            res.send("ok")
        }
    }
}