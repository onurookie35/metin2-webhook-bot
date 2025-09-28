const https = require('https');
const { URL } = require('url');

// Webhook URL'i environment variable'dan al
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!WEBHOOK_URL) {
    console.error('WEBHOOK_URL environment variable bulunamadı!');
    process.exit(1);
}

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
    6: [ // Pazar
        {
            hour: 22, minute: 25,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Kötü Ruh Kovma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 22, minute: 27,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Arttırma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/7/78/Artt%C4%B1rma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 22, minute: 28,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Kötü Ruh Kovma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 22, minute: 30,
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

// Gün ismi alma fonksiyonu
function getDayName(dayIndex) {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return days[dayIndex];
}

// Bir sonraki event bilgisi
function getNextEventInfo(currentMappedDay, currentHour, currentMinute) {
    const currentTime = currentHour * 60 + currentMinute;
    
    // Bugünün kalan eventlerini kontrol et
    const todayMessages = WEEKLY_MESSAGES[currentMappedDay];
    for (const message of todayMessages) {
        const eventTime = message.hour * 60 + message.minute;
        if (eventTime > currentTime) {
            return `Sonraki event: ${message.hour}:${message.minute.toString().padStart(2, '0')} - ${message.title}`;
        }
    }
    
    // Yarının ilk eventini bul
    const nextDay = (currentMappedDay + 1) % 7;
    const tomorrowMessages = WEEKLY_MESSAGES[nextDay];
    if (tomorrowMessages && tomorrowMessages.length > 0) {
        const firstEvent = tomorrowMessages[0];
        return `Yarının ilk eventi: ${firstEvent.hour}:${firstEvent.minute.toString().padStart(2, '0')} - ${firstEvent.title}`;
    }
    
    return "Event bilgisi bulunamadı";
}

// Bir sonraki mesajı bulma fonksiyonu - DÜZELTİLMİŞ VERSİYON
function getNextMessage() {
    const now = new Date();
    const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    const currentDay = turkeyTime.getDay(); // JavaScript: 0=Pazar, 1=Pazartesi, ...
    const currentHour = turkeyTime.getHours();
    const currentMinute = turkeyTime.getMinutes();
    
    // JavaScript gün numarasını bizim sistemimize çevir
    // JavaScript: 0=Pazar, 1=Pazartesi, 2=Salı, 3=Çarşamba, 4=Perşembe, 5=Cuma, 6=Cumartesi
    // Bizim sistem: 0=Pazartesi, 1=Salı, 2=Çarşamba, 3=Perşembe, 4=Cuma, 5=Cumartesi, 6=Pazar
    const dayMapping = { 
        0: 6, // Pazar -> 6
        1: 0, // Pazartesi -> 0
        2: 1, // Salı -> 1
        3: 2, // Çarşamba -> 2
        4: 3, // Perşembe -> 3
        5: 4, // Cuma -> 4
        6: 5  // Cumartesi -> 5
    };
    const mappedDay = dayMapping[currentDay];
    
    const todayMessages = WEEKLY_MESSAGES[mappedDay];
    
    // DEBUG bilgileri
    console.log(`=== DEBUG BİLGİLERİ ===`);
    console.log(`JavaScript gün numarası: ${currentDay}`);
    console.log(`Türkiye saati: ${turkeyTime.toLocaleString('tr-TR')}`);
    console.log(`Saat:Dakika: ${currentHour}:${currentMinute}`);
    console.log(`Mapped gün: ${mappedDay} (${getDayName(mappedDay)})`);
    console.log(`Bugünün mesaj sayısı: ${todayMessages ? todayMessages.length : 0}`);
    
    if (todayMessages) {
        console.log(`Bugünün mesaj saatleri:`);
        todayMessages.forEach((msg, index) => {
            const eventTime = `${msg.hour}:${msg.minute.toString().padStart(2, '0')}`;
            const currentTime = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
            const timeDiff = Math.abs((msg.hour * 60 + msg.minute) - (currentHour * 60 + currentMinute));
            console.log(`  ${index}: ${eventTime} - ${msg.title} (Fark: ${timeDiff} dk)`);
        });
    }
    console.log(`======================`);
    
    // Tam saat kontrolü (±2 dakika tolerans)
    for (const message of todayMessages) {
        const timeDifference = Math.abs((message.hour * 60 + message.minute) - (currentHour * 60 + currentMinute));
        if (timeDifference <= 2) {
            console.log(`🎯 EVENT ZAMANI TESPİT EDİLDİ: ${message.title}`);
            return { message, dayName: getDayName(mappedDay), shouldSend: true };
        }
    }
    
    return { 
        shouldSend: false, 
        currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`,
        nextEvent: getNextEventInfo(mappedDay, currentHour, currentMinute)
    };
}

// Gelişmiş logging ile ana fonksiyon
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
                // Bir sonraki mesajı hesapla ve göster
                const nextResult = getNextMessage();
                if (nextResult.nextEventTime) {
                    const nextTime = new Date(nextResult.nextEventTime);
                    const timeUntilNext = Math.ceil((nextTime - turkeyTime) / (1000 * 60)); // dakika cinsinden
                    console.log(`⏭️ Bir sonraki mesaj: ${nextTime.toLocaleString('tr-TR')} (${timeUntilNext} dakika sonra)`);
                    console.log(`📋 Bir sonraki event: ${nextResult.nextEventTitle || 'Bilinmiyor'}`);
                }
            } else {
                console.log(`❌ HATA: Mesaj gönderilemedi`);
            }
        } else {
            console.log(`⏰ Event zamanı değil - Şu anki saat: ${result.currentTime}`);
            
            // Bir sonraki event bilgileri
            if (result.nextEventTime) {
                const nextTime = new Date(result.nextEventTime);
                const timeUntilNext = Math.ceil((nextTime - turkeyTime) / (1000 * 60)); // dakika cinsinden
                const hoursUntilNext = Math.floor(timeUntilNext / 60);
                const minutesUntilNext = timeUntilNext % 60;
                
                console.log(`📅 Bir sonraki event: ${result.nextEventTitle || 'Bilinmiyor'}`);
                console.log(`⏰ Event zamanı: ${nextTime.toLocaleString('tr-TR')}`);
                
                if (hoursUntilNext > 0) {
                    console.log(`⏳ Kalan süre: ${hoursUntilNext} saat ${minutesUntilNext} dakika`);
                } else {
                    console.log(`⏳ Kalan süre: ${minutesUntilNext} dakika`);
                }
            } else {
                console.log(`❓ Bir sonraki event bilgisi bulunamadı`);
            }
            
            console.log(`🔄 Bot 1 dakika sonra tekrar kontrol edecek...`);
        }
        
        console.log(`📊 Bot durumu: Aktif ve çalışıyor`);
        console.log(`==========================================`);
        
    } catch (error) {
        console.error('❌ KRITIK HATA:', error);
        process.exit(1);
    }
}

// Gelişmiş getNextMessage örneği (sizinkine göre uyarlayın)
function getNextMessage() {
    const now = new Date();
    const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const currentHour = turkeyTime.getHours();
    const currentMinute = turkeyTime.getMinutes();
    const currentDay = turkeyTime.getDay(); // 0=Pazar, 1=Pazartesi, ...
    
    // Event zamanlarınızı buraya ekleyin
    const events = [
        { day: 1, hour: 15, minute: 0, title: "Castle Siege", message: {...} }, // Pazartesi 15:00
        { day: 3, hour: 20, minute: 30, title: "Guild War", message: {...} },   // Çarşamba 20:30
        { day: 6, hour: 14, minute: 0, title: "Boss Event", message: {...} },   // Cumartesi 14:00
        // Diğer eventler...
    ];
    
    // Şu anki zaman için kontrol
    const currentEvent = events.find(event => 
        event.day === currentDay && 
        event.hour === currentHour && 
        event.minute === currentMinute
    );
    
    if (currentEvent) {
        return {
            shouldSend: true,
            message: currentEvent.message,
            dayName: getDayName(currentEvent.day),
            currentTime: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
        };
    }
    
    // Bir sonraki eventi bul
    const nextEvent = findNextEvent(events, turkeyTime);
    
    return {
        shouldSend: false,
        currentTime: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
        nextEventTime: nextEvent ? nextEvent.time : null,
        nextEventTitle: nextEvent ? nextEvent.title : null
    };
}

// Bir sonraki eventi bulma fonksiyonu
function findNextEvent(events, currentTime) {
    let nextEvent = null;
    let minTimeDiff = Infinity;
    
    events.forEach(event => {
        // Bu haftaki event zamanı
        const eventTime = new Date(currentTime);
        const dayDiff = (event.day - currentTime.getDay() + 7) % 7;
        eventTime.setDate(currentTime.getDate() + dayDiff);
        eventTime.setHours(event.hour, event.minute, 0, 0);
        
        // Eğer bu haftaki event geçmişse, gelecek haftakini hesapla
        if (eventTime <= currentTime) {
            eventTime.setDate(eventTime.getDate() + 7);
        }
        
        const timeDiff = eventTime - currentTime;
        if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            nextEvent = {
                time: eventTime,
                title: event.title
            };
        }
    });
    
    return nextEvent;
}

function getDayName(day) {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[day];
}

main();
