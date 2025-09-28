// api/webhook.js - Vercel Serverless Function (DÜZELTME)
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
