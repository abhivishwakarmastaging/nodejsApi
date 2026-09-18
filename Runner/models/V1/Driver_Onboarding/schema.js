const InsertDriver_schema = () => ({
    type: 'object',

    properties: {

        vendorid: { type: 'string', maxLength: 50 },
        full_name: { type: 'string', maxLength: 100 },
        nick_name: { type: 'string', maxLength: 100, nullable: true },
        contact_no: { type: 'string', maxLength: 15 },
        email_id: { type: 'string', format: 'email', maxLength: 100, nullable: true },

        license_front: { type: 'string', nullable: true },
        license_back: { type: 'string', nullable: true },
        aadhar_front: { type: 'string', nullable: true },
        aadhar_back: { type: 'string', nullable: true },

        building: { type: 'string', maxLength: 255, nullable: true },
        area: { type: 'string', maxLength: 255 },
        district: { type: 'string', maxLength: 255, nullable: true },
        tahsil: { type: 'string', maxLength: 255, nullable: true },
        city: { type: 'string', maxLength: 255 },
        state: { type: 'string', maxLength: 255 },
        pincode: { type: 'string', maxLength: 10 },
        vehicle_preference: { type: 'string', maxLength: 50, nullable: true },

        driving_license_flag: {
            type: 'string',
            enum: ['Y', 'N']
        },

        driving_license_no: {
            type: 'string',
            maxLength: 100,
            nullable: true
        },

        DOB: {
            type: 'string',
            nullable: true
        },

        aadhar_no: {
            type: 'string',
            maxLength: 100,
            nullable: true
        },

        referred_person_name: { type: 'string', maxLength: 100, nullable: true },
        referred_person_no: { type: 'string', maxLength: 15, nullable: true },
        relation: { type: 'string', maxLength: 50, nullable: true },
        onboarded_by: { type: 'string', maxLength: 255, nullable: true },

        relatives_name: { type: 'string', maxLength: 100, nullable: true },
        address: { type: 'string', maxLength: 255, nullable: true },
        issuing_rto_name: { type: 'string', maxLength: 50, nullable: true },
        date_of_issue: { type: 'string', nullable: true },
        nt_validity_from: { type: 'string', nullable: true },
        nt_validity_to: { type: 'string', nullable: true },
        t_validity_from: { type: 'string', nullable: true },
        t_validity_to: { type: 'string', nullable: true },
        status: { type: 'string', maxLength: 50, nullable: true },
        source: { type: 'string', maxLength: 100, nullable: true }
    },

    required: [
        'contact_no',
        'full_name',
        'driving_license_flag'
    ],

    if: {
        properties: {
            driving_license_flag: {
                const: 'Y'
            }
        }
    },

    then: {
        required: [
            'driving_license_no',
            'DOB',
            'license_front',
            'license_back'
        ]
    },

    additionalProperties: false
});

module.exports = {
    InsertDriver_schema
};