const shop = require("../../utils/schema/shop.js");
const list = require("../../utils/schema/list.js");
const {
  imageUrl,
  verif,
  bot,
  channelTesti,
  Owner,
  Admin,
  product,
  channelreps,
} = require("../../config.json");
const Bal = require("../../utils/schema/balance.js");
const Price = require("../../utils/schema/price.js");
const order = require("../../utils/schema/order.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "send",
  aliases: ["kirim"],
  description: "Send Item",
  accessableby: "admin",
  usage: "[Item Code] [Jumlah] (Optional, Default 1) [Tag User]",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0]) return message.reply("What would you like to send?");
    if (!message.mentions.users.first())
      return message.reply("Tag User U Want To Send!");
    let item = args[0];
    const getCode = await list
      .findOne({ code: item })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (!getCode) return message.reply("Code Not Found");
    let howmuch;
    let user;
    if (args[1].includes("<@") && args[1].includes(">")) {
      howmuch = 1;
    } else {
      howmuch = args[1];
      if (isNaN(howmuch)) return message.reply("Only Use Number For Amount");
    }
    user = message.mentions.users.first();

    const data = await shop
      .find({ code: item })
      .then((res) => {
        return res;
      })
      .catch(console.error);

    if (data.length == 0) return message.reply("No Stock Yet");

    if (Number(data.length) < Number(howmuch))
      return message.reply("Not That Much Stock");
    let sending = "";
    if (!item.includes("script")) {
      for (let i = 0; i < howmuch; i++) {
        let send = await shop
          .findOneAndDelete({ code: item })
          .then((res) => {
            return res;
          })
          .catch(console.error);
        sending += send.data + "\n";
      }
    } else {
      let send = await shop
        .findOne({ code: item })
        .then((res) => {
          return res;
        })
        .catch(console.error);
      sending += send.data;
    }
    try {
      const doneBuy = new MessageEmbed()
        .setTitle("**[History]** Send was Successfull")
        .setDescription(
          `Send was successfull ${verif}\nOwner successfully sending item ` +
            item +
            `\n\nDon't forget to give reps, <#${channelreps}>`
        )
        .setFooter("Farhan Store © 2020");
      client.users.send(user.id, {
        files: [
          {
            attachment: Buffer.from(sending),
            name: "order.txt",
          },
        ],
        embeds: [doneBuy],
      });
      client.users.send(Owner, {
        files: [
          {
            attachment: Buffer.from(sending),
            name: "order.txt",
          },
        ],
      });
      message.reply(`${user} Please Check your DM!`);
    } catch (e) {
      console.log(e);
      message.reply(
        `${user}, Did you turn off DM? if Yes u can dm Owner, if he is good maybe will be given your order :)`
      );
      client.users.send(Owner, {
        content: "This Is Error <@" + message.author.id + "> Order",
        files: [
          {
            attachment: Buffer.from(sending),
            name: "order.txt",
          },
        ],
      });
    }
    let orderN = await order
      .findOneAndUpdate({}, { $inc: { Order: 1 } }, { upsert: true, new: true })
      .then((d) => {
        return d?.Order;
      })
      .catch(console.error);
    if (!orderN) orderN = 1;
    const itemName = await list
      .findOne({ code: item })
      .then((res) => {
        return res?.name;
      })
      .catch(console.error);
    const testi = new MessageEmbed()
      .setTitle(`**#Order Purchase Number :** ` + orderN)
      .setDescription(
        `${bot} Sender : **<@` +
          message.author.id +
          `>**\n${product} Produk: **` +
          howmuch +
          " " +
          (itemName || "IDK Name") +
          `**\n\n${verif} **Verified Sender**`
      )
      .setTimestamp()
      .setFooter("Farhan Store © 2020");
    const ch = client.channels.cache.get(channelTesti);
    ch.send({ embeds: [testi] });
    const sendToOwner = new MessageEmbed()
      .setTitle("Send Item History")
      .setDescription(
        `
         Sender: <@${
           message.author.id?.toString()
             ? message.author.id.toString()
             : message.author.id
         }>
         Item: ${item}
         Amount: ${howmuch}
       `.replace(/ {2,}/g, "")
      )
      .setTimestamp()
      .setFooter("Farhan Store © 2020");
    client.users.send(Owner, { embeds: [sendToOwner] });
  },
};
