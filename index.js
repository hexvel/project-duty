const express = require('express');
const app = express();

app.use(express.json());

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
      const data = req.body;
      res.send('ok');
    });

    app.get('/getKey/', (req, res) => {
      const secret_key = this.genSecret(96)
      res.send(`Ваш секретный ключ: ${secret_key}`)
    })

    app.listen(port, () =>
      console.log('Сервер с портом 5000 запущен')
    );
  }

}

const _class = new Main("тест")
_class.server(5000)