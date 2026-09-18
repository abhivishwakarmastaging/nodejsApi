const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const logger = require('../../log/logger'); const multer = require('multer');
const { InsertDriver_schema, UpdateDriverDetails_schema, DeleteDriverDetails_schema, GetDriverDetails_schema } = require("../../models/V1/Driver_Onboarding/schema");
const { InsertDriverDB, ImageUploadDB, generateQRDB, getgenerateQRDB, verifyQRDB, generateonboard_idDB, getgenerateonboard_idDB, verifyonboard_idDB, updateDriverDetailsDB, deleteDriverDetailsDB, getDriverDetailsDB, getLPDetailsDB, UpdateImageUploadDB } = require('../../models/V1/Driver_Onboarding/utility');
const { getRandomSixDigitNumber, saveMultipleBase64Images } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const fs = require('fs');
const path = require('path');
// const QRCode = require('qrcode');
const e = require('express');

// InsertDriver

module.exports.DriverOnboarding = async (req, res, next) => {
  logger.log("info", `Insert Driver req_body = ${JSON.stringify(req.body)}`);
  try {
    const validate = ajv.compile(InsertDriver_schema());
    if (!validate(req.body)) {
      return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    }

    const result = await InsertDriverDB(req.body);

    if (result.status == "00") {
      await InsertDriverPhoto(result.driver_id, req, res);

      var jsonData ={
        driver_id: result.driver_id,
        name: req.body.full_name,
        contact_no: req.body.contact_no,

      }

    return res.status(200).json({ status: result.status, message: result.message, data: jsonData });
    } else {
      return res.status(200).json({ status: result.status, message: result.message ,data: null});
    }
  } catch (error) {
    logger.log("error", `Insert Driver Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const InsertDriverPhoto = async (Driver_ID, req, res) => {

  try {
    const imagesMap = {};
    const DriverDetails = req.body;

    // Filter base64 image fields
    Object.entries(DriverDetails).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.startsWith('data:image')) {
        imagesMap[key] = value;
      }
    });

    const destFolder = path.join(__dirname, '../../uploads', 'RunnerDriver');
    const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
    console.log('Saved files:', savedPaths);

    const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
      const dynamicNumberKey = `${key}No`; // auto generate
      const docNumber = DriverDetails[dynamicNumberKey] || null;

      return {
        DriverID: Driver_ID,  // or generate dynamically
        photo_id: docNumber || key.toUpperCase(),
        photo_type: key,
        photo_url: `https://uat.motohelpindia.com/driver-runner-service/uploads/RunnerDriver/${path.basename(fullPath)}`,
        name: path.basename(fullPath),
        doc_number: docNumber
      };
    });

    for (const img of imagesToInsert) {
      await ImageUploadDB(img);
    }

    logger.log("info", `Driver Images Inserted successfully`);
    return;
  } catch (error) {
    console.error('Insert Driver Error:', error);
    return res.status(500).json({
      status: "03",
      message: "Internal server error",
      error: error.message
    });
  }
};

// UpdateDriverDetails
module.exports.updateDriverDetails = async (req, res) => {
  logger.log("info", `Update Driver Details req_body = ${JSON.stringify(req.body)}`);
  if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
  }

  try {
    // const validate = ajv.compile(UpdateDriverDetails_schema());
    // if (!validate(req.body)) {
    //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    // }

    const result = await updateDriverDetailsDB(req.body);
    if (result.status === "00") {
      await UpdateImageUpload(req.body.driver_id, req, res);

    }

    return res.status(200).json({ status: result.status, message: result.message });
  } catch (error) {
    logger.log("error", `Update Driver Details Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DeleteDriverDetails
module.exports.deleteDriverDetails = async (req, res) => {
  logger.log("info", `Delete Driver Details req_body = ${JSON.stringify(req.body)}`);
  if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
  }

  try {
    // const validate = ajv.compile(DeleteDriverDetails_schema());
    // if (!validate(req.body)) {
    //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    // }

    const result = await deleteDriverDetailsDB(req.body);

    if (result.errorCode) {
      return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
    }

    return res.status(200).json({ status: result.status, message: result.message });
  } catch (error) {
    logger.log("error", `Delete Driver Details Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GetDriverDetails
module.exports.getDriverDetails = async (req, res) => {
  logger.log("info", `Get Driver Details req_body = ${JSON.stringify(req.body)}`);
  if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
  }

  try {
 
    const result = await getDriverDetailsDB(req.body);
    console.log("result", result);

    return res.status(200).json({ status: result.status, message: result.message, data: result.data});
  } catch (error) {
    logger.log("error", `Get Driver Details Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateImageUpload = async (driver_id, req, res) => {
  try {
    // 1. Collect Base64 fields from the request body
    const imagesMap = {};

    Object.entries(req.body).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.startsWith('data:image')) {
        imagesMap[key] = value;
      }
    });

    // 2. Build your destination folder path
    const destFolder = path.join(__dirname, '../../uploads', 'Driver');

    // 3. Save all images and get back their disk paths
    const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
    console.log('Saved files:', savedPaths);

    // 4. Build the array of objects you want to insert into your DB
    const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => ({
      driver_id: driver_id,  // or generate dynamically
      photo_id: '123',                    // or generate dynamically
      photo_type: key,                      // e.g. “CancelledCheque”
      photo_url: `https://uat.motohelpindia.com/driver-service/uploads/Driver/${path.basename(fullPath)}`,
      name: path.basename(fullPath),
    }));

    // 5. Insert each record
    for (const img of imagesToInsert) {
      await UpdateImageUploadDB(img);
    }
    logger.log("info", `Driver Images update successfully`);
    return


  }
  catch (error) {
    console.error('Update Driver Error:', error);
    return res.status(500).json({
      status: "03",
      message: "Internal server error",
      error: error.message
    });
  }
}

