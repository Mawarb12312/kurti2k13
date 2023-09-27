const list = require("../../utils/schema/list.js");
const { roleBuyer, channelTesti, Owner, Admin } = require("../../config.json");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: "changename",
  aliases: ["cn", "changenameproduct", "cnp"],
  description: "Change Name Product",
  accessableby: "admin",
  usage: "[Product Code] [Product Name]",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0]) return message.reply("What Product Code U Want To Change?");
    const code = args.shift();
    if (args.length < 1) return message.reply("What New Product Name?");
    const productName = args.join(" ");

    const getCode = list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCode.length == 0) {
      message.reply("Product With That Code Doesn't Exist");
    } else {
      await list
        .updateOne(
          {
            code: code,
          },
          {
            name: productName,
          }
        )
        .then((d) => {
          message.reply("Product Name Changed");
        })
        .catch(console.error);
      const sendToOwner = new MessageEmbed()
        .setTitle("Change Product Name History")
        .setDescription(
          `
         Admin: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         New Name: ${productName}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter("Farhan Store © 2020");
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
