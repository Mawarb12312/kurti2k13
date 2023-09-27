const Price = require("../../utils/schema/price.js");
const list = require("../../utils/schema/list.js");
const { Owner, Admin } = require("../../config.json");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: "setharga",
  aliases: ["setprice"],
  accessableby: "admin",
  usage: "[Code Want To Set] [Price U Want To Set]",
  description: "Set Harga",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      message.author.id !== Admin[0] &&
      message.author.id !== Admin[1] &&
      message.author.id !== Owner
    )
      return;
    if (!args[0])
      return message.reply("What items do you want to set the price for??");

    let wut = args[0];
    const getCode = list
      .findOne({ code: wut })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (!getCode) return message.reply("Code Not Found");

    if (!args[1]) return message.reply("What price do you want to set?");

    let price = Number(args[1]);
    await Price.findOneAndUpdate(
      { code: wut },
      { price: price, code: wut },
      { upsert: true, new: true }
    )
      .then((res) => {
        message.reply(
          "Successfully Set " + res.code + " Price With Price " + res.price
        );
        const sendToOwner = new MessageEmbed()
          .setTitle("Price History")
          .setDescription(
            `
         Admin: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         Code: ${wut}
         New Price: ${price}
       `.replace(/ {2,}/g, "")
          )
          .setTimestamp()
          .setFooter("Purchase History");
        client.users.send(Owner, { embeds: [sendToOwner] });
      })
      .catch(console.error);
  },
};
