// api/webhook.js - Vercel Edge Function

// Haftalık mesaj programı
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
            code: "Bu mesaj bot tarafından gönderilmiştır.",
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
            hour: 23, minute: 40,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "01:00 - 13:00 (12 Saat Sürecek)",
            message: "Kötü Ruh Kovma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 23, minute: 45,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "13:00 - 17:00 (4 Saat Sürecek)",
            message: "Arttırma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/7/78/Artt%C4%B1rma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 23, minute: 50,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "17:00 - 21:00 (4 Saat Sürecek)",
            message: "Kötü Ruh Kovma Kağıdı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
        },
        {
            hour: 0, minute: 00,
            code: "Bu mesaj bot tarafından gönderilmiştir.",
            title: "21:00 - 01:00 (4 Saat Sürecek)",
            message: "Liderin Kitabı eventi başladı.",
            color: 0x00ff00,
            image_url: "https://tr-wiki.metin2.gameforge.com/images/8/8b/Liderin_Kitab%C4%B1.png"
        }
    ]
};

// Gün ismi alma fonksiyonu
function getDayName(dayIndex) {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    return days[dayIndex];
}

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

    try {
        const response = await fetch(process.env.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`✅ Başarıyla gönderildi: ${messageData.title}`);
            return true;
        } else {
            console.error(`❌ HTTP ${response.status} hatası`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Request hatası:`, error);
        return false;
    }
}

// Status mesajı gönderme fonksiyonu
async function sendStatusMessage(status, details, nextEventInfo = null) {
    if (!process.env.STATUS_WEBHOOK_URL) return;

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

    try {
        const response = await fetch(process.env.STATUS_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embed)
        });

        if (response.ok) {
            console.log(`📊 Status mesajı gönderildi`);
        }
    } catch (error) {
        console.error(`❌ Status request hatası:`, error);
    }
}

// Ana fonksiyon
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
    
    console.log(`=== VERCEL DEBUG ===`);
    console.log(`Türkiye saati: ${turkeyTime.toLocaleString('tr-TR')}`);
    console.log(`Kontrol saati: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
    console.log(`Gün: ${getDayName(mappedDay)}`);
    
    // ±3 dakika tolerans (Vercel daha hassas)
    for (const message of todayMessages) {
        const eventTimeMinutes = message.hour * 60 + message.minute;
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        const timeDifference = Math.abs(eventTimeMinutes - currentTimeMinutes);
        
        console.log(`Event: ${message.hour}:${message.minute.toString().padStart(2, '0')} - Fark: ${timeDifference} dakika`);
        
        if (timeDifference <= 3) {
            console.log(`🎯 EVENT TESPİT EDİLDİ: ${message.title}`);
            return { 
                message, 
                dayName: getDayName(mappedDay), 
                shouldSend: true
            };
        }
    }
    
    return { 
        shouldSend: false, 
        currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`
    };
}

// Vercel Edge Function Export
export default async function handler(request) {
    try {
        console.log(`🤖 Vercel Bot kontrol ediyor...`);
        
        const result = getNextMessage();
        
        if (result.shouldSend) {
            console.log(`🎯 EVENT ZAMANI! Mesaj gönderiliyor...`);
            const success = await sendWebhookMessage(result.message, result.dayName);
            
            if (success) {
                console.log(`✅ BAŞARILI: ${result.message.title} mesajı gönderildi!`);
                await sendStatusMessage("🎯 EVENT ZAMANI!", `**${result.message.title}** mesajı başarıyla gönderildi!`);
                
                return new Response(JSON.stringify({ 
                    success: true, 
                    message: `Event mesajı gönderildi: ${result.message.title}` 
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                await sendStatusMessage("❌ HATA", "Mesaj gönderilemedi");
                return new Response(JSON.stringify({ 
                    success: false, 
                    message: "Mesaj gönderilemedi" 
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            console.log(`⏰ Event zamanı değil - Şu anki saat: ${result.currentTime}`);
            
            // Her 30 dakikada bir status mesajı gönder
            const now = new Date();
            const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
            const minute = turkeyTime.getMinutes();
            
            if (minute === 0 || minute === 30) {
                await sendStatusMessage("⏰ Bot Aktif", `Şu anki saat: **${result.currentTime}**\nBot aktif ve çalışıyor.`);
            }
            
            return new Response(JSON.stringify({ 
                success: true, 
                message: `Bot aktif, event zamanı değil. Saat: ${result.currentTime}` 
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
    } catch (error) {
        console.error('❌ KRITIK HATA:', error);
        await sendStatusMessage("❌ KRITIK HATA", `Bot çalışırken hata oluştu: ${error.message}`);
        
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
