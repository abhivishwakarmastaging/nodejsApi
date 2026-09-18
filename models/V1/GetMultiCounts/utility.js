const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.getMultiCountsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => { 
                const request = pool.request();

                request.input('vendorID', sql.NVarChar(50), data.vendorid);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('DriverSummary', sql.NVarChar(sql.MAX));
                request.output('VehicleSummary', sql.NVarChar(sql.MAX));
                request.output('TripSummary', sql.NVarChar(sql.MAX));

                

                // Call the stored procedure
                return request.execute('GetMultiCounts');
            })

            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    data: {
                        DriverSummary: result.output.DriverSummary ? JSON.parse(result.output.DriverSummary) : null,
                        VehicleSummary: result.output.VehicleSummary ? JSON.parse(result.output.VehicleSummary) : null,
                        TripSummary: result.output.TripSummary ? JSON.parse(result.output.TripSummary) : null
                    }
                };
                console.log('GetMultiCountsDB Output:', JSON.stringify(output));
                resolve(output);
            }
            )
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

