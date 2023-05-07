import { Events } from "../objects/events.js";
import Methods from '../objects/methods.js'

import { ping } from './ping.js';
import { add_user } from "./add_user.js";
import { bind_chat } from "./bind_chat.js";
import { ban_expired } from "./ban_expired.js";
import { subscribe_signals } from "./subscribe_signals.js";
import { delete_messages_from_user } from './delete_messages_from_user.js';
import { messages_recognise_audio_message } from "./messages_recognise_audio_message.js";

import fs from 'fs';

const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

class Commands {
    constructor(message, api, event) {
        this.api = api
        this.message = message
        this.events = new Events(database.access_token, event)
        this.event = event
    }

    async getCommands(res) {
        if (this.events.getMethod() === Methods.PING) {
            res.send("ok")
        }
        else if (this.events.getMethod() === Methods.SEND_MY_SIGNAL) {
            if (this.message.text === ".с пинг") {
                await ping(res, this.api, this.message);
            }
        }
        else if (this.events.getMethod() === Methods.ADD_USER) {
            await add_user(res, this.api, this.message, this.event);
        }
        else if (this.events.getMethod() === Methods.BAN_EXPIRED) {
            await ban_expired(res, this.api, this.message, this.event)
        }
        else if (this.events.getMethod() === Methods.DELETE_MESSAGES) {
            console.log(res, this.event)
        }
        else if (this.events.getMethod() === Methods.DELETE_MESSAGES_FROM_USER) {
            await delete_messages_from_user(res, this.api, this.message, this.event)
        }
        else if (this.events.getMethod() === Methods.MESSAGES_RECOGNISE_AUDIO_MESSAGE) {
            await messages_recognise_audio_message(res, this.api, this.message)
        }
        else if (this.events.getMethod() === Methods.BIND_CHAT) {
            await bind_chat(res, this.api, this.message)
        }
        else if (this.events.getMethod() === Methods.SUBSCRIBE_SIGNALS) {
            await subscribe_signals(res, this.api, this.message, this.event)
        }
    }
}

export default Commands;