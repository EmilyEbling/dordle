const fs = require("fs");
const { MessageEmbed } = require('discord.js')
const { channelId } = require('../config.json');

function scheduleReminder(client) {
	fs.readFile('data\\time-settings.json', (err, data) => {
		if (err) {
			console.log("Error reading file from disk:", err);
			return;
		}
		const settings = JSON.parse(data);
		const timeDiff = settings.messageSchedule - Date.now();
		setTimeout(() => {
			remind(client, true);
		}, timeDiff);
	});
}

function remind(client, scheduledEvent = false) {
	fs.readFile('data\\time-settings.json', (err, data) => {
		if (err) {
			console.log("Error reading file from disk:", err);
			return;
		}
		const settings = JSON.parse(data);
		var channel = null;
		var wordleRoll = null;
		
		for (const [guildKey, guild] of client.guilds.cache) {
			for (const [channelKey, cachedChannel] of guild.channels.cache) {
				if (channelKey == channelId) {
					channel = cachedChannel;
				}
			}
	
			for (const [roleKey, role] of guild.roles.cache) {
				if (role.name == 'Dordle') {
					wordleRoll = role.id;
				}
			}
		}
	
		if (channel != null) {
			if (scheduledEvent) {
				const offsetTime = 86400000; // One day in milliseconds
				settings.messageSchedule += offsetTime;
				fs.writeFile('data\\time-settings.json', JSON.stringify(settings, null, '\t'), succeeded => {
					if (succeeded) {
						scheduleReminder(client);
					}
				});
			}
	
			sendLeaderboardMessage(channel, `New <@&${wordleRoll}>!`);
		}
		else {
			console.log('Channel undefined');
		}
	});	
}

function updateSavedMessageLeaderboard(leaderboard) {
    if (savedMessage !== null) {
        const editedEmbed = new MessageEmbed(savedMessage.embeds[0]);
        editedEmbed.setFields(getMessageFields(leaderboard));
        savedMessage.edit({ embeds: [editedEmbed] }).then(editedMessage => {
            savedMessage = editedMessage;
        });
    }
}

function sendLeaderboardMessage(channel, messageContent) {
	fs.readFile('data\\leaderboard.json', (err, data) => {
		if (err) {
			console.log("Error reading file from disk:", err);
			return;
		}
		const leaderboard = JSON.parse(data);
		const message = new MessageEmbed()
			.setTitle('Access Today\'s Wordle')
			.setURL('https://www.powerlanguage.co.uk/wordle/')
			.setDescription('Current Leaderboard')
			.setFields(getMessageFields(leaderboard));

		var m = null;
		if (messageContent == null) {
			m = { embeds: [message] };
		}
		else {
			m = { content: messageContent, embeds: [message] };
		}

		channel.send(m)
			.then(embededMessage => {
				savedMessage = embededMessage;
			});
	});
}

exports.scheduleReminder = scheduleReminder;
exports.remind = remind;
exports.updateSavedMessageLeaderboard = updateSavedMessageLeaderboard;
exports.sendLeaderboardMessage = sendLeaderboardMessage;

function getSortedLeaderboard(leaderboard_json) {
    var values = [];
    Object.entries(leaderboard_json).forEach(function([key, scores]) {
        total = 0;
        for (const value of scores) {
            total += value;
        }

        values.push({ "user": `<@${key}>`, "total": total, "average": total / scores.length })
    });
    values.sort(function(left, right) {
        return right.total - left.total
    })
    return values;
}

function getMessageFields(leaderboard) {
    var nameList = '';
    var averageList = '';
    var totalList = '';
    var numberOfItems = 0;
    var sumOfAll = 0;
    for (const entry of getSortedLeaderboard(leaderboard)) {
        nameList += `${entry.user}\n`;
        averageList += `${entry.average}\n`;
        totalList += `${entry.total}\n`;

        numberOfItems += entry.total / entry.average;
        sumOfAll += entry.total;
    }

    return [
        { name: 'User', value: nameList, inline: true },
        { name: 'Average', value: averageList, inline: true },
        { name: 'Total', value: totalList, inline: true },

        { name: 'Attempts', value: `${numberOfItems}`, inline: true },
        { name: 'Overall Average', value: `${sumOfAll / numberOfItems}`, inline: true },
        { name: 'Sum', value: `${sumOfAll}`, inline: true },
    ];
}