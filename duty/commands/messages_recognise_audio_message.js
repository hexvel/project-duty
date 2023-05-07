import {text} from "express";

const get_transcript = (message) => {
    for (let attachment of message.attachments) {
        if (attachment.type === 'audio_message') {
            if (attachment.isTranscriptDone) {
                return attachment.transcript
            }
        }
    }
}

export const messages_recognise_audio_message = async (res, api, message) => {
    const chat_id = message.peerId
    let conversationMessage = (await api.messages.getByConversationMessageId({
        peer_id: chat_id,
        conversation_message_ids: message.conversationMessageId
    }))['items'][0]
    const transcript = get_transcript(message)

    if (!transcript) {
        setTimeout(async () => {
            conversationMessage = (await api.messages.getByConversationMessageId({
                peer_id: chat_id,
                conversation_message_ids: message.conversationMessageId
            }))['items'][0]
            const transcript = get_transcript(message)
        }, 1000)

        if (!transcript) {
            setTimeout(async () => {
                conversationMessage = (await api.messages.getByConversationMessageId({
                    peer_id: chat_id,
                    conversation_message_ids: message.conversationMessageId
                }))['items'][0]
                const transcript = get_transcript(message)

                const user = await api.users.get({user_ids: message['from_id']})
                const name = `[id${user[0]['id']}|${user[0]['first_name']} ${user[0]['last_name']}]`

                let transcriptText;
                if (transcript) {
                    transcriptText = `🗯 ${name}: ${transcript}`
                } else {
                    transcriptText = `🗯 ${name}: Сказал что-то не внятное.`
                }
                await api.messages.send({
                    peer_id: chat_id,
                    message: transcriptText,
                    random_id: 0
                })
                res.send("ok")
            }, 4000)
        }
    }
}