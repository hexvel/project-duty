import express from 'express'
import fs from "fs";
import {VK, API} from 'vk-io';

import {Events} from "./duty/objects/events.js";
import Commands from './duty/commands/run_command.js'

const app = express();
const database = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

app.use(express.json());
app.use(express.static('public'));

export class Main {
    constructor(api) {
        this.api = api
        this.vk = new VK({token: database.access_token})
    }

    genSecret(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    server(port) {
        app.post('/callback', async (req, res) => {
            const events = new Events(database.access_token, req.body);
            if (events.getSecret() !== database.secret) {
                res.send("Неверный секретный код")
            }
            if (events.getUserId() !== database.duty_id) {
                res.send("Неверный ID дежурного")
            } else {
                await new Commands(this.api, req).getCommands(res)
            }
        });

        app.listen(port, async () => {
            await this.vk.updates.start()
            console.log(`Сервер с портом ${port} запущен`)
        });
    }
}

const api = new API({
    token: database.access_token
})

const _class = new Main(api)
_class.server(5000)