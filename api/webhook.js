// Haftalık webhook mesaj sistemi - Vercel uyumlu
const WEBHOOK_URL = "https://discord.com/api/webhooks/1421094716065320991/3X72LrhIMRJD_YtkWX98qBo4uK2l6WZlSkbHlVuTnBbpY-Trrio0HhfaAUpAH83oeAuW";

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

    // Resim varsa ekle
    if (messageData.image_url) {
        embed.image = { url: messageData.image_url };
    }

    const payload = {
        embeds: [embed]
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 204) {
            const imageStatus = messageData.image_url ? "with image" : "without image";
            console.log(`Successfully sent ${dayName} message: ${messageData.title} (${imageStatus})`);
            return true;
        } else {
            console.error(`Failed to send message: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`Error sending webhook message: ${error}`);
        return false;
    }
}

// Bir sonraki mesajı bulma fonksiyonu
function getNextMessage() {
    const now = new Date();
    // Türkiye saati için UTC+3 ekleme
    const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    const currentDay = turkeyTime.getDay(); // 0=Pazar, 1=Pazartesi, ... 6=Cumartesi
    const currentHour = turkeyTime.getHours();
    const currentMinute = turkeyTime.getMinutes();
    
    // JavaScript'te gün numaraları farklı olduğu için dönüştürme
    const dayMapping = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
    const mappedDay = dayMapping[currentDay];
    
    // Bugünün kalan mesajlarını kontrol et
    const todayMessages = WEEKLY_MESSAGES[mappedDay];
    for (const message of todayMessages) {
        const messageTime = message.hour * 60 + message.minute;
        const currentTime = currentHour * 60 + currentMinute;
        
        // 30 dakika tolerans ile mesaj zamanını kontrol et
        if (Math.abs(messageTime - currentTime) <= 30) {
            return { message, dayName: getDayName(mappedDay), shouldSend: true };
        }
    }
    
    return { shouldSend: false, currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}` };
}

// Gün ismi alma fonksiyonu
function getDayName(dayIndex) {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return days[dayIndex];
}

// Vercel serverless function handler
module.exports = async (req, res) => {
    try {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        console.log('Webhook bot çalışıyor:', new Date().toISOString());
        
        const result = getNextMessage();
        
        if (result.shouldSend) {
            const success = await sendWebhookMessage(result.message, result.dayName);
            
            res.status(200).json({
                status: 'Mesaj gönderildi',
                title: result.message.title,
                message: result.message.message,
                dayName: result.dayName,
                timestamp: new Date().toISOString(),
                success: success
            });
        } else {
            res.status(200).json({
                status: 'Mesaj zamanı değil',
                currentTime: result.currentTime,
                timestamp: new Date().toISOString(),
                info: 'Bot çalışıyor, mesaj zamanı bekleniyor'
            });
        }
        
    } catch (error) {
        console.error('Handler hatası:', error);
        res.status(500).json({
            error: 'Webhook bot hatası',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
