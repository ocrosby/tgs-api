'use strict';

const axios = require('axios').default;
const { urlencoded } = require('body-parser');
const cheerio = require('cheerio');

const urls = {
    tracker: 'https://www.topdrawersoccer.com/college-soccer-articles/2022-womens-di-transfer-tracker_aid50187'
};

const config = {
    responseEncoding: 'binary',
    decodeEntities: false
};

function normalizeName(text) {
    text = encodeURI(text);
    
    if (text.indexOf('%C2%A0') > 0) {
        text = text.replace('%C2%A0', '%20');
    }

    text = decodeURI(text);

    return text;
}

function getPosition(text) {
    return text.split(/ (.*)/)[0];
}

function getName(text) {
    return text.split(/ (.*)/)[1];
}

function arrayContainsString(array, value) {
    let index;

    for (index = 0 ; index < array.length ; index++) {
        if (array[index] === value) {
            return true;
        }
    }

    return false;
}

const webScraper = async () => {
    const html = await axios.get(urls.tracker);
    const $ = await cheerio.load(html.data.toString('latin1'), config);
    let players = [];

    const playerCollection = $('div.col tr');

    playerCollection.each((index, el) => {
        const player = {
            id: index,
            name: '',
            position: '',
            formerSchool: '',
            newSchool: ''
        };

        const tds = $(el).find('td');

        let nameField = $(tds[0]).text();

        nameField = nameField.trim();
        nameField = normalizeName(nameField);

        if (player.name !== 'Player') {        
            player.position = getPosition(nameField);
            player.name = getName(nameField);
            player.formerSchool = $(tds[1]).text().trim();
            player.newSchool = $(tds[2]).text().trim();

            players.push(player);
        }
    });

    let data = {
        players: players,
        playerCount: players.length,
        schools: [],
        srcSchools: [],
        dstSchools: []
    };

    data.players.forEach(player => {
        if (player.formerSchool !== '' && !arrayContainsString(data.schools, player.formerSchool)) {
            data.schools.push(player.formerSchool);
        }

        if (player.newSchool !== '' && !arrayContainsString(data.schools, player.newSchool)) {
            data.schools.push(player.newSchool);
        }

        if (player.formerSchool !== '' && !arrayContainsString(data.srcSchools, player.formerSchool)) {
            data.srcSchools.push(player.formerSchool);
        }

        if (player.newSchool !== '' && !arrayContainsString(data.dstSchools, player.newSchool)) {
            data.dstSchools.push(player.newSchool);
        }
    });

    data.schools.sort();
    data.srcSchools.sort();
    data.dstSchools.sort();

    data.map = [];

    data.schools.forEach(school => {
        let record = { school: school, in: 0, out: 0 }

        data.players.forEach(player => {
            if (player.formerSchool === school) {
                record.out += 1;
            }

            if (player.newSchool === school) {
                record.in += 1;
            }
        });

        data.map.push(record);
    });

    // console.log(data);

    data.map.forEach(record => {
        console.log(`${record.school},${record.in},${record.out}`);
    });
}

webScraper();