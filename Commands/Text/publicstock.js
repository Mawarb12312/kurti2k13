const stock = require("../../utils/schema/stock.js");
const { Admin, Owner } = require("../../config.json");

module.exports = {
  name: "publicstock",
  aliases: ["ps"],
  accessableby: "admin",
  description: "To Set Public or Private Stock Commands",
  usage: "",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    await stock
      .findOne({})
      .then(async (d) => {
        if (d) {
          d.Public = !d?.Public;
          await d
            .save()
            .then((d1) => {
              message.reply(
                d?.Public
                  ? "Stock Commands Set To Public"
                  : "Stock Commands Set To Private"
              );
            })
            .catch(console.error);
        } else {
          await new stock({ Public: true })
            .save()
            .then((d) => {
              message.reply(
                d?.Public
                  ? "Stock Commands Set To Public"
                  : "Stock Commands Set To Private"
              );
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  },
};
