const express = require('express');
const app = express();

app.use(express.json());

app.post('/callback', (req, res) => {
  const data = req.body;
  console.log(data);
  res.send('ok');
});

app.listen(5000, () =>
  console.log('Сервер с портом 3000 запущен')
);