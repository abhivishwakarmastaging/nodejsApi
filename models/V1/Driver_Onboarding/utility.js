const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported


exports.qrscan_DriverDetailsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('driver_id', sql.NVarChar(50), data.driver_id);
                request.input('onboard_id', sql.NVarChar(50), data.onboard_id);


                // ✅ DriverID se fetch
                if (data.driver_id) {
                    return request.query(`
                      SELECT 
                            d.*,
                            (
                                SELECT 
                                    photo_type,
                                    photo_url
                                FROM Driver_Doc dd
                                WHERE dd.driver_id = d.driver_id
                                FOR JSON PATH
                            ) AS documents
                        FROM Driver_Details d
                        WHERE d.driver_id = @driver_id;
                    `);
                }

                // ✅ OnboardID se fetch
                if (data.onboard_id) {
                    return request.query(`
                         
                          SELECT 
                                  d.vendor_id,
                               d.full_name,
                               d.nick_name,
                               d.contact_no,
                               d.email_id,
                               d.building,
                               d.area,
                               d.district,
                               d.tahsil,
                               d.city,
                               d.state,
                               d.pincode,
                               d.driving_license_no,
                               d.DOB,
                               d.aadhar_no,
                               d.referred_person_name,
                               d.referred_person_no,
                               d.relation,
                               d.driver_verify_flag,
                               d.kyc_verify_flag,
                               d.onboard_id,
                               d.onboarding_flag,
                               d.vendor_accept_status,
                               d.auth_status,
                               d.is_verified,
                               d.status,
                               d.onboarded_by,
                               d.insert_date,
                               d.update_date,
                           
                               o.id,
                               o.driver_id,
                               o.OB_token,
                               o.expires_at,
                               o.is_used,
                               o.created_at,
                               o.used_at,
                                  (
                                      SELECT photo_type, photo_url
                                      FROM Driver_Doc dd
                                      WHERE dd.driver_id = d.driver_id
                                      FOR JSON PATH
                                  ) AS documents
                              FROM Driver_Details d
                              JOIN Driver_OnboardingID o 
                                  ON d.onboard_id = o.onboard_id
                        WHERE o.onboard_id = @onboard_id 
                        
                    `);
                }
            })
            .then(result => {
                // ⚠️ Agar upar se resolve ho gaya ho
                if (!result) return;

                // ❌ No record found
                if (result.recordset.length === 0) {
                    return resolve({
                        status: "03",
                        message: "No data found",
                        data: []
                    });
                }

                // ✅ Success
                resolve({
                    status: "00",
                    message: "Data fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                reject({
                    status: "99",
                    message: err.message
                });
            });
    });
};

exports.DriververificationDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input
                request.input('driver_id', sql.NVarChar(50), data.driver_id);
                request.input('vendor_id', sql.NVarChar(50), data.vendorid || null);
                request.input('driving_license_no', sql.NVarChar(100), data.driving_license_no || null);
                request.input('DOB', sql.NVarChar(100), data.DOB);
                request.input('full_name', sql.NVarChar(50), data.full_name || null);
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
                request.input('onboarded_by', sql.NVarChar(sql.MAX), data.onboarded_by || 'vendor');


                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('Driver_License_Insert');
            })
            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    message: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};


exports.InsertDriverDB = (data, driver_id) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Input
                request.input('driver_id', sql.NVarChar(50), driver_id);
                request.input('full_name', sql.NVarChar(50), data.full_name);
                request.input('Phone', sql.NVarChar(15), data.Phone);
                request.input('emergency_phone', sql.NVarChar(100), data.emergency_phone);
                request.input('Email', sql.NVarChar(100), data.Email);
                request.input('address1', sql.NVarChar(255), data.address1);
                request.input('address2', sql.NVarChar(255), data.address2);
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

                // Call the stored procedure
                return request.execute('DriverInsert');
            })
            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    message: result.output.bmessage_desc
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
                request.input('full_name', sql.NVarChar(50), data.full_name);
                request.input('Phone', sql.NVarChar(15), data.Phone);
                request.input('emergency_phone', sql.NVarChar(100), data.emergency_phone);
                request.input('Email', sql.NVarChar(100), data.Email);
                request.input('address1', sql.NVarChar(255), data.address1);
                request.input('address2', sql.NVarChar(255), data.address2);
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
    console.log(`[INFO]: Deleting Driver_Detailss record for driver_id: ${data.driver_id}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('driver_id', sql.NVarChar(255), data.driver_id); // Bind driver_id
                request.input('vendorid', sql.NVarChar(255), data.vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - DELETE FROM Driver_Details WHERE driver_id = ${data.driver_id}`);

                return request.query('DELETE FROM Driver_Details WHERE driver_id = @driver_id AND vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Driver_Details record deleted successfully for driver_id: ${data.driver_id}`);
                    resolve({ message: `Vehicle type deleted successfully for driver_id: ${data.driver_id}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for driver_id: ${data.driver_id}`);
                    resolve({ message: `No records found for driver_id: ${data.driver_id}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Driver_Details Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getDriverDetailsDB = (data) => {
    console.log(`[INFO]: Fetching DriverDetails for vendorid: ${data.vendorid}, driver_id: ${data.driver_id}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const countRequest = pool.request();
                const detailsRequest = pool.request();
                const photoRequest = pool.request();

                // Input bindings
                if (data.vendorid) {
                    countRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
                    detailsRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
                }
                if (data.driver_id) {
                    detailsRequest.input('driver_id', sql.NVarChar(255), data.driver_id);
                    photoRequest.input('driver_id', sql.NVarChar(255), data.driver_id);
                }

                // Queries
                const detailsQuery = data.driver_id
                    ? 'SELECT * FROM Driver_Details WHERE driver_id = @driver_id AND vendor_id = @vendorid'
                    : 'SELECT * FROM Driver_Details WHERE vendor_id = @vendorid';

                const photoQuery = data.driver_id
                    ? 'SELECT driver_id, photo_url, photo_type FROM Driver_Doc WHERE driver_id = @driver_id '
                    : 'SELECT driver_id, photo_url, photo_type FROM Driver_Doc ';

                // const photoQuery = data.driver_id
                //     ? 'SELECT driver_id, photo_url, photo_type FROM Driver_Doc WHERE driver_id = @driver_id AND photo_type = \'profile_photo\''
                //     : 'SELECT driver_id, photo_url, photo_type FROM Driver_Doc WHERE photo_type = \'profile_photo\'';

                const statusCountsQuery = data.vendorid
                    ? `SELECT 
                            COUNT(*) AS total,
                            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_count,
                            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_count
                        FROM Driver_Details
                        WHERE vendor_id = @vendorid`
                    : `SELECT 
                            COUNT(*) AS total,
                            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_count,
                            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_count
                        FROM Driver_Details`;

                const photoPromise = photoRequest.query(photoQuery);
                const detailsPromise = detailsRequest.query(detailsQuery);
                const countPromise = countRequest.query(statusCountsQuery);

                return Promise.all([countPromise, detailsPromise, photoPromise]);
            })
            .then(([countResult, detailsResult, photoResult]) => {
                const counts = countResult.recordset[0]; // ✅ Use the first record directly
                const details = detailsResult.recordset;
                const photos = photoResult.recordset || [];

                // Merge results
                const merged = details.map(detail => {
                    const { vendorid, driver_id, ...DriverDetails } = detail;

                    // const photoMatch = photos.find(p => String(p.driver_id) === String(driver_id));
                    // const Driver_Photos = photoMatch
                    //     ? (({ driver_id, ...rest }) => rest)(photoMatch)
                    //     : null;

                    return {
                        vendorid,
                        driver_id,
                        DriverDetails,
                        photos
                    };
                });

                resolve({
                    status: '00',
                    message: 'Fetched driver data',
                    counts,
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
            INSERT INTO Driver_Photos (driver_id,	photo_id,	photo_type,	photo_url,name,	insert_date	) 
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
            FROM Driver_Photos 
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
                UPDATE Driver_Photos
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
                INSERT INTO Driver_Photos (driver_id, photo_id, photo_type, photo_url, name, insert_date)
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