const axios = require('axios');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const logger= require('../log/logger');
const sql = require('mssql');
const pool = require('../db/db');
const {generateOTP} = require('../common/common'); 
const { sendOTP_Schema, validateOTP_Schema, customer_send_OTP,customer_validate_OTP } = require("../models/V1/validate_schema");
const { SendOTPDB, validateOTPDB ,Customer_SendOTPDB,Customer_ValidateOTPDB , Driver_SendOTPDB, Driver_ValidateOTPDB } = require("../models/V1/validate_utility");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Driver send OTP

exports.Driver_send_OTP = async (req, res) => {
    try {
        const { mobile_number } = req.body;
        logger.log("info", `Driver_send_OTP request: ${JSON.stringify(req.body)}`);

        // Validate request data using Ajv
        if (!mobile_number) {
            logger.log("error", "Validation error: mobile_number is required");
            return res.status(400).json({ status: "01", message: "mobile_number is required" });
        }

        const validate = ajv.compile(sendOTP_Schema());
        if (!validate(req.body)) {
            logger.log("error", `Validation errors: ${JSON.stringify(validate.errors)}`);
            return res.status(400).json({ status: "01", message: "Invalid input data", errors: validate.errors });
        }

        logger.log("info", "Driver_send_OTP data is valid!");

        // Generate OTP
        // let otp = generateOTP(); 
        let otp = await JSON.stringify(generateOTP());
        logger.log("info", `Generated OTP: ${otp}`);
          otp = "1111"

        // Store OTP in the database
        const result = await Driver_SendOTPDB(mobile_number, otp);
        if (result.bstatus_code !== "00") {
            logger.log("error", `DB Error: ${JSON.stringify(result)}`);
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
    
            // Construct SMS API URL
            // const smsApiUrl = `https://kutility.org/app/smsapi/index.php?username=neotechnet&password=neotechnet&campaign=13613&routeid=7&type=text&contacts=${mobile_number}&senderid=NEOTEC&msg=Dear Customer,OTP for login is ${otp} . Please do not share this OTP. Regards, Neotech IT Services Email: info@neotechnet.com&template_id=1707174151394097573&pe_id=1201160680727344572&apikey=A1xMPeRMro%2B`
            const smsApiUrl = `https://kutility.org/app/smsapi/index.php?username=neotechnet&password=neotechnet&campaign=13613&routeid=7&type=text&contacts=${mobile_number}&senderid=NEOTEC&msg=Dear Customer,OTP for login is ${otp} . Please do not share this OTP. Regards, Neotech IT Services Email: info@neotechnet.com&template_id=1707174151394097573&pe_id=1201160680727344572&apikey=A1xMPeRMro+`

            // const smsApiUrl = `https://kutility.org/app/smsapi/index.php?username=neotechnet&password=neotechnet&campaign=13613&routeid=7&type=text&contacts=${mobile_number}&senderid=NEOTEC&msg=Dear Customer,OTP for login is ${otp} . Please do not share this OTP. Regards, Neotech IT Services Email: info@neotechnet.com&template_id=1707174151394097573&pe_id=1201160680727344572`
            // Send OTP via SMS
            const smsResponse = await axios.get(smsApiUrl); 
            logger.log("info", ` SMS API Response: ${JSON.stringify(smsResponse.status)}${JSON.stringify(smsResponse.statusText)}`);
            logger.log("info", ` ${smsApiUrl}`);


            if (smsResponse.status !== 200) {
                logger.log("error", `SMS API Failed: ${JSON.stringify(smsResponse.data)}`);
                return res.status(400).json({ status: "01", message: "Failed to send OTP", error: smsResponse.data });
            }

            logger.log("info", `OTP sent successfully to ${mobile_number}`);
            return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc});

        
    }

    catch (error) {
        logger.log("error", `Driver_send_OTP Error: ${error.message}`);
        return res.status(500).json({ status: "03", message: "Internal server error", error: error.message });
    }

}

// Driver validate OTP

exports.Driver_validate_OTP = async (req,res) => {
    logger.log("info", `Driver_validate_OTP request: ${JSON.stringify(req.body)}`);

    try {
        const { mobile_number, otp } = req.body;
        logger.log("info", `Driver_validate_OTP request: ${JSON.stringify(req.body)}`);

        // Validate request data using Ajv
        if (!mobile_number) {
            logger.log("error", "Validation error: mobile_number is required");
          return res.status(400).json({  status:"01", message:"mobile_number is required" });
        }

        const validate = ajv.compile(validateOTP_Schema());
        if (!validate(req.body)) {
            logger.log("error", `Validationmessage: ${JSON.stringify(validate.errors)}`);

            return res.status(400).json({  status:"01", message: "Invalid input data", errors: validate.errors });
        }

        logger.log("info", "Driver_validate_OTP data is valid!");

        // Fetch user details from DB
        const result = await Driver_ValidateOTPDB(mobile_number, otp);
        console.log(result);
        logger.log("info", `Validation ${result.DriverDetail}`);
        var Driver_Details = result.Driver_Details;
        console.log(Driver_Details);
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc,Driver_Details: JSON.parse(Driver_Details) });

    } catch (error) {
        logger.log("error", `Driver_validate_OTP Error: ${error.message}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

