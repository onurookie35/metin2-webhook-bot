export default async function handler(req, res) {
    const now = new Date();
    const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    return res.status(200).json({
        status: 'Bot is running on Vercel',
        timestamp: now.toISOString(),
        turkeyTime: turkeyTime.toLocaleString('tr-TR'),
        message: 'Metin2 Discord Event Bot - Active',
        endpoints: {
            webhook: '/api/webhook',
            status: '/api/status'
        }
    });
}
