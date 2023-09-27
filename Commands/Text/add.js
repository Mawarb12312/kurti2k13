const shop = require("../../utils/schema/shop.js");
const list = require("../../utils/schema/list.js");
const fs = require("fs");
const { Owner, Admin } = require("../../config.json");
const request = require("request");
const path = require("path");
const filePath = path.join(__dirname, "Data", "data.js");

module.exports = {
  name: "add",
  aliases: ["addstock"],
  description: "Add Stock Item",
  accessableby: "admin",
  usage: "[Code] [Data](Can Add More Than 1)",
  run: async (client, message, args) => {
    if (
      !message.author.bot &&
      !Admin.includes(message.author.id) &&
      message.author.id !== Owner
    )
      return message.reply("Only Admin And Owner Can Use This Command");
    if (!args[0]) return message.reply("What Item Code To Add?");
    const code = args.shift();
    const getCode = await list
      .find({ code: code })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    if (getCode.length < 1) return message.reply("Code Not Found");
    if (message.attachments.size > 0) {
      message.attachments.forEach((att) => {
        if (code.includes("script")) {
          request(att.url, async (err, res, body) => {
            if (err) return console.error(err);
            const script = body;
            await new shop({
              code: code,
              data: script,
            })
              .save()
              .then(console.log)
              .catch(console.error);
            message.reply("Script Added");
          });
        } else {
          request(att.url, async (err, res, body) => {
            if (err) return console.error(err);
            const items = body.split(/[\n\r\s]+/);
            if (items.length == 0) return message.reply("No Item There");
            for (let item of items) {
              await new shop({
                code: code,
                data: item,
              })
                .save()
                .then(console.log)
                .catch(console.error);
            }
            message.reply("Item Added");
          });
        }
      });
    } else {
      if (!args[0]) return message.reply("What Item U Want To Add?");
      const items = args;

      items.forEach(async (item) => {
        await new shop({
          code: code,
          data: item,
        })
          .save()
          .then(console.log)
          .catch(console.error);
      });
      message.reply(`Item Added ` + code + `!`);
    }
  },
};
