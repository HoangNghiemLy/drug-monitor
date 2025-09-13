/**
 * Middleware for validating drug input data
 */
const validateDrugData = (req, res, next) => {
    // If no request body, return error
    if (!req.body) {
        return res.status(400).send({ 
            message: "Content cannot be empty!",
            success: false
        });
    }

    const { name, dosage, card, pack, perDay } = req.body;
    const errors = [];

    // Validate name length (more than 5 characters)
    if (!name || name.length <= 5) {
        errors.push("Drug name must be longer than 5 characters");
    }

    // Validate dosage format (XX-morning,XX-afternoon,XX-night) where X is a digit
    if (!dosage) {
        errors.push("Dosage is required");
    } else {
        const dosagePattern = /^\d{2}-morning,\d{2}-afternoon,\d{2}-night$/;
        if (!dosagePattern.test(dosage)) {
            errors.push("Dosage must follow the format: XX-morning,XX-afternoon,XX-night where X is a digit");
        }
    }

    // Validate card (must be more than 0)
    if (!card) {
        errors.push("Card value is required");
    } else {
        const cardValue = Number(card);
        if (isNaN(cardValue) || cardValue <= 0) {
            errors.push("Card value must be more than 0");
        }
    }

    // Validate pack (must be more than 0)
    if (!pack) {
        errors.push("Pack value is required");
    } else {
        const packValue = Number(pack);
        if (isNaN(packValue) || packValue <= 0) {
            errors.push("Pack value must be more than 0");
        }
    }

    // Validate perDay (must be more than 0 and less than 90)
    if (!perDay) {
        errors.push("PerDay value is required");
    } else {
        const perDayValue = Number(perDay);
        if (isNaN(perDayValue) || perDayValue <= 0 || perDayValue >= 90) {
            errors.push("PerDay value must be more than 0 and less than 90");
        }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).send({ 
            message: "Validation error",
            errors: errors,
            success: false
        });
    }

    // If all validations pass, continue to the next middleware/controller
    next();
};

module.exports = {
    validateDrugData
};
