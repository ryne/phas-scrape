const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const urls = [
  'https://phasmophobia.fandom.com/wiki/Banshee',
  'https://phasmophobia.fandom.com/wiki/Demon',
  'https://phasmophobia.fandom.com/wiki/Goryo',
  'https://phasmophobia.fandom.com/wiki/Hantu',
  'https://phasmophobia.fandom.com/wiki/Jinn',
  'https://phasmophobia.fandom.com/wiki/Mare',
  'https://phasmophobia.fandom.com/wiki/Myling',
  'https://phasmophobia.fandom.com/wiki/Obake',
  'https://phasmophobia.fandom.com/wiki/Oni',
  'https://phasmophobia.fandom.com/wiki/Onryo',
  'https://phasmophobia.fandom.com/wiki/Phantom',
  'https://phasmophobia.fandom.com/wiki/Poltergeist',
  'https://phasmophobia.fandom.com/wiki/Raiju',
  'https://phasmophobia.fandom.com/wiki/Revenant',
  'https://phasmophobia.fandom.com/wiki/Shade',
  'https://phasmophobia.fandom.com/wiki/Spirit',
  'https://phasmophobia.fandom.com/wiki/The_Mimic',
  'https://phasmophobia.fandom.com/wiki/The_Twins',
  'https://phasmophobia.fandom.com/wiki/Wraith',
  'https://phasmophobia.fandom.com/wiki/Yokai',
  'https://phasmophobia.fandom.com/wiki/Yurei',
];

ghosts = [];

for (let i = 0; i < urls.length; i++) {
  axios(urls[i]).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const name = $('#content aside.portable-infobox > h2').text();

    const evidence_1_name = $(
      '#content aside.portable-infobox section.pi-group section.pi-smart-group-body > div:nth-child(1) > a'
    ).attr('title');
    const evidence_1_url = `${$(
      '#content aside.portable-infobox section.pi-group section.pi-smart-group-body > div:nth-child(1) > a > img'
    )
      .attr('src')
      .split('.')
      .slice(0, -1)
      .join('.')}.png`;

    const evidence_2_name = $(
      '#content aside.portable-infobox section.pi-group section.pi-smart-group-body > div:nth-child(2) > a'
    ).attr('title');
    const evidence_2_url = `${$(
      '#content aside.portable-infobox section.pi-group section.pi-smart-group-body > div:nth-child(2) > a > img'
    )
      .attr('src')
      .split('.')
      .slice(0, -1)
      .join('.')}.png`;

    const evidence_3_name = $(
      '#content aside.portable-infobox section.pi-group section.pi-smart-group-body > div:nth-child(3) > a'
    ).attr('title');
    const evidence_3_url = `${$(
      '#content aside.portable-infobox section.pi-group section.pi-smart-group-body > div:nth-child(3) > a > img'
    )
      .attr('src')
      .split('.')
      .slice(0, -1)
      .join('.')}.png`;

    const strength = $(
      '#content aside.portable-infobox div[data-source="strength"] > div'
    ).text();

    const weakness = $(
      '#content aside.portable-infobox div[data-source="weakness(es)"] > div'
    ).text();

    const abilities = $(
      '#content aside.portable-infobox div[data-source="abiliti(es)"] > div'
    ).text();

    const behavior = $('#Behaviour')
      .parent()
      .nextUntil('h2')
      .each(function () {
        $(this).find('sup').remove();
      })
      .text();

    const strategies = $('#Strategies')
      .parent()
      .nextUntil('h2')
      .each(function () {
        $(this).find('sup').remove();
      })
      .text();

    ghosts.push({
      name: name,
      evidence: {
        0: { name: evidence_1_name, img: evidence_1_url },
        1: { name: evidence_2_name, img: evidence_2_url },
        2: { name: evidence_3_name, img: evidence_3_url },
      },
      strength: strength,
      weakness: weakness,
      abilities: abilities,
      behavior: behavior,
      strategies: strategies,
      excluded: false,
    });

    if (ghosts.length === urls.length) {
      fs.writeFile(`ghosts.txt`, JSON.stringify(ghosts), function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `Successfully parsed ${ghosts.length} ghosts to ghosts.txt!`
          );
        }
      });
    }
  });
}
