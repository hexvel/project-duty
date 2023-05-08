import {Events} from "../objects/events.js";
import Methods from '../objects/methods.js'

import {ping} from './ping.js';
import {add_user} from "./add_user.js";
import {hire_api} from "./hire_api.js";
import {bind_chat} from "./bind_chat.js";
import {ban_expired} from "./ban_expired.js";
import {ban_get_reason} from "./ban_get_reason.js";
import {subscribe_signals} from "./subscribe_signals.js";
import {group_bots_invited} from "./group_bots_invited.js";
import {delete_messages_from_user} from './delete_messages_from_user.js';
import {messages_recognise_audio_message} from "./messages_recognise_audio_message.js";

import fs from 'fs';

const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

class Commands {
    constructor(api, event) {
        this.api = api
        this.peer_id = null
        this.message = null
        this.events = new Events(database.access_token, event.body)
        this.event = event.body
        // this.rawHeader = event.rawHeaders[1]
    }

    async getMessage() {
        let conversations = await this.api.messages.getConversations({})

        for (let conversation of conversations['items']) {
            if (conversation['conversation']['peer']['type'] !== 'chat') {
                continue
            }

            if (this.event['message']['conversation_message_id'] <= conversation['last_message']['conversation_message_id'] < this.event['message']['conversation_message_id'] + 300) {
                try {
                    let message = await this.api.messages.getByConversationMessageId({
                        peer_id: conversation['conversation']['peer']['id'],
                        conversation_message_ids: this.event['message']['conversation_message_id']
                    })
                    message = message['items'][0]

                    if (message.from_id === this.event['message']['from_id'] && message.date === this.event['message']['date']) {
                        this.peer_id = message.peer_id;
                        this.message = message
                        break;
                    }
                } catch {
                    // Я так понимаю тут continue; не нужен. Сложно переходить на ноду после питона xd
                }
            }
        }
    }

    async getCommands(res) {
        await this.getMessage()
        if (this.events.getMethod() === Methods.PING) {
            res.send("ok")
        } else if (this.events.getMethod() === Methods.SEND_MY_SIGNAL) {
            if (this.message.text === ".с пинг") {
                await ping(res, this.api, this.message);
            }
        } else if (this.events.getMethod() === Methods.ADD_USER) {
            await add_user(res, this.api, this.message, this.event);
        } else if (this.events.getMethod() === Methods.BAN_EXPIRED) {
            await ban_expired(res, this.api, this.message, this.event)
        } else if (this.events.getMethod() === Methods.DELETE_MESSAGES) {
            console.log(res, this.event)
        } else if (this.events.getMethod() === Methods.DELETE_MESSAGES_FROM_USER) {
            await delete_messages_from_user(res, this.api, this.message, this.event)
        } else if (this.events.getMethod() === Methods.MESSAGES_RECOGNISE_AUDIO_MESSAGE) {
            await messages_recognise_audio_message(res, this.api, this.message)
        } else if (this.events.getMethod() === Methods.BIND_CHAT) {
            await bind_chat(res, this.api, this.message)
        } else if (this.events.getMethod() === Methods.SUBSCRIBE_SIGNALS) {
            await subscribe_signals(res, this.api, this.message, this.event)
        } else if (this.events.getMethod() === Methods.HIRE_API) {
            await hire_api(res, this.api, this.event)
        } else if (this.events.getMethod() === Methods.BAN_GET_REASON) {
            await ban_get_reason(res, this.api, this.message, this.event)
        } else if (this.events.getMethod() === Methods.GROUPBOTS_INVITED) {
            await group_bots_invited(res, this.api, this.event)
        }
    }
}

export default Commands;