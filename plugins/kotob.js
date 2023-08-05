import cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

    let lister = [
        "down",
        "search",
        "category"
    ]

    let [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")
    if (!lister.includes(feature)) return m.reply("*Example:*\n.bimag search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))

    if (lister.includes(feature)) {

        if (feature == "search") {
            if (!inputs) return m.reply("Input query link\nExample: .bimag search|vpn")
            await m.reply(wait)
            try {
                let res = await searchAlarabimag(inputs)
                let teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

🔗 Link: ${item.url}
🖼️ Img: ${item.imageSrc}
📺 Title: ${item.title}
📜 Description: ${item.description}
`
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)

            } catch (e) {
                await m.reply(eror)
            }
        }
        
        if (feature == "category") {
            await m.reply(wait)
            try {
                let res = await categoryAlarabimag()
                let teks = res.map((item, index) => {
                    return `🔍 *[ RESULT ${index + 1} ]*

🔗 Link: ${item.link}
📺 Title: ${item.title}
`
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)

            } catch (e) {
                await m.reply(eror)
            }
        }

        if (feature == "down") {
            if (!inputs) return m.reply("Input query link\nExample: .bimag search|vpn")
            await m.reply(wait)
            try {
                let item = await downloadAlarabimag(inputs)
                let serverLinks = item.map((item) => {
                    return `🔗 Link: ${item}`
                }).filter(v => v).join("\n")
                
                await conn.sendFile(m.chat, item[0] || logo, "", "", m)

            } catch (e) {
                await m.reply(eror)
            }
        }

    }
}
handler.help = ["bimag"]
handler.tags = ["internet"]
handler.command = /^(kotob)$/i
export default handler

/* New Line */
async function searchAlarabimag(q) {
  const url = 'https://www.alarabimag.com/search/?q=' + q; // Replace with the actual URL you want to fetch
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  return $('.hotbooks').map((index, element) => ({
    title: $(element).find('h2 a').text().trim(),
    url: 'https://www.alarabimag.com' + $(element).find('h2 a').attr('href'),
    description: $(element).find('.info').text().trim(),
    imageSrc: 'https://www.alarabimag.com' + $(element).find('.smallimg').attr('src')
  })).get();
};

async function downloadAlarabimag(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const downloadLink = $('#download a').attr('href');
  const response2 = await fetch("https://www.alarabimag.com" + downloadLink);
    const data2 = await response2.text();
    const $2 = cheerio.load(data2);
    const links = $2('#download a').map((index, element) => 'https://www.alarabimag.com' + $(element).attr('href')).get();
    return links
};

async function categoryAlarabimag() {
const url = 'https://www.alarabimag.com'; // Replace 'YOUR_URL_HERE' with the actual URL you want to fetch.
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    return $('#hmenu ul li a').map((index, element) => ({
      title: $(element).text().trim(),
      link: url + $(element).attr('href').trim(),
    })).get();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
