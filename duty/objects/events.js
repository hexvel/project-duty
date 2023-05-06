import { API } from 'vk-io';

export class Events {
    constructor(token, event) {
        this.token = token
        this.api = new API({token: this.token})
        this.event = event

        // // this.online_token = this.event['online_token']
        // // this.me_token = this.event['me_token']
        // this.secret = this.event['secret']
        // // this.chats = this.event['chats']
        // // this.owner_id = this.event['owner_id']
        // this.duty_id = this.event['duty_id']
        // // this.host = this.event['host']
        // // this.installed = this.event['installed']
    }

    getUserId() {
        return this.event['user_id']
    }

    getSecret() {
        return this.event['secret'];
    }

    getMethod() {
        return this.event['method'];
    }

    getMessageId() {
        return this.event['message']['conversation_message_id']
    }

    getMessage() {
        if (this.event['message'] !== null) {
            const chats = this.api.messages.getConversations({
                count: 100,
                filter: "all"
            })

            for (let item of chats) {
                console.log(item)
            }
        }

    }
}