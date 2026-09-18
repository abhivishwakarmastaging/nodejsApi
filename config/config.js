// production

const e = require("express");

exports.Client_ID = "41a9dca191";
exports.Client_Secret = "82b184a67be34f97bfeb695820838266";

//UAT

// exports.Client_ID = "cf99f07b7a";
// exports.Client_Secret = "e49d70c696ee4a518420b57e4bf3be8b";

exports.auth_url = `https://production.deepvue.tech/v1/authorize`;
exports.pan_verification_url = "https://production.deepvue.tech/v1/verification/panbasic";
// exports.pan_verification_url = "https://production.deepvue.tech/v1/verification/pan-plus";
exports.Gst_verification_url = "https://production.deepvue.tech/v1/verification/gstinlite";
exports.post_DrivingLicense_verification_url = "https://production.deepvue.tech/v1/verification/post-driving-license";
exports.get_DrivingLicense_verification_url = "https://production.deepvue.tech/v1/verification/get-driving-license";
// exports.Aadhaar_verification_url = "https://production.deepvue.tech/v1/verification/aadhaar";

exports.post_Aadhaar_verification_url = "https://production.deepvue.tech/v2/ekyc/aadhaar/generate-otp";
exports.get_Aadhaar_verification_url = "https://production.deepvue.tech/v2/ekyc/aadhaar/verify-otp";

exports.Vehicle_verification_url = "https://production.deepvue.tech/v1/verification/rc-advanced";

exports.send_OTP = "https://kutility.org/app/smsapi/index.php?username=neotechnet&password=neotechnet&campa";

exports.send_OTP = `Dear Customer,OTP for login is 3322111 . Please do not share this OTP. Regards, Neotech IT Services Email: info@neotechnet.com`


