const sql = require('mssql');
const pool = require('../../../../db/db');
const { logger } = require('../../../../log/logger'); 

exports.insertOrUpdate_DriverLiveLocationDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input parameters mapping to SP
                request.input('DriverID', sql.NVarChar(50), data.DriverID);
                request.input('VendorID', sql.NVarChar(50), data.VendorID);
                request.input('TripID', sql.NVarChar(50), data.TripID || null);
                request.input('VehicleID', sql.NVarChar(50), data.VehicleID || null);
                request.input('MobileNo', sql.NVarChar(20), data.MobileNo || null);
                request.input('Lat', sql.Decimal(10, 6), data.Lat);
                request.input('Lng', sql.Decimal(10, 6), data.Lng);
                request.input('Speed', sql.Decimal(10, 2), data.Speed || null);
                request.input('Direction', sql.NVarChar(50), data.Direction || null);
                request.input('City', sql.NVarChar(100), data.City || null);
                request.input('District', sql.NVarChar(100), data.District || null);
                request.input('Taluka', sql.NVarChar(100), data.Taluka || null);
                request.input('State', sql.NVarChar(100), data.State || null);
                request.input('Pincode', sql.NVarChar(10), data.Pincode || null);
                request.input('Address', sql.NVarChar(255), data.Address || null);
                request.input('Status', sql.NVarChar(20), data.Status || 'Online');

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call stored procedure
                return request.execute("InsertOrUpdateDriverLiveLocation");
            })
            .then(result => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "Success",
                    data: result.recordset
                });
            })
            .catch(err => {
                logger.log("error", `insertOrUpdate_DriverLiveLocation DB Error: ${err.message}`);
                reject({
                    bstatus_code: "96",
                    bmessage_desc: "DB Error",
                    error: err.message
                });
            });
    });
};

exports.get_DriverLiveLocationDB = async (data) => {
 return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // request.input('DriverID', sql.NVarChar(10), data.DriverID);
                // request.input('VendorID', sql.NVarChar(10), data.VendorID);
                // request.input('VehicleID', sql.NVarChar(10), data.VehicleID);
                                return request.query(`SELECT * FROM DriverLiveLocation 
                                                        ORDER BY insert_date DESC;
                                                        `);
            })
            .then(result => {
                resolve({ bstatus_code: "00", bmessage_desc: "Success", data: result.recordset });
            }
            )
            .catch(err => {
                logger.log("error", `get_DriverLiveLocation DB Error: ${err.message}`);
                reject({ bstatus_code: "96", bmessage_desc: "DB Error", error: err });
            });
    }
    );
}
