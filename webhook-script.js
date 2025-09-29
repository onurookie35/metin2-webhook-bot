const https = require('https');
const { URL } = require('url');

// Webhook URL'leri environment variable'dan al
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const STATUS_WEBHOOK_URL = process.env.STATUS_WEBHOOK_URL;

if (!WEBHOOK_URL) {
    console.error('WEBHOOK_URL environment variable bulunamadı!');
    process.exit(1);
}

// Haftalık mesaj programı (0=Pazartesi, 6=Pazar)
const WEEKLY_MESSAGES = {
    0: [ // Pazartesi
        {
            hour: 10, minute: 30,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Münzevi Tavsiyesi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/f/fe/M%C3%BCnzevi_Tavsiyesi.png"
        },
        {
            hour: 10, minute: 40,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Yeşil Ejderha Fasulyesi eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/5/51/Ye%C5%9Fil_Ejderha_Fasulyesi.png"
        },
        {
            hour: 10, minute: 45,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Kutsama Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/e/ef/Kutsama_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 10, minute: 50,
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
    6: [ // Pazar
        {
            hour: 1, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Kötü Ruh Kovma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 13, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Arttırma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/7/78/Artt%C4%B1rma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 17, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Kötü Ruh Kovma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 21, minute: 0,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Liderin Kitabı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/8/8b/Liderin_Kitab%C4%B1.png"
        }
    ]
};

// Webhook mesajı gönderme fonksiyonu
async function sendWebhookMessage(messageData, dayName) {
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

// Status mesajı gönderme fonksiyonu (Log kanalı için)
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
                text: "Metin2 Event Bot - Status Log"
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
    const todayMessages = WEEKLY_MESSAGES[currentMappedDay];
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
        const tomorrowMessages = WEEKLY_MESSAGES[nextDay];
        if (tomorrowMessages && tomorrowMessages.length > 0) {
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

// Bir sonraki event bilgisi
function getNextEventInfo(currentMappedDay, currentHour, currentMinute) {
    const detailed = getDetailedNextEventInfo(currentMappedDay, currentHour, currentMinute);
    return detailed.fullInfo;
}

// Bir sonraki mesajı bulma fonksiyonu
function getNextMessage() {
    const now = new Date();
    const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    const currentDay = turkeyTime.getDay();
    const currentHour = turkeyTime.getHours();
    const currentMinute = turkeyTime.getMinutes();
    
    const dayMapping = { 
        0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5
    };
    const mappedDay = dayMapping[currentDay];
    const todayMessages = WEEKLY_MESSAGES[mappedDay];
    
    console.log(`=== DEBUG BİLGİLERİ ===`);
    console.log(`Türkiye saati: ${turkeyTime.toLocaleString('tr-TR')}`);
    console.log(`Kontrol saati: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
    console.log(`Gün: ${getDayName(mappedDay)}`);
    console.log(`Bugünün mesaj sayısı: ${todayMessages ? todayMessages.length : 0}`);
    
    if (todayMessages) {
        console.log(`Bugünün event saatleri:`);
        todayMessages.forEach((msg, index) => {
            const eventTime = `${msg.hour}:${msg.minute.toString().padStart(2, '0')}`;
            const timeDiff = Math.abs((msg.hour * 60 + msg.minute) - (currentHour * 60 + currentMinute));
            console.log(`  ${index}: ${eventTime} - ${msg.title} (Fark: ${timeDiff} dk)`);
        });
    }
    
    // ±5 dakika tolerans (GitHub Actions gecikmesi için)
    for (const message of todayMessages) {
        const eventTimeMinutes = message.hour * 60 + message.minute;
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        const timeDifference = Math.abs(eventTimeMinutes - currentTimeMinutes);
        
        if (timeDifference <= 5) {
            console.log(`🎯 EVENT TESPİT EDİLDİ: ${message.title} (${timeDifference} dk farkla)`);
            
            const nextEventInfo = getDetailedNextEventInfo(mappedDay, currentHour, currentMinute);
            return { 
                message, 
                dayName: getDayName(mappedDay), 
                shouldSend: true,
                nextEventInfo: nextEventInfo
            };
        }
    }
    
    const nextEventInfo = getDetailedNextEventInfo(mappedDay, currentHour, currentMinute);
    return { 
        shouldSend: false, 
        currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`,
        nextEvent: getNextEventInfo(mappedDay, currentHour, currentMinute),
        nextEventInfo: nextEventInfo
    };
}

// Ana fonksiyon
async function main() {
    try {
        const now = new Date();
        const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
        console.log(`🤖 Bot kontrol ediyor - Türkiye saati: ${turkeyTime.toLocaleString('tr-TR')}`);
        
        const result = getNextMessage();
        
        if (result.shouldSend) {
            console.log(`🎯 EVENT ZAMANI! Mesaj gönderiliyor...`);
            console.log(`📢 Gönderilecek mesaj: ${result.message.title}`);
            const success = await sendWebhookMessage(result.message, result.dayName);
            
            if (success) {
                console.log(`✅ BAŞARILI: ${result.message.title} mesajı gönderildi!`);
                
                const statusDetails = `**${result.message.title}** mesajı başarıyla gönderildi!`;
                const nextEventText = result.nextEventInfo ? result.nextEventInfo.fullInfo : "Bilinmiyor";
                await sendStatusMessage("🎯 EVENT ZAMANI!", statusDetails, nextEventText);
                
                if (result.nextEventInfo) {
                    console.log(`⏭️ Bir sonraki event: ${result.nextEventInfo.fullInfo}`);
                }
            } else {
                console.log(`❌ HATA: Mesaj gönderilemedi`);
                await sendStatusMessage("❌ HATA", "Mesaj gönderilemedi");
            }
        } else {
            console.log(`⏰ Event zamanı değil - Şu anki saat: ${result.currentTime}`);
            console.log(`📅 ${result.nextEvent}`);
            
            if (result.nextEventInfo) {
                console.log(`⏳ Kalan süre: ${result.nextEventInfo.timeLeft}`);
                console.log(`📋 Event: ${result.nextEventInfo.title}`);
            }
            
            // Her 30 dakikada bir status mesajı gönder
            const minute = turkeyTime.getMinutes();
            if (minute === 0 || minute === 30) {
                const statusDetails = `Şu anki saat: **${result.currentTime}**\nBot aktif ve çalışıyor.`;
                const nextEventText = result.nextEventInfo ? result.nextEventInfo.fullInfo : "Bilinmiyor";
                await sendStatusMessage("⏰ Bot Aktif", statusDetails, nextEventText);
            }
            
            console.log(`🔄 Bot 5 dakika sonra tekrar kontrol edecek...`);
        }
        
        console.log(`📊 Bot durumu: Aktif ve çalışıyor`);
        console.log(`==========================================`);
        
    } catch (error) {
        console.error('❌ KRITIK HATA:', error);
        
        if (STATUS_WEBHOOK_URL) {
            await sendStatusMessage("❌ KRITIK HATA", `Bot çalışırken hata oluştu: ${error.message}`);
        }
        
        process.exit(1);
    }
}

main();
