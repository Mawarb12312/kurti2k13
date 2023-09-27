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
  name: "addproduct",
  aliases: ["ap", "addp"],
  description: "Add Product",
  accessableby: "admin",
  usage: "[Product Code] [Product Name]",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0]) return message.reply("What Product Code?");
    const code = args.shift();
    if (args.length < 1) return message.reply("What Product Name?");
    const productName = args.join(" ");

    const getCode = await list
      .findOne({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    console.log(getCode);
    if (getCode) {
      message.reply("Product With That Code Already Exist");
    } else {
      await new list({
        code: code,
        name: productName,
      })
        .save()
        .then((d) => {
          message.reply("Product Added");
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
         Name: ${productName}
       `.replace(/ {2,}/g, "")
        )
        .setTimestamp()
        .setFooter("Product History");
      client.users.send(Owner, { embeds: [sendToOwner] });
    }
  },
};
