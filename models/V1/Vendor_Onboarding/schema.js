const VendorOnboarding_schema = () => ({
    type: "object",
    required: ["VendorDetails"],

    properties: {

        // -----------------------------------------
        // 🏢 Vendor Details
        // -----------------------------------------
        VendorDetails: {
            type: "object",
            required: ["companyName", "mobileNo"],

            properties: {
                companyType: { type: "string", minLength: 2 },
                companyName: { type: "string", minLength: 2 },
                owner_name: { type: "string", minLength: 2 },

                mobileNo: {
                    type: "string",
                    pattern: "^[0-9]{10}$"
                },

                Building: { type: "string" },
                Area: { type: "string" },
                landMark: { type: "string" },

                pincode: {
                    type: "string",
                    pattern: "^[0-9]{6}$"
                },

                state: { type: "string" },
                district: { type: "string" },
                Tahsil: { type: "string" },
                City: { type: "string" }
            },

            additionalProperties: false   // ✅ FIX 1
        },

        // -----------------------------------------
        // 🚛 Vehicle Details (Array)
        // -----------------------------------------
        VehicleDetails: {
            type: "array",
            minItems: 1,

            items: {
                type: "object",
                required: ["vehicle_number"],

                properties: {
                    vehicle_number: {
                        type: "string",
                        minLength: 5
                    },
                    vehicle_weight: {
                        type: "string"
                    }
                },

                additionalProperties: false   // ✅ FIX 2
            }
        },

        // -----------------------------------------
        // 📄 KYC Details
        // -----------------------------------------
        kycDetails: {
            type: "object",

            properties: {
                gstNo: {
                    anyOf: [
                        { type: "string", pattern: "^[0-9A-Z]{15}$" },
                        { type: "string", maxLength: 0 },
                        { type: "null" }
                    ]
                },

                cinNo: {
                    anyOf: [
                        { type: "string", minLength: 5 },
                        { type: "string", maxLength: 0 },
                        { type: "null" }
                    ]
                },

                panNo: {
                    type: "string",
                    pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                },

                aadharNo: {
                    anyOf: [
                        { type: "string", pattern: "^[0-9]{12}$" },
                        { type: "string", maxLength: 0 },
                        { type: "null" }
                    ]
                }
            },

            additionalProperties: false
        }
    },

    additionalProperties: false
});

module.exports = { VendorOnboarding_schema };