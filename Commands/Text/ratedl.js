const dl = require("../../utils/schema/dl.js");

module.exports = {
  name: "ratedl",
  aliases: ["setratedl"],
  description:
    "To Set Rate DL For Saweria (U Must Set Rate DL If U Want Accept Payment Using Saweria)",
  usage: "[Rate DLs In Rp]",
  accessableby: "admin",
  run: async (client, message, args) => {
    if (!args[0]) return message.reply("What Rate for DL?");
    const rateDl = Number(args[0]);
    if (!rateDl) return message.reply("Only Use Number!");

    await dl
      .findOneAndUpdate(
        {},
        { $set: { Rate: rateDl } },
        { upsert: true, new: true }
      )
      .then((res) => {
        console.log(res);
        message.reply("Success Set Rate DLs To " + rateDl);
      })
      .catch((e) => console.error(e));
  },
};
