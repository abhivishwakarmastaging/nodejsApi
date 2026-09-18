const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
// const { getRandomSixDigitNumber } = require("../../common/common");

const { insertOrUpdate_DriverLiveLocationDB, get_DriverLiveLocationDB } = require('../../models/V1/DriverLiveLocation/utility.js');
const { log } = require('winston');
// const {  } = require('../../models/V1/DriverLiveLocation/schema.js');

// insertOrUpdateDriverLiveLocation
exports.insertOrUpdateDriverLiveLocation = async (req, res) => {
    try {
        // const validate = ajv.compile();
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `insertOrUpdate_DriverLiveLocation validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }
        console.log(req.body);

        const result = await insertOrUpdate_DriverLiveLocationDB(req.body);
        // ✅ Emit socket event after successful DB update
        const io = req.app.get("socketio"); // socket instance
        if (io) {
            console.log("Emitting driverLocationUpdate event via socket*********************************");
            io.emit("driverLocationUpdate", {
                status: result.bstatus_code, message: result.bmessage_desc
            });
            logger.log("info", `Socket event emitted for DriverID: ${req.body.DriverID}`);
        }
        logger.log("info", `insertOrUpdate_DriverLiveLocation result: ${JSON.stringify(result)}`);
        console.log("info", `Driver Live Location updated successfully for DriverID: ${req.body.DriverID}`);

        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });

    } catch (error) {
        logger.log("error", `insertOrUpdate_DriverLiveLocation Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// get_DriverLiveLocation
exports.getDriverLiveLocation = async (req, res) => {
    try {
        const result = await get_DriverLiveLocationDB(req.body);   // DB call
        logger.log("info", `get_DriverLiveLocation result: ${JSON.stringify(result)}`);

        // ✅ Emit driver location data to all connected clients
        const io = req.app.get("socketio");
        io.emit("driverLiveLocation", {
            status: result.bstatus_code,
            message: result.bmessage_desc,
            data: result.data
        });

        return res.status(200).send({
            status: result.bstatus_code,
            message: result.bmessage_desc,
            data: result.data
        });

    } catch (error) {
        logger.log("error", `get_DriverLiveLocation Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

// exports.getDriverLiveLocation = async (req, res) => {
//     try {
//         const result = await get_DriverLiveLocationDB(req.body);   // DB call
//         logger.log("info", `get_DriverLiveLocation result: ${JSON.stringify(result)}`);

//         return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

//     } catch (error) {
//         logger.log("error", `get_DriverLiveLocation Error: ${error.message}`);
//         return res.status(500).json({ status: "99", message: "Internal server error" });
//     }
// }
