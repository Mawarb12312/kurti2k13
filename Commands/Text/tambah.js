const { panah, verif, Owner, Admin, wl } = require("../../config.json");
const Bal = require("../../utils/schema/balance.js");
const {
  Client,
  Intents,
  Collection,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

module.exports = {
  name: "tambah",
  aliases: ["tambah"],
  description: "To Add Balance Or Money",
  usage: "[GrowID Want To Add] [Balance To Add]",
  accessableby: "admin",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0])
      return message.channel
        .send({ content: "Which GrowID Want to Add Balance??" })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        })
        .catch();
    let growId = args[0].toLowerCase();
    if (!args[1] || isNaN(args[1]))
      return message.reply("Write the Amount You Want To Add Using Numbers");

    let Balance = args[1];
    let wallet1 = await Bal.findOne({ GrowID: growId })
      .then((d) => {
        console.log(d);
        return d;
      })
      .catch((e) => console.error(e));

    if (!wallet1)
      return message.reply(
        "The user with the GrowID you provided or the tagged user was not found"
      );
    await Bal.updateOne({ GrowID: growId }, { $inc: { Balance: Balance } });

    let wallet = await Bal.findOne({ GrowID: growId })
      .then((d) => {
        return d.Balance;
      })
      .catch(console.error);
    message.channel.send({
      content: `${Balance} World Locks Added To ${growId}`,
    });

    const sendToOwner = new MessageEmbed()
      .setTitle("Balance History")
      .setDescription(
        `
         User: <@${wallet1.DiscordID}>
         Admin: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         Amount: ${Balance}
       `.replace(/ {2,}/g, "")
      )
      .setTimestamp()
      .setFooter("Farhan Store © 2020");
    client.users.send(Owner, { embeds: [sendToOwner] });
  },
};
