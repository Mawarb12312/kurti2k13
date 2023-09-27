const { Admin, Owner } = require("../../config.json");
const { DateTime } = require("luxon");
const { MessageEmbed, WebhookClient } = require("discord.js");
const shop = require("../../utils/schema/shop.js");
const Price = require("../../utils/schema/price.js");
const list = require("../../utils/schema/list.js");
const { wl, bot, panah, product } = require("../../config.json");

module.exports = {
  name: "realtime",
  aliases: ["rt"],
  accessableby: "admin",
  description: "To Send Realtime Stock",
  usage: "",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");

    const channel = await message.channel.send({
      content: "Sending Realtime Product Stock, Send Every 30s",
    });
    setInterval(async () => {
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
            **${product} ${code.name}**
            ${panah} Code: **${code.code}**
            ${panah} Stock: **${stock.length > 0 ? stock.length : "0"}**
            ${panah} Price: **${price ? price.price : "Not Set Yet"} ${wl}**
            `.replace(/ {2,}/g, "");
      }

      const jakartaTime = DateTime.now().setZone("Asia/Jakarta");
      const formattedTime = jakartaTime.toFormat("yyyy-MM-dd HH:mm:ss");

      console.log(`Waktu di Jakarta sekarang: ${formattedTime}`);

      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${product} Real-time Product List ${product}`)
        .setTimestamp()
        .setFooter(`Farhan Store © 2020`)
        .setDescription(text);
      console.log("Sending Realtime Stock");
      channel.edit({ embeds: [embed] });
    }, 30000);
  },
};
