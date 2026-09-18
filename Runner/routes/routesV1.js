const express = require('express');
const router = express.Router();


const { auth_vaildation } = require('../../KYC_Verification/controllers/V1/auth_vaildation');
const { Pancard , GST, DrivingLicense, Aadhaargenerateotp, Aadhaarverifyotp, Vehicle} = require('../../KYC_Verification/controllers/V1/KYC_Verification');

const { Driver_send_OTP, Driver_validate_OTP } = require('../controllers/validate.js');
const { Driver_login_Mpin, Driver_Set_Mpin, Driver_Change_Mpin, Driver_Forgot_Mpin } = require('../controllers/V1/Driver_Mpin.js');
const { getPincode, get_state_region_district} = require('../controllers/V1/Master.js');
const { DriverOnboarding, updateDriverDetails, deleteDriverDetails, getDriverDetails} = require('../controllers/V1/Driver_Onboard.js');
const { InsertVehicle, updateVehicle, deleteVehicle, getVehicle} = require('../controllers/V1/vehicles.js');
const { insertOrUpdateDriverLiveLocation, getDriverLiveLocation, Driveronlineofflinestatus } = require("../controllers/V1/DriverLiveLocation.js");
const { Vendor_KYC_Check } =require('../../KYC_Verification/controllers/V1/Check_KYC.js');
const { loadingImage } = require('../controllers/V1/Loading_Image.js');


// KYC verification
router.post('/pancard', auth_vaildation, Pancard);
router.post('/GST', auth_vaildation, GST);
router.post('/DrivingLicense', auth_vaildation, DrivingLicense);
router.post('/Aadhaar_generate_otp', auth_vaildation, Aadhaargenerateotp);
router.post('/Aadhaar_verify_otp', auth_vaildation, Aadhaarverifyotp);
router.post('/Vehicle', auth_vaildation, Vehicle);
router.post('/duplicate_entry_Check', Vendor_KYC_Check);


// Driver Auth
router.post('/Driver_Runner_SendOtp', Driver_send_OTP);
router.post('/Driver_Runner_ValidateOtp', Driver_validate_OTP);

// Mpin APIs
router.post('/Driver_Runner_Login_Mpin', /* otp_validateRequests,*/ Driver_login_Mpin);
router.post('/Driver_Runner_Set_Mpin', Driver_Set_Mpin);
router.post('/Driver_Runner_Change_Mpin',/* Mpin_validateRequests,*/ Driver_Change_Mpin);
router.post('/Driver_Runner_Forgot_Mpin', Driver_Forgot_Mpin);

// Master
router.post("/pincode", getPincode);
router.post("/get_state_region_district", get_state_region_district);

// InsertDriver
router.post('/Driver_Runner_Onboarding', DriverOnboarding);
router.post('/update_Driver_Runner_Details', updateDriverDetails);
router.post('/delete_Driver_Runner_Details', deleteDriverDetails);
router.post('/get_Driver_Runner_Details', getDriverDetails);

// Vehicle
router.post('/Insert_RD_Vehicle',InsertVehicle);
router.post('/update_RD_vehicle', updateVehicle);
router.post('/delete_RD_vehicle', deleteVehicle);
router.post('/get_RD_vehicle', getVehicle);

// insertOrUpdateDriverLiveLocation
router.post('/insertOrUpdate_DriverLiveLocation', insertOrUpdateDriverLiveLocation);
router.post('/get_DriverLiveLocation', getDriverLiveLocation);
router.post('/Driver_online_offline_status', Driveronlineofflinestatus);


router.post('/runner_loading_Image', loadingImage);  


module.exports = router
