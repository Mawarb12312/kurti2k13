const Bal = require("../../utils/schema/balance.js");
const { bot } = require("../../config.json");
module.exports = {
  name: "set",
  aliases: ["register"],
  description: "Set GrowID",
  accessableby: "everyone",
  usage: "[GrowID]",
  run: async (client, message, args) => {
    if (!args[0])
      return message.channel
        .send({ content: "What is Your GrowID?" })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        })
        .catch();
    let GrowID = args[0].toLowerCase();
    let user = message.author.id;
    let existingEntry = await Bal.findOne({ GrowID: GrowID })
      .then((d) => {
        return d.DiscordID;
      })
      .catch((e) => console.error(e));

    if (existingEntry && existingEntry !== user) {
      message.reply("Sorry, GrowID Has Been Used");
    } else {
      const newData = {
        GrowID: GrowID,
        DiscordID: user,
        Balance: 0,
      };
      await Bal.findOneAndUpdate(
        { DiscordID: user },
        { $set: { GrowID: GrowID } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
        .then((res) => {
          console.log(res);
          message.reply(
            "`Succes Add GrowID To Database`\n<:bot:1153521146952687708> **Your GrowID :** " +
              res.GrowID
          );
        })
        .catch((e) => console.error(e));
    }
  },
};
