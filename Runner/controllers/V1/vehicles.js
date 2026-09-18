
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const path = require('path');
const logger  = require('../../log/logger');
const {  VehicleOnboardingDB, deleteVehicleDB, updateVehicleDB,updateImageUploadDB, ImageUploadDB, getVehicleDB, } = require("../../models/V1/vehicles/utility");
const { InserVehicle_schema } = require("../../models/V1/vehicles/schema")
const { saveMultipleBase64Images } = require("../../common/common");
exports.InsertVehicle = async (req, res) => {
logger.log("info", `Insert Vehicle req_body = ${JSON.stringify(req.body)}`);
    try {
        const validate = ajv.compile(InserVehicle_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }
        logger.log("info", "Vehicle Onboarding data is valid!");
        const result = await VehicleOnboardingDB(req.body, req.vehicleData);
        if (result.bstatus_code == "00") {
                const vehicleData = JSON.parse(result.vehical_details);
            await InsertVehiclePhoto(vehicleData.driverid, req, res);
        }
        console.log(result);

        logger.log("info", "Vehicle Onboarding successful");
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc , vehical_details: JSON.parse(result.vehical_details) });


    } catch (error) {
        logger.log("error", `Vehicle Onboarding Error: ${error}`);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

// Function to save multiple base64 images
const InsertVehiclePhoto = async (driverid, req) => {
    try {
        const imagesMap = {};

        const vehiclePhotos = req.body || {};

        // ✅ Extract base64 images
        Object.entries(vehiclePhotos).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'Vehicle');

        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
            const dynamicNumberKey = `${key}No`;
            const docNumber = vehiclePhotos[dynamicNumberKey] || null;

            return {
                driverid: driverid,
                photo_id: docNumber || key.toUpperCase(),
                photo_type: key,
                photo_url: `https://uat.motohelpindia.com/driver-runner-service/uploads/Vehicle/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
                doc_number: docNumber
            };
        });

        // ✅ Parallel DB insert (FAST)
        await Promise.all(imagesToInsert.map(img => ImageUploadDB(img)));

        logger.log("info", `Vehicle Images Inserted successfully`);

        return imagesToInsert;

    } catch (error) {
        console.error('Insert Vehicle Error:', error);
        throw error; // ✅ let controller handle response
    }
};


exports.updateVehicle = async (req, res) => {
    logger.log("info", `Update Vehicle req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        // const validate = ajv.compile(VehicleSchema());
        // if (!validate(req.body)) {
        //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        // }

        const result = await updateVehicleDB(req.body);
        if (result.bstatus_code == "00") {
            await updateVehiclePhoto(result.vehical_details.vehicleid, req, res);
        }
        logger.log("info", `Update Vehicle result = ${JSON.stringify(result)}`);
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Update Vehicle Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

const updateVehiclePhoto = async (Vehicleid, req, res) => {
    try {
        const imagesMap = {};
        const VehicleDetails = req.body;

        // Filter base64 image fields
        Object.entries(VehicleDetails).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'Vehicle');
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
            const dynamicNumberKey = `${key}No`; // auto generate
            const docNumber = VehicleDetails[dynamicNumberKey] || null;

            return {
                vehicle_id: Vehicleid,
                photo_id: docNumber || key.toUpperCase(),
                photo_type: key,
                photo_url: `https://uat.motohelpindia.com/vendor-service/uploads/Vehicle/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
                doc_number: docNumber
            };
        });

        for (const img of imagesToInsert) {
            await ImageUploadDB(img);
        }

        logger.log("info", `Vehicle Images Inserted successfully`);
        return;
        // res.status(200).json({ status: "00", message: "All images saved successfully.", data: imagesToInsert });

    } catch (error) {
        console.error('Insert Vehicle Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { vendorid, vehicleid } = req.body;
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    logger.log("info", `Delete Vehicle Vehicleid = ${vehicleid}`);

    try {
        const result = await deleteVehicleDB(vendorid, vehicleid);
        return res.status(200).json({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `Delete Vehicle Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
}


// Similar structure for other get functions
exports.getVehicle = async (req, res) => {
    logger.log("info", "Fetching Vehicle detalis ");

    try {
        logger.log("info", `Fetching Vehicle detalis req_body = ${JSON.stringify(req.body)}`);
        const result = await getVehicleDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Get Vehicle Type Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};
