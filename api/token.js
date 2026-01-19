export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_CONFIG = {
    appKey: 'PSOTAikdVNzI3lS5YYqTZwpmQl92aeX6A8MB',
    appSecret: 'c8PTo1EYnN82G4eYhL4yOsU/zkiqW4IKGq4s0CE9jd6FsaTH8NJvUbfKtwAdQ6+g+n3qCKWJlKu2qK8wasa/wwyRAT3Sx3bXdh1fSUdLCSyg+2LCVymXk08uzTg/QQ4ErP5BAWjeIWcC1f2fg1tIHV/Kpx1NHzm6tzLNVIMJccK+3RBjYws=',
    baseUrl: 'https://openapi.koreainvestment.com:9443'
  };

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/oauth2/tokenP`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: API_CONFIG.appKey,
        appsecret: API_CONFIG.appSecret
      })
    });

    const data = await response.json();

    if (data.access_token) {
      res.status(200).json({
        success: true,
        token: data.access_token
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.msg || '토큰 발급 실패'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
