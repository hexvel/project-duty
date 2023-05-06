const express = require('express');
const app = express();
const fs = require('fs');

const database = JSON.parse(fs.readFileSync('./database.json'));

app.use(express.json());
app.use(express.static('public'));

class Main {
  constructor(api) {
    this.api = api
  }

  genSecret(length) {
    const chars = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789';
    let secret_key = '';
    for (var i = 0; i < length; i++) {
      var pos = Math.floor(Math.random() * chars.length);
      secret_key += chars.substring(pos, pos + 1);
    }
    return secret_key;
  }

  server(port) {
    app.post('/callback', (req, res) => {
      console.log(req.body)
      if (!database.installed) {
        database.secret = this.genSecret(68)
        database.duty_id = req.body.user_id
        database.owner_id = req.body.user_id
        database.installed = true
        fs.writeFileSync('./database.json', JSON.stringify(database))
      }
      res.send('ok');
    });

    app.get('/', (req, res) => {
      if (!database.installed) {
        res.sendFile('index.html', {root: path.join(__dirname, 'public')})
      } else {
        res.sendFile('home.html', {root: path.join(__dirname, 'public/main')})
      }
    })

    app.listen(port, () => {
      console.log(`Сервер с портом ${port} запущен`)
    });
  }

}

const _class = new Main("тест")
_class.server(5000)