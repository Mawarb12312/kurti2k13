const { MessageEmbed } = require("discord.js");
const { Prefix, Owner, Admin } = require("../../config.json");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Help Command",
  usage: `[Command Name] (Optional)`,
  accessableby: "everyone",
  run: async (client, message, args) => {
    if (!args[0]) {
      const publicCmds = [];
      const adminCmds = [];

      client.commands.forEach((command) => {
        const cmdString = `${command.name}`;
        if (command.accessableby === "everyone") {
          publicCmds.push(cmdString);
        } else if (command.accessableby === "admin") {
          adminCmds.push(cmdString);
        }
      });

      const publicCmdList = publicCmds.join("\n");
      const adminCmdList = adminCmds.join("\n");
      let text;
      if (
        !message.author.bot &&
        message.author.id !== Admin[0] &&
        message.author.id !== Admin[1] &&
        message.author.id !== Owner
      ) {
        text = "**Public Commands**\n" + publicCmdList;
      } else {
        text =
          "**Admin Commands**\n" +
          adminCmdList +
          "\n\n**Public Commands**\n" +
          publicCmdList;
      }
      const help = new MessageEmbed()
        .setTitle("Help Command")
        .setDescription("This is a list of commands in this bot : \n" + text)
        .setFooter(`Farhan Store © 2020`)
        .setTimestamp()
        .setColor("RANDOM");
      message.channel.send({ embeds: [help] });
    } else {
      const name = args[0].toLowerCase();
      const cmd =
        message.client.commands.get(name) ||
        message.client.commands.find(
          (c) => c?.aliases && c?.aliases?.includes(name)
        );
      const alias = cmd?.aliases ? cmd?.aliases : "No Aliases";

      if (!cmd) return message.reply("Sorry, But That Command Is Invalid");

      const help1 = new MessageEmbed()
        .setTitle("Help Command For Command " + name)
        .addField("Name :", `${Prefix}${cmd.name}`)
        .addField("Description :", `${cmd.description}`)
        .addField("Usage :", `${Prefix}${cmd.name} ${cmd.usage || ""}`)
        .addField(
          "Alias : ",
          `${alias.length > 0 ? alias.join(", ") : "No Aliases"}`
        )
        .setFooter("Farhan Store © 2020")
        .setTimestamp()
        .setColor("RANDOM");

      message.channel.send({ embeds: [help1] });
    }
  },
};
