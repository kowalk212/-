export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const stockCode = req.query.code;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const API_CONFIG = {
    appKey: 'PSOTAikdVNzI3lS5YYqTZwpmQl92aeX6A8MB',
    appSecret: 'c8PTo1EYnN82G4eYhL4yOsU/zkiqW4IKGq4s0CE9jd6FsaTH8NJvUbfKtwAdQ6+g+n3qCKWJlKu2qK8wasa/wwyRAT3Sx3bXdh1fSUdLCSyg+2LCVymXk08uzTg/QQ4ErP5BAWjeIWcC1f2fg1tIHV/Kpx1NHzm6tzLNVIMJccK+3RBjYws=',
    baseUrl: 'https://openapi.koreainvestment.com:9443'
  };

  try {
    const params = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: 'J',
      FID_INPUT_ISCD: stockCode
    });

    const response = await fetch(
      `${API_CONFIG.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?${params}`,
      {
        headers: {
          'authorization': `Bearer ${token}`,
          'appkey': API_CONFIG.appKey,
          'appsecret': API_CONFIG.appSecret,
          'tr_id': 'FHKST01010100'
        }
      }
    );

    const data = await response.json();

    if (data.rt_cd === '0' && data.output) {
      const price = parseInt(data.output.stck_prpr);
      const change = parseFloat(data.output.prdy_ctrt);
      const rsi = Math.floor(50 + (change * 10));
      
      res.status(200).json({
        success: true,
        price,
        change,
        rsi: Math.max(0, Math.min(100, rsi))
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.msg1 || '시세 조회 실패'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
