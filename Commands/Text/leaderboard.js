const Bal = require("../../utils/schema/balance.js")
const { MessageEmbed } = require("discord.js")
const { bot, wl } = require("../../config.json");
module.exports = {
    name: "leaderboard",
    aliases: ["top", "lb"],
    description: "Shows Top 10 Most Balances",
    accessableby: "everyone",
    usage: "",
    run: async (client, message, args) => {
    let Data = ""
    await Bal.find({})
        .sort({ Balance: -1 })
        .limit(10)
        .then(data => {
            data.forEach((d, index) => {
               console.log(index)
               console.log(d.GrowID + "\n" + d.DiscordID)
               console.log(d.Balance)
               Data += `${index + 1}. ${bot} ${d.GrowID} : ${d.Balance} ${wl}\n`
            })
        })
        console.log(Data)
        const embed = new MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription(`${Data}`)
          .setTimestamp()
          .setFooter("Farhan Store © 2020")
          .setColor("RANDOM");
        message.channel.send({ embeds: [embed] })
    }
}