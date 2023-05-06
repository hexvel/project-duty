const express = require('express');
const app = express();
const fs = require('fs');
const {join} = require("path");

const database = JSON.parse(fs.readFileSync('./database.json'));
const {API} = require("vk-io");

app.use(express.json());
app.use(express.static('public'));

class Events {
  constructor(token) {
    this.token = token
    this.api = new API({token: this.token})
  }

  async getOwnerId(userId) {
    return await this.api.users.get({
      user_ids: userId
    })
  }
}


class Main {
  constructor(api) {
    this.api = api
  }

  genSecret(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i =0; i< length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  saveDatabase(data) {
    try {
      fs.writeFileSync('./database.json', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  server(port) {
    app.post('/callback', (req, res) => {
      console.log(req.body)
      if (!database.installed) {
        database.secret = this.genSecret(68)
        database.duty_id = req.body.user_id
        database.owner_id = req.body.user_id
        database.installed = true
        this.saveDatabase(database)
      }
      new Events(database.access_token).getOwnerId(database.duty_id).then(r => console.log(r[0]['id']))
      res.send('ok');
    });


    app.get('/', (req, res) => {
      const isInstalled = database.installed
      const fileName = isInstalled ? 'home.html' : 'index.html'
      const filePath = isInstalled ? 'public/main' : 'public'
      res.sendFile(fileName, { root: join(__dirname, filePath)})
    });

    app.listen(port, () => {
      console.log(`Сервер с портом ${port} запущен`)
    });
  }

}

const _class = new Main("тест")
_class.server(5000)