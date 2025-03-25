import { Router } from "express";
import moment from "moment";
import querystring from 'qs';
import crypto from 'crypto';
import { readFile } from "fs/promises";

const data = await readFile(new URL("../../vnpay.json", import.meta.url), "utf-8");
const config = JSON.parse(data);


function sortObject(obj) {
    let sorted = {};
    let str = [];

    for (let key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }

    str.sort();

    for (let i = 0; i < str.length; i++) {
        let sortedKey = str[i];
        sorted[sortedKey] = encodeURIComponent(obj[sortedKey]).replace(/%20/g, "+");
    }

    return sorted;
}


const paymentRoutes = Router();

paymentRoutes.post("/create_payment_url", async (req, res) => {    
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAdrr = req.headers["x-forwared-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let amount = req.body.amount;
    let transactionId = req.body.transactionId;

    let locale = 'vn';
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = transactionId;
    vnp_Params["vnp_OrderInfo"] = 'Thanh toan cho ma GD: ' + transactionId;
    vnp_Params["vnp_OrderType"] = 'other';
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAdrr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = 'VNPAY';
    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({
        url: vnpUrl
    })
})

export default paymentRoutes;
