import { Events } from "../objects/events.js";
import Methods from '../objects/methods.js'

import { ping } from './ping.js';
import { add_user } from "./add_user.js";

import fs from 'fs';

const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

class Commands {
    constructor(message, api, event) {
        this.api = api
        this.message = message
        this.events = new Events(database.access_token, event)
        this.event = event
    }

    async getCommands() {
        if (this.events.getMethod() === Methods.SEND_MY_SIGNAL) {
            if (this.message.text === ".с пинг") {
                await ping(this.api, this.message);
            }
        }
        else if (this.events.getMethod() === Methods.ADD_USER) {
            await add_user(this.api, this.message, this.event);
        }
    }
}

export default Commands;