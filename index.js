import express from 'express'
import fs from "fs";
import path from "path";
import {VK, API} from 'vk-io';

import {Events} from "./duty/objects/events.js";
import Commands from './duty/commands/run_command.js'

const app = express();
const database = JSON.parse(fs.readFileSync('./database.json'));

app.use(express.json());
app.use(express.static('public'));

export class Main {
    constructor(api) {
        this.api = api
        this.vk = new VK({token: database.access_token})
        this.req = null
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
        app.post('/callback', (req, res) => {
            const events = new Events(database.access_token, req.body);

            if (events.getSecret() !== database.secret) {
                res.send("Неверный секретный код")
            }
            if (events.getUserId() !== database.duty_id) {
                res.send("Неверный ID дежурного")
            } else {
                this.req = req.body
                res.send('ok');
            }
        });

        app.get('/', (req, res) => {
            const isInstalled = database.installed
            const fileName = isInstalled ? 'home.html' : 'index.html'
            const filePath = isInstalled ? 'public/main' : 'public'
            res.sendFile(fileName, {root: path.join(__dirname, filePath)})
        });

        app.listen(port, async () => {
            this.vk.updates.on('message', async (message) => {
                await message.loadMessagePayload()
                setTimeout(async () => {
                    await new Commands(message, this.api, this.req).getCommands();
                }, 300)
            });
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