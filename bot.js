const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
const Enmap = require('enmap');
const config = require("./config.json");

client.config = config;

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  console.log("Command prefix is: " + client.config.prefix);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
    console.log("Loaded");
  });
  console.log("All commands loaded successfully!");
});

client.on("message", (message) => {
  
  if (message.author.bot) return;
  if (message.content.indexOf(client.config.prefix) != 0) return;
  
  if (message.channel.name != client.config.channel){
    message.delete();
    return;
  }
  
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  try{
    cmd.run(client, message, args);
  }catch(e){
    if(client.config.debug == true){
      console.log(console.log(e.message));
    }
  }
});

client.login(process.env.BOT_TOKEN);
