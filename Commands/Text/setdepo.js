const depo = require("../../utils/schema/depo.js");
const { Owner, Admin } = require("../../config.json");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: "setdepo",
  aliases: [],
  description: "Set World Depo",
  accessableby: "admin",
  usage: "[World Name] [Owner Name] [Bot Name] [Saweria URL (Optional)]",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      message.author.id !== Admin[0] &&
      message.author.id !== Admin[1] &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    const world = args[0];
    if (!world) return message.reply("What is the name of the World Deposit?");
    const owner = args[1];
    if (!owner)
      return message.reply("What is the name of Deposit World Owner?");
    if (!args[2]) return message.reply("What is Bot Name In Depo World?");
    const botName = args[2];
    const saweria = args[3] ? args[3] : "No Set";
    depo
      .findOneAndUpdate(
        { world: { $exists: true } },
        {
          $set: {
            world: world,
            owner: owner,
            botName: botName,
            saweria: saweria,
          },
        },
        { upsert: true, new: true }
      )
      .then((d) => {
        console.log(d);
        message.reply("Done Set World Depo");
        const sendToOwner = new MessageEmbed()
          .setTitle("World Depo History")
          .setDescription(
            `
         Admin: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         New World : ${world}
         New Owner : ${owner}
         New Bot Name : ${botName}
       `.replace(/ {2,}/g, "")
          )
          .setTimestamp()
          .setFooter("World Depo History");
        client.users.send(Owner, { embeds: [sendToOwner] });
      })
      .catch((e) => console.error(e));
  },
};
