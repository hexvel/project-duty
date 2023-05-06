export const ban_expired = async (res, api, message, event) => {
    const user_id = event['object']['user_id']
    const userInfo = await api.users.get({
        user_ids: user_id
    })
    const send_message = `✡ У [id${user_id}|${userInfo[0]['first_name']} ${userInfo[0]['last_name']}] истёк срок бана.`

    await api.messages.send({
        peer_id: message.peerId,
        message: send_message,
        random_id: 0
    })
    res.send("ok")
}