const fs = require('node:fs');
const path = require('node:path')
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle   } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
require("dotenv").config();
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

var assignableRoles = [];

let prefix = process.env.PREFIX;
let clientId = process.env.CLIENTID;
let guildId = process.env.GUILDID;
let token = process.env.DJS_TOKEN;

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

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const buttonID = interaction.customId;
        
        const member = interaction.member; // get member from the interaction - person who clicked the button

        let selectedRole = assignableRoles.find(role => role.name === buttonID)

        if (member.roles.cache.has(selectedRole.roleObj.id)) { // if they already have the role
            member.roles.remove(selectedRole.roleObj); // remove it
            return interaction.reply({
                content: 'Successfully removed role!',
                ephemeral: true
            });
        } else { // if they don't have the role
            member.roles.add(selectedRole.roleObj); // add it
            return interaction.reply({
                content: 'Successfully added role!',
                ephemeral: true
            })
        }
    }
    if(interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
	
});



client.on('messageCreate', async message => {
    if (message.author.bot) return;

    
	if (message.content === `${prefix}beep`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send({ content:'boop'});
    }
    
    if (message.content === `${prefix}bada bing`) {
        message.channel.send(`bada BOOP`);
    }

    if (message.content === `${prefix}moga`) {
        message.channel.send(`<@513546656659275787> ratio`);
    }

    if (message.content.toLowerCase().includes("cereal")) {
        message.channel.send(`Croutons are cereal.`);
    }
    if (message.content.toLowerCase().includes("crouton")) {
        message.react("1005984022125613138");
    }
    if (message.content.toLowerCase().includes("frog")) {
        message.react("746583626053058560");
    }
    if (message.content.toLowerCase().includes("coffee")) {
        message.react("827302879303434270");
    }
    if (message.content.toLowerCase().includes("drifloon")) {
        message.react("451612353256095744");
    }
    if (message.content.toLowerCase().includes("sleep")) {
        message.react("623594960024895509");
    }

    if (message.content === `${prefix}gameroles`) {
        const row = new ActionRowBuilder();
        for(var i = 0; i < 3; i++) {
            if(assignableRoles[i].type === "game") {
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId(assignableRoles[i].name)
                    .setLabel(assignableRoles[i].desc)
                    .setStyle('Primary'),
                    
                );
            }
        }
        const row2 = new ActionRowBuilder();
        for(var i = 3; i < assignableRoles.length; i++) {
            if(assignableRoles[i].type === "game") {
                row2.addComponents(
                    new ButtonBuilder()
                    .setCustomId(assignableRoles[i].name)
                    .setLabel(assignableRoles[i].desc)
                    .setStyle('Primary'),
                    
                );
            }
        }

        var inlineFields = assignableRoles.filter((role) => role.type == "game").map((role) => {
                return { name: role.desc, value: `<@&${role.roleObj.id}>`, inline: true };
        });
        let rolesEmbed = new EmbedBuilder();
        rolesEmbed.setColor(0x0099ff)
        rolesEmbed.setTitle('List of Assignable Roles')
        rolesEmbed.setDescription('These are the roles that you can assign yourselves. They are *pingable* roles for people to look for people to play games with. Do not assign yourself a role if you do not plan on playing the game the role is made for.')
        rolesEmbed.addFields({ name: '\u200B', value: '\u200B' })
            .addFields(inlineFields);
            
        message.channel.send({
            embeds: [rolesEmbed],
            components: [row, row2]
        })
        message.delete({ timeout: 1000 });
    }

    if (message.content === `${prefix}pronounroles`) {
        const row = new ActionRowBuilder();
        for(var i = 0; i < assignableRoles.length; i++) {
            if(assignableRoles[i].type === "pronoun") {
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId(assignableRoles[i].name)
                    .setLabel(assignableRoles[i].desc)
                    .setStyle('Success'),
                    
                );
            }
        }

        let rolesEmbed = new EmbedBuilder();
        rolesEmbed.setColor(0x0099ff)
        rolesEmbed.setTitle('List of Pronoun Roles')
        rolesEmbed.setDescription('These are the pronoun roles. They have no function other than showing up on your server profile.')

        message.channel.send({
            embeds: [rolesEmbed],
            components: [row]
        })
        message.delete({ timeout: 1000 });
    }
    
});

client.login(process.env.DJS_TOKEN);

