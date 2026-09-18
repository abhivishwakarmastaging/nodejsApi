const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

const logger = require('../../../log/logger');

exports.Driver_Set_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('DriverID', sql.NVarChar(255), payload.DriverID);
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('Driver_MPIN', sql.NVarChar(255), payload.Driver_MPIN);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Driver_Runner_SetMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};
   
// Login function
exports.Driver_login_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('DriverID', sql.NVarChar(255), payload.DriverID);
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('Driver_MPIN', sql.NVarChar(255), payload.Driver_MPIN);
            
                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('Driver_Details', sql.NVarChar(sql.MAX));

                // Fetch user details from the database
                return request.execute('Driver_Runner_loginMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    Driver_Details: result.output.Driver_Details ? JSON.parse(result.output.Driver_Details) : null,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// Change MPIN function
exports.Driver_Change_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Input Parameters
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('Old_Driver_MPIN', sql.NVarChar(255), payload.Old_Driver_MPIN);
                request.input('New_Driver_MPIN', sql.NVarChar(255), payload.New_Driver_MPIN);
                request.input('Confirm_Driver_MPIN', sql.NVarChar(255), payload.Confirm_Driver_MPIN);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Driver_Runner_ChangeMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// Forgot MPIN function
exports.Driver_Forgot_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('New_Driver_MPIN', sql.NVarChar(255), payload.New_Driver_MPIN);
                request.input('Confirm_Driver_MPIN', sql.NVarChar(255), payload.Confirm_Driver_MPIN);
            
                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Driver_Runner_ForgotMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// Logout function

exports.Driver_logout_MpinDB = async (payload) => {
    const { DepartmentID } = payload; // Extract DepartmentID from payload

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('DepartmentID', sql.NVarChar(255), DepartmentID); // Bind DepartmentID
                console.log(`[INFO]: Executing Query - DELETE FROM Departments  WHERE DepartmentID = ${DepartmentID}`);
                return request.query('DELETE FROM Departments WHERE DepartmentID = @DepartmentID');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Departments deleted successfully for DepartmentID: ${DepartmentID}`);
                    resolve({ message: `Departments deleted successfully for DepartmentID: ${DepartmentID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for DepartmentID: ${DepartmentID}`);
                    resolve({ message: `No records found for DepartmentID: ${DepartmentID}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
}
