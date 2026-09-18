const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const logger = require('../../log/logger'); const { createexpenseTypeSchema } = require('../../models/V1/Master/schema');
const {  getPincodeDB, get_state_region_districtDB, get_state_district_blockDB } = require('../../models/V1/Master/utility');

// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const axios = require('axios');



exports.getPincode = async (req, res) => {
    const pincode = req.body.pincode || ''; // or req.query.searchText
    logger.log("info", `Pincode Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Fetch data from database with search text
        const result = await getPincodeDB(pincode);
        // const onlinePincode =await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const onlinePincode = await axios.get(`https://www.pincodesinfo.in/api/pincode/${pincode}`);
        // if (onlinePincode.status === "200" && onlinePincode.data[0].Status === "Success") {
        //     console.log(onlinePincode.data[0].PostOffice[0]);

        //     result.data.push({  
        //         pincode: onlinePincode.data[0].PostOffice[0].Pincode || onlinePincode.data[0].results[0].pincode,
        //         city: onlinePincode.data[0].PostOffice[0].District || onlinePincode.data[0].results[0].district,
        //         state: onlinePincode.data[0].PostOffice[0].State  || onlinePincode.data[0].results[0].state,
        //         country: onlinePincode.data[0].PostOffice[0].Country
        //     });
        // }
        var livedata =
            onlinePincode?.data?.results?.[0] ||
            onlinePincode?.data?.[0]?.results?.[0] ||
            onlinePincode?.data?.[0]?.PostOffice?.[0] ||
            null; 
            
        console.log(result.data);
        logger.log("info", `Pincode fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: livedata || result.data });
    } catch (error) {
        logger.log("error", `Pincode fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Pincode fetch failed" });
    }

}

exports.get_state_region_district = async (req, res) => {
    const data = req.body || '';
    logger.log("info", `get_state_region_district Details req_body = ${JSON.stringify(req.body)}`);

    try {
        // Fetch data from database with search text
        const result = await get_state_region_districtDB(data);
        logger.log("info", `get_state_region_district fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `get_state_region_district fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "get_state_region_district fetch failed" });
    }
}


exports.get_state_district_block = async (req, res) => {
    const data = req.body || '';
    logger.log("info", `get_state_district_block Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Fetch data from database with search text
        const result = await get_state_district_blockDB(data);
        logger.log("info", `get_state_district_block fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `get_state_district_block fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "get_state_district_block fetch failed" });
    }
}