const sql = require('mssql');
const pool = require('../../db/db');

// Driver OTP

exports.Driver_SendOTPDB = (mobile_number,otp) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();


                // Input Parameters
                request.input('mobile_number', sql.NVarChar(15), mobile_number);
                request.input('otp', sql.NVarChar(6), otp);
                // request.input('expiresAt', sql.DateTime, data.expiresAt);

                // Output Parameters
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('Driver_Runner_SendOTP'); // Update with your SP name
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.Driver_ValidateOTPDB = (mobile_number,otp) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();


                // Input Parameters
                request.input('mobile_number', sql.NVarChar(255), mobile_number);
                request.input('otp', sql.NVarChar(255), otp);
                // request.input('expiresAt', sql.DateTime, data.expiresAt);

                // Output Parameters
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('Driver_Details', sql.NVarChar(sql.MAX));

                // Call the stored procedure
                return request.execute('Driver_Runner_ValidateOTP'); // Update with your SP name
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    Driver_Details: result.output.Driver_Details                    
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};