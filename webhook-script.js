const https = require('https');
const { URL } = require('url');

// Webhook URL'i environment variable'dan al
const WEBHOOK_URL = process.env.WEBHOOK_URL;

import asyncio
import aiohttp
from datetime import datetime, time, timedelta
from typing import Dict, List, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeeklyWebhookReminderSystem:
    def __init__(self, webhook_url: str, channel_id: str = None):
        """
        Initialize the weekly webhook reminder system
        
        Args:
            webhook_url: The webhook URL to send messages to
            channel_id: Optional channel ID (for platforms that support it)
        """
        self.webhook_url = webhook_url
        self.channel_id = channel_id
        
        # Define weekly messages: 7 days × 4 messages = 28 unique messages with titles
        self.weekly_messages = {
            0: [  # Monday
                {
                    "time": time(1, 00),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Münzevi Tavsiyesi eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/f/fe/M%C3%BCnzevi_Tavsiyesi.png" 
                },
                {
                    "time": time(13, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Yeşil Ejderha Fasulyesi eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/5/51/Ye%C5%9Fil_Ejderha_Fasulyesi.png"
                },
                {
                    "time": time(17, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Kutsama Kağıdı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/e/ef/Kutsama_Ka%C4%9F%C4%B1d%C4%B1.png"
                },
                {
                    "time": time(21, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Nugget eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/2/27/Nugget_M%C3%BChr%C3%BC_%28Ye%C5%9Fil%29.png"
                }
            ],
            1: [  # Tuesday
                {
                    "time": time(1, 00),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Güneş Özütü eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/1/1d/G%C3%BCne%C5%9F_%C3%96z%C3%BCt%C3%BC_%28%C3%96%29.png" 
                },
                {
                    "time": time(13, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Cor Draconis eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/2/26/Cor_Draconis.png"
                },
                {
                    "time": time(17, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Küçük Kutsama eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/f/f2/K%C3%BC%C3%A7%C3%BCk_Kutsama.png"
                },
                {
                    "time": time(21, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Nesneyi Efsunla eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/e/ee/Efsun_Nesnesi.png"
                }
            ],
            2: [  # Çarşamba
                {
                    "time": time(1, 00),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Balıkçılık eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/9/9d/Bal%C4%B1k%C3%A7%C4%B1l%C4%B1k_K%C4%B1lavuzu.png" 
                },
                {
                    "time": time(13, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Kutsama Küresi eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/d/d2/Kutsama_K%C3%BCresi.png"
                },
                {
                    "time": time(17, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Münzevi Tavsiyesi eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/f/fe/M%C3%BCnzevi_Tavsiyesi.png"
                },
                {
                    "time": time(21, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Süper Taş eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/8/8b/Metinstein-Rufrolle.png"
                }
            ],
            3: [  # Perşembe
                {
                    "time": time(1, 00),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Ay Özütü eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/d/d0/Ay_%C3%96z%C3%BCt%C3%BC_%28%C3%96%29.png" 
                },
                {
                    "time": time(13, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Küçük Kutsama eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/f/f2/K%C3%BC%C3%A7%C3%BCk_Kutsama.png"
                },
                {
                    "time": time(17, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Cor Draconis eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/2/26/Cor_Draconis.png"
                },
                {
                    "time": time(21, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Arttırma Kağıdı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/7/78/Artt%C4%B1rma_Ka%C4%9F%C4%B1d%C4%B1.png"
                }
            ],
            4: [  # Cuma
                {
                    "time": time(1, 00),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Yeşil Ejderha Fasulyesi eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/5/51/Ye%C5%9Fil_Ejderha_Fasulyesi.png" 
                },
                {
                    "time": time(13, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Nesneyi Efsunla eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/e/ee/Efsun_Nesnesi.png"
                },
                {
                    "time": time(17, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Süper Taş eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/8/8b/Metinstein-Rufrolle.png"
                },
                {
                    "time": time(21, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Cor Draconis eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/2/26/Cor_Draconis.png"
                }
            ],
            5: [  # Saturday
                {
                    "time": time(15, 29),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Kutsama Kağıdı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/e/ef/Kutsama_Ka%C4%9F%C4%B1d%C4%B1.png" 
                },
                {
                    "time": time(15, 30),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Balıkçılık eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/9/9d/Bal%C4%B1k%C3%A7%C4%B1l%C4%B1k_K%C4%B1lavuzu.png"
                },
                {
                    "time": time(15, 31),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Robin (Yağma) (1 Gün) eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/9/90/Robin_%28Ya%C4%9Fma%29.png"
                },
                {
                    "time": time(15, 32),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Ay Işığı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/6/62/Ay%C4%B1%C5%9F%C4%B1%C4%9F%C4%B1_Define_Sand%C4%B1%C4%9F%C4%B1.png"
                }
            ],
            6: [  # Sunday
                {
                    "time": time(1, 00),  # Fixed the time from 23:05 to 8:00
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "01:00 - 13:00 (12 Saat Sürecek)",
                    "message": "Kötü Ruh Kovma Kağıdı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png" 
                },
                {
                    "time": time(13, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "13:00 - 17:00 (4 Saat Sürecek)",
                    "message": "Arttırma Kağıdı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/7/78/Artt%C4%B1rma_Ka%C4%9F%C4%B1d%C4%B1.png"
                },
                {
                    "time": time(17, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "17:00 - 21:00 (4 Saat Sürecek)",
                    "message": "Kötü Ruh Kovma Kağıdı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/3/3d/K%C3%B6t%C3%BC_Ruh_Kovma_Ka%C4%9F%C4%B1d%C4%B1.png"
                },
                {
                    "time": time(21, 00),
                    "code": "Bu mesaj bot tarafından gönderilmiştir.",
                    "title": "21:00 - 01:00 (4 Saat Sürecek)",
                    "message": "Liderin Kitabı eventi başladı.",
                    "color": 0x00ff00,
                    "image_url": "https://tr-wiki.metin2.gameforge.com/images/8/8b/Liderin_Kitab%C4%B1.png"
                }
            ]
        }
    
    def update_message_image(self, day: int, message_index: int, image_url: str):
        """
        Update the image URL of a specific message
        
        Args:
            day: Day of week (0=Monday, 1=Tuesday, ..., 6=Sunday)
            message_index: Message index (0-3)
            image_url: PNG image URL
        """
        if day in self.weekly_messages and 0 <= message_index < 4:
            self.weekly_messages[day][message_index]["image_url"] = image_url
            code = self.weekly_messages[day][message_index]["code"]
            logger.info(f"Updated image for {code}")
    
    def update_message_image_by_code(self, message_code: str, image_url: str):
        """
        Update the image URL of a message by its code
        
        Args:
            message_code: The code identifier for the message
            image_url: PNG image URL
        """
        for day in self.weekly_messages:
            for message in self.weekly_messages[day]:
                if message["code"] == message_code:
                    message["image_url"] = image_url
                    logger.info(f"Updated image for {message_code}")
                    return
        logger.warning(f"Message code {message_code} not found")
    
    def update_message_title(self, day: int, message_index: int, new_title: str):
        """
        Update the title of a specific message
        
        Args:
            day: Day of week (0=Monday, 1=Tuesday, ..., 6=Sunday)
            message_index: Message index (0-3)
            new_title: New title text
        """
        if day in self.weekly_messages and 0 <= message_index < 4:
            code = self.weekly_messages[day][message_index]["code"]
            self.weekly_messages[day][message_index]["title"] = new_title
            logger.info(f"Updated title for {code}")
    
    def update_message_title_by_code(self, message_code: str, new_title: str):
        """
        Update the title of a message by its code
        
        Args:
            message_code: The code identifier for the message
            new_title: New title text
        """
        for day in self.weekly_messages:
            for message in self.weekly_messages[day]:
                if message["code"] == message_code:
                    message["title"] = new_title
                    logger.info(f"Updated title for {message_code}")
                    return
        logger.warning(f"Message code {message_code} not found")
    
    def update_message_color(self, day: int, message_index: int, new_color: int):
        """
        Update the color of a specific message
        
        Args:
            day: Day of week (0=Monday, 1=Tuesday, ..., 6=Sunday)
            message_index: Message index (0-3)
            new_color: New color in hex format
        """
        if day in self.weekly_messages and 0 <= message_index < 4:
            self.weekly_messages[day][message_index]["color"] = new_color
            code = self.weekly_messages[day][message_index]["code"]
            logger.info(f"Updated color for {code} to {hex(new_color)}")
    
    def update_message_color_by_code(self, message_code: str, new_color: int):
        """
        Update the color of a message by its code
        
        Args:
            message_code: The code identifier for the message
            new_color: New color in hex format
        """
        for day in self.weekly_messages:
            for message in self.weekly_messages[day]:
                if message["code"] == message_code:
                    message["color"] = new_color
                    logger.info(f"Updated color for {message_code} to {hex(new_color)}")
                    return
        logger.warning(f"Message code {message_code} not found")
    
    def update_message_text(self, day: int, message_index: int, new_text: str):
        """
        Update the text of a specific message
        
        Args:
            day: Day of week (0=Monday, 1=Tuesday, ..., 6=Sunday)
            message_index: Message index (0-3)
            new_text: New message text
        """
        if day in self.weekly_messages and 0 <= message_index < 4:
            code = self.weekly_messages[day][message_index]["code"]
            self.weekly_messages[day][message_index]["message"] = new_text
            logger.info(f"Updated text for {code}")
    
    def update_message_text_by_code(self, message_code: str, new_text: str):
        """
        Update the text of a message by its code
        
        Args:
            message_code: The code identifier for the message
            new_text: New message text
        """
        for day in self.weekly_messages:
            for message in self.weekly_messages[day]:
                if message["code"] == message_code:
                    message["message"] = new_text
                    logger.info(f"Updated text for {message_code}")
                    return
        logger.warning(f"Message code {message_code} not found")
    
    def set_all_images_bulk(self, image_urls: Dict[str, str]):
        """
        Set multiple image URLs at once using message codes
        
        Args:
            image_urls: Dictionary mapping message codes to image URLs
        """
        for message_code, image_url in image_urls.items():
            self.update_message_image_by_code(message_code, image_url)
    
    def set_all_titles_bulk(self, titles: Dict[str, str]):
        """
        Set multiple titles at once using message codes
        
        Args:
            titles: Dictionary mapping message codes to titles
        """
        for message_code, title in titles.items():
            self.update_message_title_by_code(message_code, title)
    
    def get_all_message_codes(self) -> List[str]:
        """Get all message codes for reference"""
        codes = []
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        for day_num, day_name in enumerate(days):
            codes.append(f"\n{day_name}:")
            for message in self.weekly_messages[day_num]:
                codes.append(f"  - {message['code']}: {message['title']}")
        return codes
    
    def get_message_details(self, message_code: str) -> Optional[Dict]:
        """
        Get full details of a message by its code
        
        Args:
            message_code: The code identifier for the message
            
        Returns:
            Dictionary containing all message details or None if not found
        """
        for day in self.weekly_messages:
            for message in self.weekly_messages[day]:
                if message["code"] == message_code:
                    return message.copy()
        return None
    
    async def send_webhook_message(self, message_data: Dict, day_name: str):
        """
        Send a message via webhook with optional image and custom title
        
        Args:
            message_data: Dictionary containing message information
            day_name: Name of the day for display
        """
        # Create embed with custom title
        embed = {
            "title": message_data.get('title', f"{day_name} Reminder - {message_data['code']}"),
            "description": message_data['message'],
            "color": message_data['color'],
            "timestamp": datetime.now().isoformat(),
            "footer": {
                "text": f"Code: {message_data['code']} | {day_name}"
            }
        }
        
        # Add image if provided
        if message_data.get('image_url'):
            embed["image"] = {"url": message_data['image_url']}
        
        payload = {"embeds": [embed]}
        
        if self.channel_id:
            payload["channel_id"] = self.channel_id
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.webhook_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    if response.status == 204:
                        image_status = "with image" if message_data.get('image_url') else "without image"
                        logger.info(f"Successfully sent {day_name} message: {message_data['code']} - {message_data.get('title', 'No Title')} ({image_status})")
                    else:
                        logger.error(f"Failed to send message: {response.status}")
                        
        except Exception as e:
            logger.error(f"Error sending webhook message: {e}")
    
    def get_next_message_time(self) -> Tuple[datetime, Dict, str]:
        """
        Get the next scheduled message and its time
        
        Returns:
            Tuple of (next_datetime, message_data, day_name)
        """
        now = datetime.now()
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        # Check remaining messages today
        current_weekday = now.weekday()
        today_messages = self.weekly_messages[current_weekday]
        
        for message in today_messages:
            message_datetime = datetime.combine(now.date(), message["time"])
            if message_datetime > now:
                return message_datetime, message, days[current_weekday]
        
        # Find next message in upcoming days
        for days_ahead in range(1, 8):
            target_date = now.date() + timedelta(days=days_ahead)
            target_weekday = target_date.weekday()
            first_message = self.weekly_messages[target_weekday][0]
            
            next_datetime = datetime.combine(target_date, first_message["time"])
            return next_datetime, first_message, days[target_weekday]
    
    async def run_scheduler(self):
        """
        Main scheduler loop that runs indefinitely
        """
        logger.info("Starting weekly webhook reminder scheduler...")
        logger.info("Message codes and titles reference:")
        for code in self.get_all_message_codes():
            logger.info(code)
        
        while True:
            try:
                next_time, next_message, day_name = self.get_next_message_time()
                
                # Calculate sleep time
                sleep_seconds = (next_time - datetime.now()).total_seconds()
                
                if sleep_seconds > 0:
                    logger.info(f"Next message '{next_message['code']}' - '{next_message['title']}' scheduled for {next_time} ({day_name})")
                    await asyncio.sleep(sleep_seconds)
                
                # Send the message
                await self.send_webhook_message(next_message, day_name)
                
                # Small delay to prevent rapid cycling
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Error in scheduler loop: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying

# Configuration and usage example
async def main():
    # Replace with your actual webhook URL
    WEBHOOK_URL = "https://discord.com/api/webhooks/1421094716065320991/3X72LrhIMRJD_YtkWX98qBo4uK2l6WZlSkbHlVuTnBbpY-Trrio0HhfaAUpAH83oeAuW"
    
    # Optional: specify channel ID if your platform supports it
    CHANNEL_ID = "1421050378010492969"
    
    # Create reminder system
    reminder_system = WeeklyWebhookReminderSystem(WEBHOOK_URL, CHANNEL_ID)
    
    # Example: Add images to specific messages
    reminder_system.update_message_image_by_code(
        "MON_MORNING_MOTIVATION", 
        "https://example.com/images/monday-motivation.png"
    )
    
    reminder_system.update_message_image_by_code(
        "FRI_NIGHT_WEEKEND", 
        "https://example.com/images/friday-celebration.png"
    )
    
    # Example: Bulk set multiple images at once
    image_mapping = {
        "TUE_MORNING_FOCUS": "https://example.com/images/focus.png",
        "WED_MIDDAY_BOOST": "https://example.com/images/energy-boost.png",
        "THU_EVENING_PREPARATION": "https://example.com/images/preparation.png",
        "SAT_AFTERNOON_FUN": "https://example.com/images/weekend-fun.png",
        "SUN_MORNING_PEACEFUL": "https://example.com/images/peaceful-morning.png"
    }
    
    reminder_system.set_all_images_bulk(image_mapping)
    
    # Example: Customize titles
    title_mapping = {
        "MON_MORNING_MOTIVATION": "🚀 Monday Kickstart",
        "FRI_NIGHT_WEEKEND": "🎉 Weekend Warriors Unite!",
        "SUN_NIGHT_READY": "✨ Sunday Prep for Success"
    }
    
    reminder_system.set_all_titles_bulk(title_mapping)
    
    # Example: Other customizations
    reminder_system.update_message_color_by_code("FRI_MIDDAY_CELEBRATION", 0xffd700)  # Gold
    reminder_system.update_message_text_by_code(
        "SUN_NIGHT_READY", 
        "🌙 Sunday Ready! Rest well, tomorrow brings new possibilities!"
    )
    
    # Start the scheduler
    await reminder_system.run_scheduler()

# Test function for a single message with image and title
async def test_message_with_title():
    """Test function to send a message with a custom title and image"""
    WEBHOOK_URL = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"
    
    reminder_system = WeeklyWebhookReminderSystem(WEBHOOK_URL)
    
    # Create a test message with title and image
    test_message = {
        "time": time(12, 0),
        "code": "TEST_WITH_TITLE",
        "title": "🧪 Custom Title Test",
        "message": "🖼️ This is a test message with a custom title and image!",
        "color": 0xff6b35,
        "image_url": "https://example.com/your-test-image.png"  # Replace with your image URL
    }
    
    await reminder_system.send_webhook_message(test_message, "Test Day")
    print("Test message with custom title and image sent!")

if __name__ == "__main__":
    # Run the main scheduler
    asyncio.run(main())
    
    # Or test a message with title:
    # asyncio.run(test_message_with_title())

async function main() {
    try {
        const result = getNextMessage();
        
        if (result.shouldSend) {
            const success = await sendWebhookMessage(result.message, result.dayName);
            console.log(`Mesaj gönderildi: ${result.message.title}`);
        } else {
            console.log(`Mesaj zamanı değil. Şu anki saat: ${result.currentTime}`);
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

main();
