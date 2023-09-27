const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");
// require("./utils/log.js")
const {
  Prefix,
  Token,
  MongoURL,
  WebhookURL,
  channelIdStock,
  textActivity,
} = require("./config.json");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const shop = require("./utils/schema/shop.js");
const Price = require("./utils/schema/price.js");
const list = require("./utils/schema/list.js");

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.aliases = new Collection();
client.commands = new Collection();
const commands = readdirSync("./Commands/Text").filter((file) =>
  file.endsWith(".js")
);
for (let file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./Commands/Text/${commandName}`);
  client.commands.set(commandName, command);
}

textActivity.push(Prefix + "help for help");
textActivity.push("My Prefix: " + Prefix);

client.on("ready", () => {
  setInterval(() => {
    client.user.setActivity(
      textActivity[Math.floor(Math.random() * textActivity.length)],
      {
        type: "LISTENING",
      }
    );
  }, 15000);
  console.log(`Logged in as ${client.user.tag}!`);
});

/*setInterval(async () => {
  const webhook = new WebhookClient({ url: WebhookURL });
  const getCodes = await list
    .find({})
    .then((res) => {
      return res;
    })
    .catch(console.error);
  if (getCodes.length < 1) return;
  let text = "";
  for (let i = 0; i < getCodes.length; i++) {
    const code = getCodes[i];
    const stock = await shop
      .find({ code: code.code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    const price = await Price.findOne({ code: code.code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    text += `===============
            **<a:mahkota:1144243524750020639> ${
              code.name
            } <a:mahkota:1144243524750020639> **
            <a:panah:1144243490797133834> Code: **${code.code}**
            <a:panah:1144243490797133834> Stock: **${
              stock.length > 0 ? stock.length : "0"
            }**
            <a:panah:1144243490797133834> Price: **${
              price ? price.price : "Not Set Yet"
            } <:wl:1144243463735476245>**
            `.replace(/ {2,}/g, "");
  }
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("<a:warn:1144243567628406805> Stock <a:warn:1144243567628406805>")
    .setTimestamp()
    .setFooter("MZAJ")
    .setDescription(text);
  console.log("Sending Realtime Stock");
  webhook.send({
    embeds: [embed],
  });
}, 30000);*/

client.on("messageCreate", async (message) => {
  if (message.channel.id == channelIdStock) {
    const messages = await message.channel.messages.fetch({
      limit: 2,
    });
    const messagesToDelete = messages.filter((m) => m.id !== message.id);

    if (messagesToDelete.size > 0) {
      await message.channel.bulkDelete(messagesToDelete);
    }
  }
  if (message.content.startsWith(Prefix)) {
    const args = message.content.slice(Prefix.length).trim().split(/\s+/);
    const commandName = args.shift();
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd?.aliases && cmd?.aliases?.includes(commandName)
      );
    if (!command) return;
    command.run(client, message, args);
  }
});

client.login(Token);
mongoose
  .connect(MongoURL)
  .then(() => console.log("Succesfully Connect To MongoDB"))
  .catch((e) => console.log(e));
