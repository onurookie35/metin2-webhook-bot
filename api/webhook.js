// api/webhook.js - Vercel Serverless Function
const https = require('https');
const { URL } = require('url');

// Environment variables
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const STATUS_WEBHOOK_URL = process.env.STATUS_WEBHOOK_URL;

// Haftalık mesaj programı (0=Pazartesi, 6=Pazar)
const WEEKLY_MESSAGES = {
    0: [ // Pazartesi
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Münzevi Tavsiyesi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/f/fe/M%C3%BCnzevi_Tavsiyesi.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Yeşil Ejderha Fasulyesi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/5/51/Ye%C5%9Fil_Ejderha_Fasulyesi.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Kutsama Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/e/ef/Kutsama_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Nugget eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/2/27/Nugget_M%C3%BChr%C3%BC_%28Ye%C5%9Fil%29.png"
        }
    ],
    1: [ // Salı
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Güneş Özütü eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/1/1d/G%C3%BCne%C5%9F_%C3%96z%C3%BCt%C3%BC_%28%C3%96%29.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Cor Draconis eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/2/26/Cor_Draconis.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Küçük Kutsama eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/f/f2/K%C3%BC%C3%A7%C3%BCk_Kutsama.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Nesneyi Efsunla eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/e/ee/Efsun_Nesnesi.png"
        }
    ],
    2: [ // Çarşamba
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Balıkçılık eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/9/9d/Bal%C4%B1k%C3%A7%C4%B1l%C4%B1k_K%C4%B1lavuzu.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Kutsama Küresi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/d/d2/Kutsama_K%C3%BCresi.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Münzevi Tavsiyesi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/f/fe/M%C3%BCnzevi_Tavsiyesi.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Süper Taş eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/8/8b/Metinstein-Rufrolle.png"
        }
    ],
    3: [ // Perşembe
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Ay Özütü eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/d/d0/Ay_%C3%96z%C3%BCt%C3%BC_%28%C3%96%29.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Küçük Kutsama eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/f/f2/K%C3%BC%C3%A7%C3%BCk_Kutsama.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Cor Draconis eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/2/26/Cor_Draconis.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Arttırma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/7/78/Artt%C4%B1rma_Ka%C4%9F%C4%B1d%C4%B1.png"
        }
    ],
    4: [ // Cuma
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Yeşil Ejderha Fasulyesi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/5/51/Ye%C5%9Fil_Ejderha_Fasulyesi.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Nesneyi Efsunla eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/e/ee/Efsun_Nesnesi.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Süper Taş eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/8/8b/Metinstein-Rufrolle.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Cor Draconis eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/2/26/Cor_Draconis.png"
        }
    ],
    5: [ // Cumartesi
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Kutsama Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/e/ef/Kutsama_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Balıkçılık eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/9/9d/Bal%C4%B1k%C3%A7%C4%B1l%C4%B1k_K%C4%B1lavuzu.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Robin (Yağma) (1 Gün) eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/9/90/Robin_%28Ya%C4%9Fma%29.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Ay Işığı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/6/62/Ay%C4%B1%C5%9F%C4%B1%C4%9F%C4%B1_Define_Sand%C4%B1%C4%9F%C4%B1.png"
        }
    ],
    6: [ // Pazar - Test mesajları kaldırıldı
        // Pazar günü eventleri buraya eklenebilir
    ]
};

// Webhook mesajı gönderme fonksiyonu
async function sendWebhookMessage(messageData, dayName) {
    if (!WEBHOOK_URL) {
        throw new Error('WEBHOOK_URL environment variable not found');
    }

    const embed = {
        title: messageData.title,
        description: messageData.message,
        color: messageData.color,
        timestamp: new Date().toISOString(),
        footer: {
            text: `Code: ${messageData.code} | ${dayName}`
        }
    };

    if (messageData.image_url) {
        embed.image = { url: messageData.image_url };
    }

    const payload = {
        embeds: [embed]
    };

    return new Promise((resolve, reject) => {
        const url = new URL(WEBHOOK_URL);
        const postData = JSON.stringify(payload);

        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode === 204) {
                console.log(`✅ Başarıyla gönderildi: ${messageData.title}`);
                resolve(true);
            } else {
                console.error(`❌ HTTP ${res.statusCode} hatası`);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            console.error(`❌ Request hatası: ${error}`);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Status mesajı gönderme fonksiyonu
async function sendStatusMessage(status, details, nextEventInfo = null) {
    if (!STATUS_WEBHOOK_URL) return;

    const fields = [
        {
            name: "📅 Tarih",
            value: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
            inline: true
        },
        {
            name: "ℹ️ Detay",
            value: details,
            inline: false
        }
    ];

    if (nextEventInfo) {
        fields.push({
            name: "⏰ Bir Sonraki Event",
            value: nextEventInfo,
            inline: false
        });
    }

    const embed = {
        embeds: [{
            title: "🤖 Bot Durumu",
            description: status,
            fields: fields,
            color: status.includes("EVENT ZAMANI") ? 0x00ff00 : 
                   status.includes("HATA") ? 0xff0000 : 0x808080,
            timestamp: new Date().toISOString(),
            footer: {
                text: "Metin2 Event Bot - Vercel Deployment"
            }
        }]
    };

    return new Promise((resolve, reject) => {
        const url = new URL(STATUS_WEBHOOK_URL);
        const postData = JSON.stringify(embed);

        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode === 204) {
                console.log(`📊 Status mesajı gönderildi`);
                resolve(true);
            } else {
                console.error(`❌ Status mesajı HTTP ${res.statusCode} hatası`);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            console.error(`❌ Status request hatası: ${error}`);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

// Gün ismi alma fonksiyonu
function getDayName(dayIndex) {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return days[dayIndex];
}

// Gelişmiş bir sonraki event bilgisi
function getDetailedNextEventInfo(currentMappedDay, currentHour, currentMinute) {
    const currentTime = currentHour * 60 + currentMinute;
    
    // Bugünün kalan eventlerini kontrol et
    const todayMessages = WEEKLY_MESSAGES[currentMappedDay] || [];
    for (const message of todayMessages) {
        const eventTime = message.hour * 60 + message.minute;
        if (eventTime > currentTime) {
            const hoursLeft = Math.floor((eventTime - currentTime) / 60);
            const minutesLeft = (eventTime - currentTime) % 60;
            const timeStr = `${message.hour}:${message.minute.toString().padStart(2, '0')}`;
            
            return {
                time: timeStr,
                title: message.title.split(' (')[0],
                timeLeft: hoursLeft > 0 ? `${hoursLeft}s ${minutesLeft}dk` : `${minutesLeft}dk`,
                fullInfo: `**${timeStr}** - ${message.title.split(' (')[0]} *(${hoursLeft > 0 ? `${hoursLeft}s ${minutesLeft}dk` : `${minutesLeft}dk`} sonra)*`
            };
        }
    }
    
    // Yarının ilk eventini bul
    let nextDay = (currentMappedDay + 1) % 7;
    let daysAhead = 1;
    
    while (daysAhead <= 7) {
        const tomorrowMessages = WEEKLY_MESSAGES[nextDay] || [];
        if (tomorrowMessages.length > 0) {
            const firstEvent = tomorrowMessages[0];
            const dayName = getDayName(nextDay);
            const timeStr = `${firstEvent.hour}:${firstEvent.minute.toString().padStart(2, '0')}`;
            
            return {
                time: timeStr,
                title: firstEvent.title.split(' (')[0],
                timeLeft: daysAhead === 1 ? 'Yarın' : `${daysAhead} gün sonra`,
                fullInfo: `**${dayName} ${timeStr}** - ${firstEvent.title.split(' (')[0]} *(${daysAhead === 1 ? 'Yarın' : `${daysAhead} gün sonra`})*`
            };
        }
        nextDay = (nextDay + 1) % 7;
        daysAhead++;
    }
    
    return {
        time: "Bilinmiyor",
        title: "Event bulunamadı",
        timeLeft: "N/A",
        fullInfo: "❓ Bir sonraki event bilgisi bulunamadı"
    };
}

// Bir sonraki mesajı bulma fonksiyonu
function getNextMessage() {
    // Türkiye saati hesaplama (UTC+3)
    const now = new Date();
    const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    const currentDay = turkeyTime.getDay();
    const currentHour = turkeyTime.getHours();
    const currentMinute = turkeyTime.getMinutes();
    
    // Gün mapping (JavaScript: 0=Pazar, bizim: 0=Pazartesi)
    const dayMapping = { 
        0:
