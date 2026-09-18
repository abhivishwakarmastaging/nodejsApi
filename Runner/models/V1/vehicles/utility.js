const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.VehicleOnboardingDB = (data, vehicleData) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // IDs
                request.input('driverid', sql.NVarChar(50), data.driverid);

                // --- 5. Vehicle Details ---
                request.input('rc_owner_name', sql.NVarChar(255), data.rc_owner_name || null);
                request.input('rc_mobile_number', sql.NVarChar(50), data.rc_mobile_number || null);
                request.input('registration_no', sql.NVarChar(50), data.registrationNo || null);
                request.input('registration_date', sql.DateTime, data.registration_date || null);
                request.input('registered_at', sql.NVarChar(255), data.registered_at || null);
                request.input('rc_status', sql.NVarChar(50), data.rc_status || null);
                request.input('owner_name', sql.NVarChar(255), data.owner_name || null);
                request.input('father_name', sql.NVarChar(255), data.father_name || null);
                request.input('present_address', sql.NVarChar(sql.MAX), data.present_address || null);
                request.input('permanent_address', sql.NVarChar(sql.MAX), data.permanent_address || null);
                request.input('mobile_number', sql.NVarChar(50), data.mobile_number || null);
                request.input('vehicle_category', sql.NVarChar(50), data.vehicle_category || null);
                request.input('vehicle_category_description', sql.NVarChar(255), data.vehicle_category_description || null);
                request.input('vehicle_manufacturer', sql.NVarChar(255), data.maker_description || null);
                request.input('maker_model', sql.NVarChar(100), data.maker_model || null);
                request.input('body_type', sql.NVarChar(100), data.body_type || null);
                request.input('fuel_type', sql.NVarChar(50), data.fuel_type || null);
                request.input('manufacturing_date', sql.NVarChar(50), data.manufacturing_date || null);
                request.input('chassis_number', sql.NVarChar(50), data.vehicle_chasi_number || null);
                request.input('engine_number', sql.NVarChar(50), data.vehicle_engine_number || null);
                request.input('cubic_capacity', sql.NVarChar(50), data.cubic_capacity || null);
                request.input('vehicle_gross_weight', sql.NVarChar(50), data.vehicle_gross_weight || null);
                request.input('unladen_weight', sql.NVarChar(50), data.unladen_weight || null);
                request.input('no_cylinders', sql.NVarChar(10), data.no_cylinders || null);
                request.input('seat_capacity', sql.NVarChar(10), data.seat_capacity || null);
                request.input('fit_upto', sql.Date, data.fit_up_to || null);
                request.input('insurance_upto', sql.Date, data.insurance_upto || null);
                request.input('tax_upto', sql.Date, data.tax_upto || null);
                request.input('tax_paid_upto', sql.Date, data.tax_paid_upto || null);
                request.input('pucc_number', sql.NVarChar(50), data.pucc_number || null);
                request.input('pucc_upto', sql.Date, data.pucc_upto || null);
                request.input('permit_number', sql.NVarChar(50), data.permit_number || null);
                request.input('permit_type', sql.NVarChar(100), data.permit_type || null);
                request.input('permit_valid_from', sql.Date, data.permit_valid_from || null);
                request.input('permit_valid_upto', sql.Date, data.permit_valid_upto || null);

                // --- 6. Vehicle Dimensions & Capacity ---
                request.input('loadingCapacityGVW', sql.Float, data.loadingCapacityGVW || null);
                request.input('emptyVehicleWeight', sql.Float, data.emptyVehicleWeight || null);
                request.input('loadingCapacityCubic', sql.Float, data.cubicCapacity || null);
                request.input('vehicleType', sql.NVarChar(50), data.vehicleType || null);
                // request.input('vehicle_Category', sql.NVarChar(50), data.vehicleCategory || null);
                request.input('topRemovable', sql.Bit, data.topRemovable || null);
                request.input('height', sql.NVarChar(50), data.height || null);
                request.input('length', sql.NVarChar(50), data.length || null);
                request.input('width', sql.NVarChar(50), data.width || null);
                request.input('vehicleOwnershipType', sql.NVarChar(50), data.vehicleOwnershipType || null);
                request.input('VehicleOwnership_name', sql.NVarChar(100), data.VehicleOwnership_name || null);
                request.input('VehicleOwnership_mobile_number', sql.NVarChar(15), data.VehicleOwnership_mobile_number || null);


                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('vehical_details', sql.NVarChar(255));

                

                // Execute stored procedure
                return request.execute('InsertRunnerVehicle');
            })
            .then(result => {
                resolve({
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    vehical_details: result.output.vehical_details
                });
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.getVehicleDB = (data) => {
    console.log(`[INFO]: Fetching VehicleDetails for driverid: ${data.driverid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('driverid', sql.NVarChar(255), data.driverid);

                return request.query(
                    'SELECT * FROM VehicleRunnerDetails WHERE driverid=@driverid'
                );
            })
            .then(result => {
                resolve({
                    status: '00',
                    message: 'Fetched vehicle data',
                    data: result.recordset
                });
            })
            .catch(error => {
                console.error(`[ERROR]: Get Vehicle Error: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
            });
    });
};

exports.deleteVehicleDB = (vendorid, vehicleid) => {
    console.log(`[INFO]: Deleting Vehicle record for vendorid: ${vendorid}, vehicleid: ${vehicleid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                // Use separate requests for each delete
                const detailsRequest = pool.request();
                const typesRequest = pool.request();

                detailsRequest.input('vendorid', sql.NVarChar(255), vendorid);
                detailsRequest.input('vehicleid', sql.NVarChar(255), vehicleid);
                typesRequest.input('vendorid', sql.NVarChar(255), vendorid);
                typesRequest.input('vehicleid', sql.NVarChar(255), vehicleid);

                console.log(
                  `[INFO]: Executing Query - DELETE FROM VehicleDetails WHERE vendorid=@vendorid AND vehicleid=@vehicleid`
                );
                console.log(
                  `[INFO]: Executing Query - DELETE FROM VehicleTypesDetails WHERE vendorid=@vendorid AND vehicleid=@vehicleid`
                );

                const deleteDetailsPromise = detailsRequest.query(
                    'DELETE FROM VehicleDetails WHERE vendorid = @vendorid AND vehicleid = @vehicleid'
                );
                const deleteTypesPromise = typesRequest.query(
                    'DELETE FROM VehicleTypesDetails WHERE vendorid = @vendorid AND vehicleid = @vehicleid'
                );

                return Promise.all([deleteDetailsPromise, deleteTypesPromise]);
            })
            .then(([detailsResult, typesResult]) => {
                // rowsAffected is an array: [count]
                const detailsCount = detailsResult.rowsAffected[0] || 0;
                const typesCount = typesResult.rowsAffected[0] || 0;
                const totalDeleted = detailsCount + typesCount;

                if (totalDeleted > 0) {
                    console.log(
                        `[SUCCESS]: Deleted ${totalDeleted} record(s) (Vehicle details Count: ${detailsCount}, Vehicle types Count: ${typesCount}) for driverid: ${vendorid}, vehicleid: ${vehicleid}`
                      );
                      resolve({ 
                          message: `Deleted ${totalDeleted} record(s) (Vehicle details Count: ${detailsCount},Vehicle types Count: ${typesCount}) for driverid: ${vendorid}, vehicleid: ${vehicleid}`,
                          status: "00" 
                      });
                } else {
                    console.log(
                      `[INFO]: No records found to delete for driverid: ${vendorid}, vehicleid: ${vehicleid}`
                    );
                    resolve({ message: `No records found`, status: "01" });
                }
            })
            .catch(error => {
                console.error(
                  `[ERROR]: Delete Vehicle Error: SQL Error: ${error.message}`
                );
                reject({ message: 'SQL Error: ' + error.message, statusCode: 2550, status: "01" });
            });
    });
};

exports.updateVehicleDB = (data) => {
    console.log(`[INFO]: Updating Vehicle record for driverid: ${data.driverid}`);

    return new Promise((resolve, reject) => {
        
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(15), data.vendorid);
                request.input('vehicleid', sql.NVarChar(15), data.vehicleid);

                 // Vehicle Details
                request.input('registration_no', sql.NVarChar(255), data.vehicleDetails.registrationNo);
                request.input('registration_date', sql.DateTime, data.vehicleDetails.registrationDate);
                request.input('owner_name', sql.NVarChar(255), data.vehicleDetails.ownerName);
                request.input('vehicle_manufacturer', sql.NVarChar(255), data.vehicleDetails.vehicleManufacture);
                request.input('model', sql.NVarChar(255), data.vehicleDetails.model);
                request.input('chassis_number', sql.NVarChar(255), data.vehicleDetails.chassisNumber);
                request.input('engine_number', sql.NVarChar(255), data.vehicleDetails.engineNumber);
                request.input('road_tax_date', sql.NVarChar(255), data.vehicleDetails.roadtaxdate);
                request.input('vehicle_fitness_duration', sql.NVarChar(255), data.vehicleDetails.fitnessDuration);
                request.input('puc_expiry_date', sql.NVarChar(255), data.vehicleDetails.puc_expiry_date);

                // request.input('mv_tax_validity', sql.NVarChar(255), data.vehicleDetails.mvTaxValidity);
                // request.input('vehicle_Type', sql.NVarChar(255), data.vehicleDetails.vehicleType);
                // request.input('fuel_type', sql.NVarChar(255), data.vehicleDetails.fuelType);
                // request.input('model_manufacturer_details', sql.NVarChar(255), data.vehicleDetails.modelManufacturerDetails);
                // request.input('puc_number', sql.NVarChar(255), data.vehicleDetails.pucNo);
                // request.input('insurance_details', sql.NVarChar(255), data.vehicleDetails.insuranceDetails);
                // request.input('rc_status', sql.NVarChar(255), data.vehicleDetails.rcStatus);
                // request.input('financier_name', sql.NVarChar(255), data.vehicleDetails.financierName);
                // request.input('vehicle_status', sql.NVarChar(255), data.vehicleDetails.vehicle_status);
                // request.input('fastag_number', sql.NVarChar(255), data.vehicleDetails.fastag_number);
                // request.input('fastag_issued_date', sql.NVarChar(255), data.vehicleDetails.fastag_issued_date);
                // request.input('insurance_expiry_date', sql.NVarChar(255), data.vehicleDetails.insurance_expiry_date);

                // Vehicle Types Details
                request.input('loadingCapacityGVW', sql.Float, data.VehicleTypesDetails.loadingCapacityGVW);
                request.input('emptyVehicleWeight', sql.Float, data.VehicleTypesDetails.emptyVehicleWeight);
                request.input('loadingCapacityCubic', sql.Float, data.VehicleTypesDetails.loadingCapacityCubic);
                request.input('vehicle_Type', sql.NVarChar(255), data.VehicleTypesDetails.vehicleType);
                request.input('vehicle_Category', sql.NVarChar(255), data.VehicleTypesDetails.vehicleCategory);
                request.input('topRemovable', sql.Bit, data.VehicleTypesDetails.topRemovable);


                // request.input('serialNo', sql.NVarChar(255), data.VehicleTypesDetails.serialNo);
                // request.input('numberOfTyres', sql.Int, data.VehicleTypesDetails.numberOfTyres);
                // request.input('manufactureDate', sql.Date, data.VehicleTypesDetails.manufactureDate);
                // request.input('vehicleHeading', sql.NVarChar(255), data.VehicleTypesDetails.vehicleHeading);
                // request.input('Vehicle_Paticular', sql.NVarChar(255), data.VehicleTypesDetails.Vehicle_Paticular);
                // request.input('Vehicle_Manufacture_Company', sql.NVarChar(255), data.VehicleTypesDetails.Vehicle_Manufacture_Company);
                // request.input('dhalaLength', sql.Float, data.VehicleTypesDetails.dhalaLength);
                // request.input('dhalaWidth', sql.Float, data.VehicleTypesDetails.dhalaWidth);
                // request.input('dhalaHeight', sql.Float, data.VehicleTypesDetails.dhalaHeight);
                // request.input('bodyType', sql.NVarChar(255), data.VehicleTypesDetails.bodyType);
                // request.input('loadingPreference', sql.NVarChar(255), data.VehicleTypesDetails.loadingPreference);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdateVehicleDetails');

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

exports.ImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

     const query = `
    INSERT INTO Driver_Runner_Doc
    (
        driver_id,
        photo_id,
        photo_type,
        photo_url,
        name,
        insert_date
    )
    VALUES
    (
        @driverid,
        @photo_id,
        @photo_type,
        @photo_url,
        @name,
        GETDATE()
    );
`;
        request.input('driverid', sql.NVarChar(50), data.driverid);
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

exports.updateImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        // Check if the photo_type for the vendor already exists
        const checkQuery = `
            SELECT COUNT(*) AS count 
            FROM Driver_Runner_Doc 
            WHERE vehicle_id = @vehicle_id ;
        `;

        request.input('vehicle_id', sql.NVarChar(50), data.vehicle_id);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);

        const checkResult = await request.query(checkQuery);
        const recordExists = checkResult.recordset[0].count > 0;

        if (recordExists) {
            // Update existing record
            const updateRequest = poolConnection.request();
            updateRequest.input('vehicle_id', sql.NVarChar(50), data.vehicle_id);
            updateRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            updateRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            updateRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            updateRequest.input('name', sql.NVarChar(255), data.name);

            const updateQuery = `
                UPDATE Vehiclephotos
                SET photo_id = @photo_id,
                    photo_url = @photo_url,
                    name = @name,
                    update_date = GETDATE()
                WHERE vehicle_id = @vehicle_id ;
            `;

            await updateRequest.query(updateQuery);

            return {
                status: "00",
                message: "Image record updated successfully"
            };
        } else {
            // Insert new record
            const insertRequest = poolConnection.request();
            insertRequest.input('vehicle_id', sql.NVarChar(50), data.vehicle_id);
            insertRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            insertRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            insertRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            insertRequest.input('name', sql.NVarChar(255), data.name);

            const insertQuery = `
                INSERT INTO Vehiclephotos (vehicle_id, photo_id, photo_type, photo_url, name, insert_date)
                VALUES (@vehicle_id, @photo_id, @photo_type, @photo_url, @name, GETDATE());
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