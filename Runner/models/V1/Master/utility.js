const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.getPincodeDB = async (pincode = '') => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                let query = `SELECT * FROM pincode`;

                // Apply search only if pincode is 3 or more characters
                if (pincode && pincode.length >= 3) {
                    query += ` WHERE pincode LIKE @pincode`;
                    request.input('pincode', sql.NVarChar, `%${pincode}%`);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "pincode fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
}

exports.get_state_region_districtDB = async (data) => {
    return new Promise((resolve, reject) => {
        const { state, region, district, excludeDistricts = [] } = data; 

        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";

                if (!state && !region && !district) {
                    // Case 1: No params → return DISTINCT state list
                    query = `SELECT DISTINCT state FROM pincode ORDER BY state`;
                }
                else if (state && !region && !district) {
                    // Case 2: State selected → return regions for that state
                    query = `SELECT DISTINCT region FROM pincode WHERE state = @state ORDER BY region`;
                    request.input('state', sql.VarChar, state);
                }
                else if (state && region && !district) {
                    // Case 3: State + Region selected → return districts (exclude already selected)
                    query = `
                        SELECT DISTINCT district 
                        FROM pincode 
                        WHERE state = @state AND region = @region
                    `;
                    request.input('state', sql.VarChar, state);
                    request.input('region', sql.VarChar, region);

                    if (excludeDistricts.length > 0) {
                        // Add NOT IN condition
                        const excluded = excludeDistricts.map(d => `'${d}'`).join(",");
                        query += ` AND district NOT IN (${excluded})`;
                    }

                    query += ` ORDER BY district`;
                }
                else {
                    // Case 4: Full search with all filters
                    query = `SELECT * FROM pincode 
                             WHERE state = @state AND region = @region AND district = @district`;
                    request.input('state', sql.VarChar, state);
                    request.input('region', sql.VarChar, region);
                    request.input('district', sql.VarChar, district);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "Data fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
};

exports.get_state_district_blockDB = async (data) => {
    return new Promise((resolve, reject) => {
        const { state, district } = data; // incoming search params
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";

                if (!state && !district) {
                    // Case 1: No params → return DISTINCT state list
                    query = `SELECT DISTINCT state FROM pincode ORDER BY state`;
                }
                else if (state && !district) {
                    // Case 2: State selected → return districts for that state
                    query = `SELECT DISTINCT district FROM pincode WHERE state = @state ORDER BY district`;
                    request.input('state', sql.VarChar, state);
                }
                else {
                    // Case 3: State + District selected → return divisions (exclude already selected)
                    query = `
                        SELECT DISTINCT division 
                        FROM pincode 
                        WHERE state = @state AND district = @district
                    `;
                    request.input('state', sql.VarChar, state);
                    request.input('district', sql.VarChar, district);
                }

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "Data fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
};
