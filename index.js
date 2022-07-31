const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config();

var assignableRoles = [];

let prefix = process.env.PREFIX;

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity('YOUR COMMANDS :-)', { type: 'WATCHING' });
    let floonTown = client.guilds.cache.find(guild => guild.name === "Floon Town");
    assignableRoles = [
        {name:"ffxiv", desc: "Final Fantasy XIV", type: "game"},
        {name:"pkmn raids", desc: "Pokemon SwSh Raids", type: "game"},
        {name: "league of legs", desc: "League of Legends", type: "game"},
        {name:"buster", desc: "Yokai Watch Busters", type: "game"},
        {name: "minecraft", desc: "Minecraft", type: "game"},
        {name: "party gamer", desc: "Party Games", type: "game"},
        {name: "she/her", desc: "she/her", type: "pronoun"},
        {name: "he/him", desc: "he/him", type: "pronoun"},
        {name: "they/them", desc: "they/them", type: "pronoun"},
    ];
    assignableRoles = assignableRoles.map((role) => {
        var foundRole = floonTown.roles.cache.find(channel => channel.name === role.name);
        if(foundRole !== undefined) {
            role.roleObj = foundRole;
            return role;
        }
    });
});

const adminRoles = [
    "floon",
    "michael"
];

client.on('message', message => {
    let member = message.member;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command)  {
        case "assign" :
            if (!args.length) {
                return message.channel.send(`Beep. You didn't say which role you wanted, ${message.author}.`);
            } else {
                var roleName = args.join(" ");
                let selectedRole = assignableRoles.find(role => role.name === roleName);

                // Cases: Role is not assignable, role doesn't exist, user already has role
                if(selectedRole == undefined && message.guild.roles.cache.find(channel => channel.name === roleName) !== undefined) {
                    return message.channel.send(`Beep. I see you trying to assign yourself a role that isn't on my assignable role list. >:)`);
                } else if(selectedRole == undefined || selectedRole.roleObj == undefined) {
                    return message.channel.send(`Beep. ${roleName} is not a role. The role name is case sensitive.`);
                } else if( selectedRole.roleObj !== undefined && member.roles.cache.has(selectedRole.roleObj.id)) {
                    return message.channel.send(`Beep. You already have this role. :-)`);
                }
    
                // Add role
                member.roles.add(selectedRole.roleObj).then(() => {
                    return message.channel.send(`Beep. The role you have assigned yourself is ${roleName}.`);
                }).catch((err) => {
                    console.log(err);
                    return message.channel.send(`Beep. ERROR.`);
                });
                
            }
            break;
            case "remove" :
                if (!args.length) {
                    return message.channel.send(`Beep. You didn't say which role you wanted to remove, ${message.author}.`);
                } else {
                    var roleName = args.join(" ");
                    let selectedRole = assignableRoles.find(role => role.name === roleName);
    
                    // Cases: Role is not assignable, role doesn't exist, user doesn't have role
                    if(selectedRole == undefined && message.guild.roles.cache.find(channel => channel.name === roleName) !== undefined) {
                        return message.channel.send(`Beep. This is not a role that you can remove.`);
                    } else if(selectedRole == undefined || selectedRole.roleObj == undefined) {
                        return message.channel.send(`Beep. ${roleName} is not a role. The role name is case sensitive.`);
                    } else if( selectedRole.roleObj !== undefined && !member.roles.cache.has(selectedRole.roleObj.id)) {
                        return message.channel.send(`Beep. You don't have this role.`);
                    } else if(member.roles.cache.has(selectedRole.roleObj.id)) {
                        // Remove role
                        member.roles.remove(selectedRole.roleObj).then(() => {
                            return message.channel.send(`Beep. The role you have removed from yourself is ${roleName}.`);
                        }).catch((err) => {
                            console.log(err);
                            return message.channel.send(`Beep. ERROR.`);
                        });
                    }
        
                    
                    
                }
                break;
        case "embed":
            var foundAdminRole = false;
            adminRoles.forEach(adminRole => {
                let foundRole = message.guild.roles.cache.find(channel => channel.name === adminRole);
                if(foundRole !== undefined ) {
                    foundAdminRole = true;
                }
            })
            if(!foundAdminRole ) {
                return;
            }
            if (!args.length) {
                return message.channel.send(`Beep. You didn't say which message you wanted to embed, ${message.author}.`);
            } 
            let embedName = args.join(" ");
            if(embedName === "roles") {
                var inlineFields = assignableRoles.filter((role) => role.type == "game").map((role) => {
                    if(role.type == "game") {
                        return { name: role.desc, value: `<@&${role.roleObj.id}>`, inline: true }
                    }
                })
                const rolesEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('List of Assignable Roles')
                    .setDescription('These are the roles that you can assign yourselves. They are *pingable* roles for people to look for people to play games with. Do not assign yourself a role if you do not plan on playing the game the role is made for.  ```\n!assign role name```')
                    .addField('\u200B', '\u200B')
                    .addFields(inlineFields)
                    message.delete({ timeout: 1000 });
                    return message.channel.send(rolesEmbed);
                    
            }
            if(embedName === "pronouns") {
                var inlinePronounFields = assignableRoles.filter((role) => role.type == "pronoun").map((role) => {
                        return { name: role.desc, value: `<@&${role.roleObj.id}>`, inline: true }
                })
                const rolesEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('List of Pronoun Roles')
                    .setDescription('These are the pronoun roles. They have no function other than showing up on your server profile.  ```\n!assign role name```')
                    .addField('\u200B', '\u200B')
                    .addFields(inlinePronounFields)
                    message.delete({ timeout: 1000 });
                    return message.channel.send(rolesEmbed);
                    
            }
            
            break;
    }

	if (message.content === `${prefix}beep`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('boop');
    }
    
    if (message.content === `${prefix}bada bing`) {
        message.channel.send(`bada BOOP`);
    }

    if (message.content === `${prefix}moga`) {
        message.channel.send(`<@513546656659275787> ratio`);
    }
});

client.login(process.env.DJS_TOKEN);

