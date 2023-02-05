const moment = require('moment');
const querystring = require('qs');
const crypto = require("crypto");

const tmnCode = "9K4JXW43"
const secretKey = "EVUOTRZHBEOTEUJENMUMSZRUFRNRQAAK"
const vnPayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
const webDomain = "http://localhost:3000"
const orderInfo = 'purchase order using paypal';
const orderType = 'other';
const locale = 'vn';
const currCode = 'VND';

// Bank account infomation
// - Bank: NCB
// - Number: 9704198526191432198
// - owner: NGUYEN VAN A
// - date: 07/15
// - OTP Response: 123456


const createVnpPayUrl = ({ward, city, district, address, billPrice, ipAddr})=>{
  let vnpUrl = vnPayUrl
  const returnUrl = webDomain + `/checkout/bills?ward=${ward}&city=${city}&district=${district}&address=${address}`
  const createDate = moment().format('YYYYMMDDHHmmss')
  const orderId = moment().format('HHmmss')
  const amount = billPrice;

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  vnp_Params = sortObject(vnp_Params);

  vnp_Params['vnp_SecureHash'] = createSign(vnp_Params);
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  return vnpUrl
}

const createSign = (vnp_Params)=>{
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  return signed
}

const sortObject = (obj) => {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = createVnpPayUrl