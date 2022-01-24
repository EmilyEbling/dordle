const fs = require('fs');

function parseMessage(message) {
    const wordleRegex = /Wordle \d{3} ([\dX])\/6\n{0,2}[⬛🟩🟨⬜]{5}/;
    const wordleMessage = message.content.match(wordleRegex);

    if (wordleMessage) {
        updateLeaderboard(message, wordleMessage);
    }
}

exports.parseMessage = parseMessage;

function updateLeaderboard(message, wordleMessage) {
    fs.readFile('data/leaderboard.json', (err, data) => {
        if (err) {
			console.log("Error reading file from disk:", err);
			return;
		}
        const leaderboard = JSON.parse(data);

        let score;
        if (wordleMessage[1] == 'X') {
            score = 0;
        } else {
            score = 7 - parseInt(wordleMessage[1]);
        }
        
        var pastScores = leaderboard[message.author.id];
        if (pastScores == undefined) {
            pastScores = [];
        }
        pastScores.push(score);
        leaderboard[message.author.id] = pastScores;

        fs.writeFile('data/leaderboard.json', JSON.stringify(leaderboard, null, '\t'), succeeded => {
            if (succeeded) {
                console.log("Leaderboard updated!");
                message.react('✅');

                reminder.updateSavedMessageLeaderboard(leaderboard);
            }
        });
    });
}