import { Events } from "../objects/events.js";
import Methods from '../objects/methods.js'
import { ping } from './ping.js';

import fs from 'fs';

const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

class Commands {
    constructor(message, api, event) {
        this.api = api
        this.message = message
        this.event = new Events(database.access_token, event)
    }

    async getCommands() {
        if (this.event.getMethod() === Methods.ADD_USER) {
            await ping(this.api, this.message, this.event);
        }
    }
}

export default Commands;