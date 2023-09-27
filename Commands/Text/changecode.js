const list = require("../../utils/schema/list.js");
const Price = require("../../utils/schema/price.js");
const shop = require("../../utils/schema/shop.js");
const { roleBuyer, channelTesti, Owner, Admin } = require("../../config.json");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: "changecode",
  aliases: ["cc", "changecodeproduct", "ccp"],
  description: "Change Code Product",
  accessableby: "admin",
  usage: "[Product Code] [New Product Code]",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0]) return message.reply("What Product Code U Want To Change?");
    const code = args.shift();
    if (!args[0]) return message.reply("What New Product Code?");
    const productCode = args[0]

    const getCode = list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCode.length == 0) {
      message.reply("Product With That Code Doesn't Exist");
      return
    } else {
      await list
        .updateOne(
          {
            code: code,
          },
          {
            code: productCode,
          }
        )
        .then(console.log)
        .catch(console.error);
      await Price
        .updateOne(
          {
            code: code,
          },
          {
            code: productCode,
          }
        )
        .then(console.log)
        .catch(console.error);
      await shop
        .updateOne(
          {
            code: code,
          },
          {
            code: productCode,
          }
        )
        .then(console.log)
        .catch(console.error);
      message.reply("Product Code Changed")
      const sendToOwner = new MessageEmbed()
        .setTitle("Change Product Code History")
        .setDescription(
          `
         Admin: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         New Code: ${productCode}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter("Change Product Code History");
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
