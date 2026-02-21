const captainModel = require("../models/CaptainModel");

const createCaptain = async ({
    firstName, lastName, color, plateNumber, capacity,
    vehicleType, email, password, license, registration, insurance, lat, lng
}) => {
    if (!firstName || !color || !plateNumber || !capacity || !vehicleType || !email || !password || !license || !registration || !insurance) {
        throw new Error("All fields are required");
    }
    const hashedPassword = await captainModel.hashPassword(password);
    const newCaptain = await captainModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password: hashedPassword,
        vehicle: {
            color,
            plateNumber,
            capacity,
            vehicleType
        },
        documents: {
            license,
            registration,
            insurance
        },
        ...(lat && lng ? { location: { lat, lng } } : {})
    });
    return newCaptain;
};
module.exports = { createCaptain };