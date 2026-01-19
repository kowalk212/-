export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const API_CONFIG = {
    appKey: 'PSOTAikdVNzI3lS5YYqTZwpmQl92aeX6A8MB',
    appSecret: 'c8PTo1EYnN82G4eYhL4yOsU/zkiqW4IKGq4s0CE9jd6FsaTH8NJvUbfKtwAdQ6+g+n3qCKWJlKu2qK8wasa/wwyRAT3Sx3bXdh1fSUdLCSyg+2LCVymXk08uzTg/QQ4ErP5BAWjeIWcC1f2fg1tIHV/Kpx1NHzm6tzLNVIMJccK+3RBjYws=',
    accountNo: '50160165',
    baseUrl: 'https://openapi.koreainvestment.com:9443'
  };

  try {
    const params = new URLSearchParams({
      CANO: API_CONFIG.accountNo.substring(0, 8),
      ACNT_PRDT_CD: API_CONFIG.accountNo.substring(8),
      AFHR_FLPR_YN: 'N',
      OFL_YN: 'N',
      INQR_DVSN: '02',
      UNPR_DVSN: '01',
      FUND_STTL_ICLD_YN: 'N',
      FNCG_AMT_AUTO_RDPT_YN: 'N',
      PRCS_DVSN: '00',
      CTX_AREA_FK100: '',
      CTX_AREA_NK100: ''
    });

    const response = await fetch(
      `${API_CONFIG.baseUrl}/uapi/domestic-stock/v1/trading/inquire-balance?${params}`,
      {
        headers: {
          'authorization': `Bearer ${token}`,
          'appkey': API_CONFIG.appKey,
          'appsecret': API_CONFIG.appSecret,
          'tr_id': 'VTTC8434R'
        }
      }
    );

    const data = await response.json();

    if (data.rt_cd === '0' && data.output2 && data.output2.length > 0) {
      const account = data.output2[0];
      
      res.status(200).json({
        success: true,
        balance: parseInt(account.prvs_rcdl_excc_amt || account.nxdy_excc_amt || 0),
        totalAssets: parseInt(account.tot_evlu_amt || 0),
        profitLoss: parseInt(account.evlu_pfls_smtl_amt || 0),
        profitRate: parseFloat(account.tot_evlu_pfls_rt || 0)
      });
    } else {
      res.status(400).json({
