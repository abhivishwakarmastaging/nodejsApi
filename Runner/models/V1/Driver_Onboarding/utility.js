const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const crypto = require("crypto");


exports.InsertDriverDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Safely handle DOB string parsing
                let dob = null;

                if (data.DOB) {

                    const parsedDate = new Date(data.DOB);

                    if (!isNaN(parsedDate.getTime())) {
                        dob = parsedDate;
                    }

                }

                // --- 1. Driver Core Details ---
                request.input('vendorid', sql.NVarChar(50), data.vendorid || null);
                request.input('full_name', sql.NVarChar(100), data.full_name || null);
                request.input('nick_name', sql.NVarChar(100), data.nick_name || null);
                request.input('contact_no', sql.NVarChar(15), data.contact_no);
                request.input('email_id', sql.NVarChar(100), data.email_id || null);
                // request.input('DOB', sql.Date, dob);

                // --- 2. Address Details ---
                request.input('building', sql.NVarChar(255), data.building || null);
                request.input('area', sql.NVarChar(255), data.area || null);
                request.input('district', sql.NVarChar(255), data.district || null);
                request.input('tahsil', sql.NVarChar(255), data.tahsil || null);
                request.input('city', sql.NVarChar(255), data.city || data.area || null);
                request.input('state', sql.NVarChar(255), data.state || null);
                request.input('pincode', sql.NVarChar(10), data.pincode || null);
                request.input('vehicle_preference', sql.NVarChar(50), data.vehicle_preference || 'motorcycle');
                // --- 3. Identity Details ---

                request.input('driving_license_flag', sql.NVarChar(100), data.driving_license_flag || 'N')
                request.input('driving_license_no', sql.NVarChar(100), data.driving_license_no || null);
                request.input('DOB', sql.Date, dob);
                request.input('aadhar_no', sql.NVarChar(100), data.aadhar_no || null);

                // --- 4. Reference Details ---
                request.input('referred_person_name', sql.NVarChar(100), data.referred_person_name || null);
                request.input('referred_person_no', sql.NVarChar(15), data.referred_person_no || null);
                request.input('relation', sql.NVarChar(50), data.relation || null);



                // --- 7. License/RTO Verification Details ---
                request.input('relatives_name', sql.NVarChar(100), data.relatives_name || null);
                request.input('address', sql.NVarChar(255), data.address || null);
                request.input('issuing_rto_name', sql.NVarChar(50), data.issuing_rto_name || null);
                request.input('date_of_issue', sql.NVarChar(100), data.date_of_issue || null);
                request.input('nt_validity_from', sql.NVarChar(100), data.nt_validity_from || null);
                request.input('nt_validity_to', sql.NVarChar(100), data.nt_validity_to || null);
                request.input('t_validity_from', sql.NVarChar(100), data.t_validity_from || null);
                request.input('t_validity_to', sql.NVarChar(100), data.t_validity_to || null);
                request.input('status', sql.NVarChar(50), data.status || null);
                request.input('source', sql.NVarChar(100), data.source || null);

                request.input('onboarded_by', sql.NVarChar(sql.MAX), data.onboarded_by || 'Driver');

                // --- 8. Outputs ---
                request.output('generated_driver_id', sql.NVarChar(50)); // Fixed: Registered output parameter
                request.output('bstatus_code', sql.NVarChar(10));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the correct stored procedure name
                return request.execute('Driver_Runner_Onboarding');
            })
            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    message: result.output.bmessage_desc,
                    driver_id: result.output.generated_driver_id
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.updateDriverDetailsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input
                request.input('driver_id', sql.NVarChar(50), data.driver_id);
                request.input('full_name', sql.NVarChar(50), data.full_name || null);
                request.input('Phone', sql.NVarChar(15), data.Phone || null);
                request.input('emergency_phone', sql.NVarChar(100), data.emergency_phone || null);
                request.input('Email', sql.NVarChar(100), data.Email || null);
                request.input('address1', sql.NVarChar(255), data.address1 || null);
                request.input('address2', sql.NVarChar(255), data.address2 || null);
                request.input('pincode', sql.NVarChar(10), data.pincode);
                request.input('state', sql.NVarChar(255), data.state);
                request.input('Tahsil', sql.NVarChar(255), data.Tahsil);
                request.input('City', sql.NVarChar(255), data.City);
                request.input('username', sql.NVarChar(50), data.username);
                request.input('password', sql.NVarChar(50), data.password);
                request.input('driving_license_no', sql.NVarChar(100), data.driving_license_no);
                request.input('expiry_date', sql.NVarChar(100), data.expiry_date);
                request.input('driving_license_address', sql.NVarChar(255), data.driving_license_address);
                request.input('vendorid', sql.NVarChar(50), data.vendorid);

                // request.input('aadhar_No', sql.NVarChar(100), data.aadhar_No);
                // request.input('police_verification', sql.Bit, data.police_verification);
                // request.input('police_verification_No', sql.NVarChar(100), data.police_verification_No);
                // request.input('verification_date', sql.NVarChar(100), data.verification_date);
                // request.input('current_address', sql.NVarChar(255), data.current_address);
                // request.input('permanent_address', sql.NVarChar(255), data.permanent_address);
                // request.input('referred_person_name', sql.NVarChar(100), data.referred_person_name);
                // request.input('referred_person_no', sql.NVarChar(15), data.referred_person_no);



                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('onboard_id', sql.NVarChar(255));


                // Call the stored procedure

                return request.execute('DriverUpdate');
            })
            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    message: result.output.bmessage_desc
                };
                resolve(output);
            }
            )
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.deleteDriverDetailsDB = (data) => {
    console.log(`[INFO]: Deleting Driver_Runner_Details record for driver_id: ${data.driver_id}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('driver_id', sql.NVarChar(255), data.driver_id); // Bind driver_id

                console.log(`[INFO]: Executing Query - DELETE FROM Driver_Runner_Details WHERE driver_id = ${data.driver_id}`);

                return request.query('DELETE FROM Driver_Runner_Details WHERE driver_id = @driver_id ');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Driver_Runner_Details record deleted successfully for driver_id: ${data.driver_id}`);
                    resolve({ message: `Driver_Runner_Details record deleted successfully for driver_id: ${data.driver_id}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for driver_id: ${data.driver_id}`);
                    resolve({ message: `No records found for driver_id: ${data.driver_id}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Driver_Runner_Details Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getDriverDetailsDB = (data) => {
    console.log(`[INFO]: Fetching DriverDetails for  driver_id: ${data.driver_id}`);

    return new Promise((resolve, reject) => {
        // 1. Establish connection using your pool configuration
        sql.connect(pool)
            .then(conn => {
                const request = conn.request();

                // 2. Safely input parameters to prevent SQL injection
                if (data.driver_id) {
                    request.input('driver_id', sql.NVarChar(255), data.driver_id);
                } else {
                    throw new Error("driver_id is required");
                }

                // 3. Define your queries
                const driverQuery = `SELECT * FROM Driver_Runner_Details WHERE driver_id = @driver_id`;
                const docsQuery = `SELECT driver_id, photo_url, photo_type FROM Driver_Runner_Doc WHERE driver_id = @driver_id`;

                // 4. Run both queries in parallel using Promise.all
                return Promise.all([
                    request.query(driverQuery),
                    request.query(docsQuery)
                ]);
            })
            .then(([driverResult, docsResult]) => {
                const driverInfo = driverResult.recordset[0]; // Assuming driver_id is unique
                const driverDocs = docsResult.recordset;

                // If no driver is found, handle it gracefully
                if (!driverInfo) {
                    return resolve({
                        status: '01',
                        message: 'No driver found with the provided ID',
                        counts: 0,
                        data: null
                    });
                }

                // 5. Merge the results together
                const merged = {
                    ...driverInfo,
                    documents: driverDocs
                };

                // 6. Resolve with the proper payload
                resolve({
                    status: '00',
                    message: 'Fetched driver data',
                    // counts: driverDocs.length + 1, // Total records retrieved
                    data: merged
                });
            })
            .catch(error => {
                console.error(`[ERROR]: Get Driver Error: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
            });
    });
};

exports.ImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        const query = `
            INSERT INTO Driver_Runner_Doc (driver_id,	photo_id,	photo_type,	photo_url,name,	insert_date	) 
            VALUES (@driver_id,	@photo_id, @photo_type, @photo_url, @name , GETDATE());
        `;
        request.input('driver_id', sql.NVarChar(50), data.DriverID);
        request.input('photo_id', sql.NVarChar(50), data.photo_id);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);
        request.input('photo_url', sql.NVarChar(500), data.photo_url);
        request.input('name', sql.NVarChar(255), data.name);

        await request.query(query);

        return {
            status: "00",
            message: "Image uploaded successfully"
        };
    } catch (err) {
        console.error(`[ERROR]: ImageUploadDB Error: ${err.message}`);
        return {
            status: "03",
            message: err.message.includes("Invalid photo type") ? "Invalid photo type" : "SQL Error: " + err.message
        };
    }
};

exports.UpdateImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        // Check if the photo_type for the vendor already exists
        const checkQuery = `
            SELECT COUNT(*) AS count 
            FROM Driver_Runner_Photos 
            WHERE driver_id = @driver_id AND photo_type = @photo_type;
        `;

        request.input('driver_id', sql.NVarChar(50), data.driver_id);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);

        const checkResult = await request.query(checkQuery);
        const recordExists = checkResult.recordset[0].count > 0;

        if (recordExists) {
            // Update existing record
            const updateRequest = poolConnection.request();
            updateRequest.input('driver_id', sql.NVarChar(50), data.driver_id);
            updateRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            updateRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            updateRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            updateRequest.input('name', sql.NVarChar(255), data.name);

            const updateQuery = `
                UPDATE Driver_Runner_Photos
                SET photo_id = @photo_id,
                    photo_url = @photo_url,
                    name = @name,
                    update_date = GETDATE()
                WHERE driver_id = @driver_id AND photo_type = @photo_type;
            `;

            await updateRequest.query(updateQuery);

            return {
                status: "00",
                message: "Image record updated successfully"
            };
        } else {
            // Insert new record
            const insertRequest = poolConnection.request();
            insertRequest.input('driver_id', sql.NVarChar(50), data.driver_id);
            insertRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            insertRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            insertRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            insertRequest.input('name', sql.NVarChar(255), data.name);

            const insertQuery = `
                INSERT INTO Driver_Runner_Photos (driver_id, photo_id, photo_type, photo_url, name, insert_date)
                VALUES (@driver_id, @photo_id, @photo_type, @photo_url, @name, GETDATE());
            `;

            await insertRequest.query(insertQuery);

            return {
                status: "00",
                message: "Image uploaded successfully"
            };
        }

    } catch (err) {
        console.error(`[ERROR]: ImageUploadDB Error: ${err.message}`);
        return {
            status: "03",
            message: err.message.includes("Invalid photo type") ? "Invalid photo type" : "SQL Error: " + err.message
        };
    }
};

