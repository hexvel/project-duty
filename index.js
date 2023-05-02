const { VK, API } = require('vk-io');

updates.on('message', async (message) => {
  console.log(message);
});

cmd.hear(/привет/i, async (message, bot) => {
  message.send("Привет!");
})

vk.updates.start().catch(console.error)