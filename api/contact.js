export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received data:', req.body);
  console.log('Request host:', req.headers.host);

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  console.log('Has WEB3FORMS_ACCESS_KEY:', Boolean(accessKey));
  if (!accessKey) {
    return res.status(503).json({ error: 'お問い合わせフォームは準備中です。しばらくしてからお試しください。' });
  }

  const { name, email, message, website } = req.body || {};

  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'すべての項目を入力してください。' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'メールアドレスの形式が正しくありません。' });
  }

  try {
    console.log('Sending to Web3Forms...');
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: '【ポートフォリオ】お仕事のご相談',
        from_name: 'Portfolio Contact',
      }),
    });

    const data = await response.json();
    console.log('Web3Forms status:', response.status);
    console.log('Web3Forms response:', data);

    if (data.success) {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: data.message || '送信に失敗しました。' });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: '送信に失敗しました。時間をおいて再度お試しください。' });
  }
}
