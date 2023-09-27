const depo = require("../../utils/schema/depo.js");
const { MessageEmbed } = require("discord.js");
const dl = require("../../utils/schema/dl.js");
const {
  owner,
  list,
  saweria,
  bot,
  Saweria,
  world,
} = require("../../config.json");

module.exports = {
  name: "depo",
  aliases: ["d"],
  description: "Show World Deposit",
  accessableby: "everyone",
  usage: "",
  run: async (client, message, args) => {
    const deposit = await depo
      .findOne({})
      .then((d) => {
        console.log(d);
        return d;
      })
      .catch((e) => console.error(e));
    const rateDl = await dl
      .findOne({})
      .then((res) => {
        return res?.Rate;
      })
      .catch(console.error);

    const user = message.author;
    const embed = new MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle(`${list} **Depo Worlds** ${list}`)
      .setDescription(
        `${world} World : **` +
          (deposit?.world ? deposit.world : "Not Set Yet") +
          `**\n${owner} Owner : **` +
          (deposit?.owner ? deposit.owner : "Not Set Yet") +
          `**\n${bot} Bot Name : **` +
          (deposit?.botName ? deposit.botName : "Not Set Yet") +
          `**\n${saweria} Saweria Link : **` +
          (!rateDl && deposit?.Saweria != "No Set"
            ? "Owner Hasn't Set DL Rate for Saweria"
            : deposit?.Saweria == "No Set"
            ? "I Don't Accept Payment Using Saweria"
            : deposit?.Saweria) +
          "**" +
          `\n**If bot not in the world, Please screenshot then send to ticket channel**`
      )
      .setFooter("If Bot Isn't In The World Screenshot");
    user.send({ embeds: [embed] });
    message.reply(
      `Please check your DM! Don't forget to screenshot <@${
        message.author.id?.toString()
          ? message.author.id.toString()
          : message.author.id
      }>`
    );
  },
};
