const sql = require('mssql');
const pool = require('../db/db.js');
const moment = require("moment");


exports.checkExpiryAlerts = async (req, res) => {
    try {
        const { vendorid } = req.body;

        const data = await checkExpiryAlertsDB(vendorid);

        res.json({
            status: "00",
            message: "Expiry alerts fetched",
            count: data.length,
            data
        });

    } catch (err) {
        res.status(500).json({
            status: "99",
            message: err
        });
    }
};

const checkExpiryAlertsDB = (vendorid = null) => {
    return new Promise((resolve, reject) => {

        sql.connect(pool)
            .then(poolConn => {
                const request = poolConn.request();

                const days = 3;

                let query = `
          DECLARE @days INT = ${days};

          SELECT 
    vehicleid,
    vendorid,
    registration_no,

    fit_upto,
    insurance_upto,
    tax_paid_upto,
    permit_valid_upto,
    pucc_upto,

    CASE 
        WHEN insurance_upto <= DATEADD(DAY, @days, GETDATE()) THEN 'INSURANCE_EXPIRY'
        WHEN fit_upto <= DATEADD(DAY, @days, GETDATE()) THEN 'FITNESS_EXPIRY'
        WHEN tax_paid_upto <= DATEADD(DAY, @days, GETDATE()) THEN 'TAX_EXPIRY'
        WHEN permit_valid_upto <= DATEADD(DAY, @days, GETDATE()) THEN 'PERMIT_EXPIRY'
        WHEN pucc_upto <= DATEADD(DAY, @days, GETDATE()) THEN 'PUC_EXPIRY'
    END AS expiry_type

FROM VehicleDetailsNew

WHERE 
    (
        insurance_upto <= DATEADD(DAY, @days, GETDATE())
        OR fit_upto <= DATEADD(DAY, @days, GETDATE())
        OR tax_paid_upto <= DATEADD(DAY, @days, GETDATE())
        OR permit_valid_upto <= DATEADD(DAY, @days, GETDATE())
        OR pucc_upto <= DATEADD(DAY, @days, GETDATE())
    )
    AND verify_flag = 'Y'
        `;

                // ✅ Vendor filter
                if (vendorid) {
                    query += ` AND vendorid = @vendorid`;
                    request.input("vendorid", sql.NVarChar(50), vendorid);
                }

                return request.query(query);
            })
            .then(result => {

                const alerts = result.recordset.map(row => {

                    let expiryDate = null;

                    switch (row.expiry_type) {
                        case "INSURANCE_EXPIRY":
                            expiryDate = row.insurance_upto;
                            break;
                        case "FITNESS_EXPIRY":
                            expiryDate = row.fit_upto;
                            break;
                        case "TAX_EXPIRY":
                            expiryDate = row.tax_paid_upto;
                            break;
                        case "PERMIT_EXPIRY":
                            expiryDate = row.permit_valid_upto;
                            break;
                        case "PUC_EXPIRY":
                            expiryDate = row.pucc_upto;
                            break;
                    }

                    const diff = expiryDate
                        ? moment(expiryDate).diff(moment(), "days")
                        : null;

                    let status = null;

                    if (diff !== null) {
                        if (diff < 0) status = "EXPIRED";
                        else if (diff <= 3) status = "EXPIRING_SOON";
                        else status = "WARNING";
                    }

                    return {
                        vehicleid: row.vehicleid,
                        vendorid: row.vendorid,
                        registration_no: row.registration_no,
                        expiry_type: row.expiry_type,
                        expiry_date: expiryDate
                            ? moment(expiryDate).format("YYYY-MM-DD")
                            : null,
                        days_left: diff,
                        status
                        
                    };
                });

                console.log("✅ Alerts Found:", alerts.length);

                resolve(alerts);
            })
            .catch(err => {
                reject(`SQL Error: ${err.message}`);
            });
    });
};