const { MessageEmbed } = require("discord.js");
const Bal = require("../../utils/schema/balance.js");
const {
  wl,
  bot,
  panah,
  } = require("../../config.json");
module.exports = {
  name: "check",
  aliases: ["check"],
  accessableby: "admin",
  description: "Shows Current Balance",
  usage: "[GrowID U Want To Check Or Tag User] (Optional)",
  run: async (client, message, args) => {
    async function getDiscordID(growID) {
      const data = await Bal.findOne({ GrowID: growID })
        .then((d) => {
          return d?.DiscordID;
        })
        .catch((e) => console.error(e));
      return data;
    }
    let dcId = await getDiscordID(args[0]);
    if (!dcId && !message.mentions.users.first())
      message.reply("GrowID Not Found, Show Ur Balance");
    // console.log(dcId);

    let user = message.mentions.users.first()?.id
      ? message.mentions.users.first().id
      : dcId
      ? dcId
      : message.author.id;
    if (!user)
      return m.reply("Can't Find DiscordID Registered With That GrowID");
    let wallet1 = await Bal.findOne({ DiscordID: user })
      .then((d) => {
        return d;
      })
      .catch((e) => console.error(e));

    if (!wallet1)
      return message.reply(
        "The user with the GrowID you provided or the tagged user was not found"
      );
    let wallet = wallet1.Balance;
    // message.reply(wallet1.DiscordID);

    let Balance = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Total Balance`)
      .setTimestamp()
      .setFooter("This is Balance " + wallet1.GrowID)
      .setDescription(
        `${bot} **GrowID : **` +
          wallet1.GrowID +
          "\n\n" +
          ` Balance In This Server: \n${panah} **` +
          wallet +
          `** ${wl}`
      );
    message.channel.send({ embeds: [Balance] });
  },
};
