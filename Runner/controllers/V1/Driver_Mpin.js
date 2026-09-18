

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
const { Driver_Set_MpinDB, Driver_login_MpinDB , Driver_Change_MpinDB,Driver_Forgot_MpinDB, Driver_logout_MpinDB} = require("../../models/V1/Driver_Mpin/utility.js");
const { DriversetmpinSchema } = require("../../models/V1/Driver_Mpin/schema.js");
const logger = require('../../log/logger');

exports.Driver_Set_Mpin = async function (req, res) {
    try {
        logger.log("info", `Set Merchant Mpin - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;


        const result = await Driver_Set_MpinDB(req_json);
        if (result.errorCode) {
            logger.log('error', `Set Merchant Mpin - Error: ${result.errorCode} - ${result.errorMessage}`);
            let res_json = {
                "status_code": result.errorCode,
                "status_desc": result.errorMessage
            };
            logger.log('info', ' Final Response: ' + JSON.stringify(res_json));
            return res.status(200).send(res_json);
        }
        logger.log("info", `Set Merchant Mpin - res_json = ${JSON.stringify(result)}`);
        let res_json = {
            "status_code": result.bstatus_code,
            "status_desc": result.bmessage_desc
        };
        logger.log('info', ' Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);
        // return res.status(200).json({ status_code: "00", status_desc: "mPIN set successfully! You're all set to authenticate securely." });

    } catch (e) {
        logger.log('error', `Set Merchant Mpin - Exception ${e.error ? e.error : e.toString()}`);
        console.log(e);
        // Consider adding a response in case of an exception to inform the client about the error.
        return res.status(500).json({ status_code: "03", status_desc: "Internal Server Error" });
    }
}

exports.Driver_login_Mpin = async function (req, res) {
    try {
        logger.log("info", `Login Driver MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;



        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to validate MPIN
        const result = await Driver_login_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Login Driver MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage,
                Driver_Details: null
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc,
            Driver_Details: result.Driver_Details
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in Driver_login_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
};

exports.Driver_Change_Mpin = async function (req, res) {
    try {
        logger.log("info", `Change Driver MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;

        // Call service function to change MPIN
        const result = await Driver_Change_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Change Driver MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in Driver_Change_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
}

exports.Driver_Forgot_Mpin = async function (req, res) {
    try {
        logger.log("info", `Forgot Driver MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;


        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to change MPIN
        const result = await Driver_Forgot_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Forgot Driver MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in Driver_Forgot_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
}

exports.Driver_logout_Mpin = async function (req, res) {
    try {
        logger.log("info", `Logout Driver MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;



        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to logout MPIN
        const result = await Driver_logout_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Logout Driver MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in Driver_logout_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
}