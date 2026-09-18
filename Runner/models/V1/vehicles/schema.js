const InserVehicle_schema = () => ({
    type: "object",

    properties: {
        driverid: { type: "string", maxLength: 50 },

        vehicle_certificate_front: { type: "string" },
        vehicle_certificate_back: { type: "string" },

        registrationNo: { type: "string" },
        registration_date: { type: "string" },
        registered_at: { type: "string" },
        rc_status: { type: "string" },

        rc_owner_name: { type: "string" },
        rc_mobile_number: { type: "string" },

        owner_name: { type: "string" },
        father_name: { type: "string" },
        present_address: { type: "string" },
        permanent_address: { type: "string" },
        mobile_number: { type: "string" },

        vehicle_category: { type: "string" },
        vehicle_category_description: { type: "string" },

        maker_description: { type: "string" },
        maker_model: { type: "string" },

        body_type: { type: "string" },
        fuel_type: { type: "string" },

        manufacturing_date: { type: "string" },

        vehicle_chasi_number: { type: "string" },
        vehicle_engine_number: { type: "string" },

        cubic_capacity: { type: "string" },
        vehicle_gross_weight: { type: "string" },
        unladen_weight: { type: "string" },

        no_cylinders: { type: "string" },
        seat_capacity: { type: "string" },

        fit_up_to: { type: "string", format: "date" },
        insurance_upto: { type: "string", format: "date" },
        tax_upto: { type: "string", format: "date" },
        tax_paid_upto: { type: "string", format: "date" },

        pucc_number: { type: "string" },
        pucc_upto: { type: "string", format: "date" },

        permit_number: { type: "string" },
        permit_type: { type: "string" },
        permit_valid_from: { type: "string", format: "date" },
        permit_valid_upto: { type: "string", format: "date" },

        loadingCapacityGVW: { type: "number" },
        emptyVehicleWeight: { type: "number" },
        cubicCapacity: { type: "number" },

        vehicleType: { type: "string" },
        vehicleCategory: { type: "string" },

        topRemovable: { type: "boolean" },

        height: { type: "string" },
        length: { type: "string" },
        width: { type: "string" },

        vehicleOwnershipType: {
            type: "string",
            enum: ["OWN", "OTHER"]
        },

        VehicleOwnership_name: {
            type: "string"
        },

        VehicleOwnership_mobile_number: {
            type: "string"
        }
    },

    required: [
        "driverid",
        "registrationNo",
        "vehicleOwnershipType"
    ],

    allOf: [
        {
            if: {
                properties: {
                    vehicleOwnershipType: {
                        const: "OTHER"
                    }
                }
            },
            then: {
                required: [
                    "VehicleOwnership_name",
                    "VehicleOwnership_mobile_number"
                ]
            }
        }
    ],

    additionalProperties: false
});

module.exports = { InserVehicle_schema };