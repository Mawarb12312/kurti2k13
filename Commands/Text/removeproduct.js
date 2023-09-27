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
  name: "removeproduct",
  aliases: ["rp", "removep"],
  description: "Remove Product",
  accessableby: "admin",
  usage: "[Product Code]",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0]) return message.reply("What Product Code?");
    const code = args.shift();

    const getCode = await list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (!getCode) {
      message.reply("Product With That Code Doesnt Exist");
    } else {
      await list
        .deleteOne({ code: code })
        .then((d) => {
          message.reply("Product Removed");
        })
        .catch(console.error);
      const sendToOwner = new MessageEmbed()
        .setTitle("Product History")
        .setDescription(
          `
         Admin: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         Code: ${code}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter("Purchase History");
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
