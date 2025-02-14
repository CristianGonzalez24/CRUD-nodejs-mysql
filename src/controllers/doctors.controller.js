import * as dm from '../models/doctor.model.js';
import logger from '../config/logger.js';

export const getDoctors = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;

  const validLimit = parseInt(limit, 10);
  const validPage = parseInt(page, 10);

  if (!Number.isInteger(validLimit) || validLimit <= 0 || !Number.isInteger(validPage) || validPage <= 0) {
    logger.warn(`Invalid parameters: limit=${limit}, page=${page}`);
    return next({
      message: "Both 'limit' and 'page' must be positive integers",
      status: 400,
    });
  }

  try {
    const [doctors, totalDoctors] = await Promise.all([
      dm.getActiveDoctors(validLimit, (validPage - 1) * validLimit),
      dm.countActiveDoctors(),
    ]);

    logger.info(`Retrieved ${doctors.length} active doctors (page ${validPage}, limit ${validLimit}).`);

    res.status(200).json({
      message: "Active doctors retrieved successfully",
      total: totalDoctors,
      totalPages: Math.ceil(totalDoctors / validLimit),
      data: doctors,
      page: validPage,
      limit: validLimit,
    });
  } catch (error) {
    logger.error(`Error retrieving active doctors: ${error.message}`);
    next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;

  const validPage = parseInt(page, 10);
  const validLimit = parseInt(limit, 10);

  if (isNaN(validPage) || isNaN(validLimit) || validPage <= 0 || validLimit <= 0) {
    logger.warn(`Invalid parameters: limit=${limit}, page=${page}`);
    return next({
      message: "Limit and page must be positive integers",
      status: 400,
    });
  }

  try {
    const [doctors, totalDoctors] = await Promise.all([
      dm.getAllDoctorsFromDB(validLimit, (validPage - 1) * validLimit),
      dm.countAllDoctors(),
    ]);

    logger.info(`Retrieved ${doctors.length} doctors (page ${validPage}, limit ${validLimit}).`);

    res.status(200).json({
      message: "All doctors retrieved successfully",
      total: totalDoctors,
      totalPages: Math.ceil(totalDoctors / validLimit),
      data: doctors,
      page: validPage,
      limit: validLimit,
    });
  } catch (error) {
    logger.error(`Error retrieving all doctors: ${error.message}`);
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  const doctor = req.validData;

  if (!doctor) {
    logger.warn("Doctor object is invalid or missing required fields.");
    return next({
        message: "Doctor object is invalid or missing required fields",
        status: 400,
    });
  }

  try {
    const existingDoctor = await dm.findDoctorByEmailOrPhone(doctor.email, doctor.phone);
      if (existingDoctor.length > 0) {
        logger.warn(`Doctor with email ${doctor.email} or phone ${doctor.phone} already exists.`);
        return next({
            message: "Doctor with this email or phone already exists",
            status: 400,
        });
      }

    const doctorId = await dm.createDoctorInDB(doctor);
      if (!doctorId) {
        logger.error("Failed to create doctor: Unable to generate ID.");
        return next({
            message: "Failed to create doctor: Unable to generate ID",
            status: 500,
        });
      }

    const newDoctor = await dm.getDoctorById(doctorId);
      if (!newDoctor) {
        logger.error(`Failed to retrieve doctor with ID ${doctorId} from the database.`);
        return next({
            message: "Failed to retrieve the newly created doctor from the database",
            status: 500,
        });
      }

    logger.info(`Doctor created successfully with ID ${doctorId}.`);

    res.status(201).json({
      message: "Doctor created successfully",
      data: newDoctor,
  });
  } catch (error) {
    logger.error(`Error creating doctor: ${error.message}`);
    next(error);
  }
};

export const deactivateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
      logger.warn(`Invalid doctor ID: ${id}`);
      return next({
        message: "Doctor ID must be a positive integer",
        status: 400,
      });
    }

    const existingDoctor = await dm.getDoctorById(id);
    if (!existingDoctor) {
      logger.warn(`Doctor with ID ${id} not found.`);
      return next({
        message: "Doctor not found",
        status: 404,
      });
    }

    const success = await dm.deactivateDoctorById(id);
    if (!success || success.affectedRows === 0) {
      logger.error(`Failed to deactivate doctor with ID ${id}.`);
      return next({
        message: "Failed to deactivate doctor",
        status: 500,
      });
    }

    logger.info(`Doctor with ID ${id} marked as inactive successfully.`);

    res.status(200).json({
      message: "Doctor marked as inactive successfully",
      doctorId: id,
    });
  } catch (error) {
    logger.error(`Error deactivating doctor: ${error.message}`);
    next(error);
  }
};

export const activateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
      logger.warn(`Invalid doctor ID: ${id}`);
      return next({
        message: "Doctor ID must be a positive integer",
        status: 400,
      });
    }

    const existingDoctor = await dm.getDoctorById(id);
    if (!existingDoctor) {
      logger.warn(`Doctor with ID ${id} not found.`);
      return next({
        message: "Doctor not found",
        status: 404,
      });
    }

    const result = await dm.activateDoctorById(id);

    if (!result || result.affectedRows === 0) {
      logger.warn(`Doctor with ID ${id} not found or already active.`);
      return next({
        message: "Doctor not found or already active",
        status: 404,
      });
    }

    logger.info(`Doctor with ID ${id} reactivated successfully.`);

    res.status(200).json({
      message: "Doctor reactivated successfully",
      doctorId: id,
    });
  } catch (error) {
    logger.error(`Error activating doctor: ${error.message}`);
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      specialty,
      phone,
      email,
      years_of_experience,
      is_active,
    } = req.body;

    if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
      logger.warn(`Invalid doctor ID: ${id}`);
      return next({
        message: "Doctor ID must be a positive integer",
        status: 400,
      });
    }

    const existingDoctor = await dm.getDoctorById(id);
    if (!existingDoctor) {
      logger.warn(`Doctor with ID ${id} not found.`);
      return next({
        message: "Doctor not found",
        status: 404,
      });
    }

    if (email || phone) {
      const hasDuplicate = await dm.checkDuplicateDoctor(email, phone, id);
      if (hasDuplicate) {
        logger.warn(`Email or phone number already in use by another doctor. ID: ${id}`);
        return next({
          message: "Email or phone number already in use by another doctor",
          status: 400,
        });
      }
    }

    const result = await dm.updateDoctorById(id, {
      first_name,
      last_name,
      specialty,
      phone,
      email,
      years_of_experience,
      is_active,
    });

    if (!result || result.affectedRows === 0) {
      logger.error(`Failed to update doctor with ID ${id}.`);
      return next({
        message: "Failed to update the doctor",
        status: 500,
      });
    }

    logger.info(`Doctor with ID ${id} updated successfully.`);

    res.status(200).json({
      message: "Doctor updated successfully",
      updatedDoctor: {
        id,
        first_name,
        last_name,
        specialty,
        phone,
        email,
        years_of_experience,
        is_active,
      },
    });
  } catch (error) {
    logger.error(`Failed to update doctor. Error: ${error.message}`);
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
      logger.warn(`Invalid doctor ID: ${id}`);
      return next({
        message: "Doctor ID must be a positive integer",
        status: 400,
      });
    }

    const existingDoctor = await dm.getDoctorById(id);
    if (!existingDoctor) {
      logger.warn(`Doctor with ID ${id} not found.`);
      return next({
        message: "Doctor not found",
        status: 404,
      });
    }

    const result = await dm.deleteDoctorById(id);
    if (!result) {
      logger.error(`Failed to delete doctor with ID ${id}.`);
      return next({
        message: "Failed to delete the doctor",
        status: 500,
      });
    }

    logger.info(`Doctor with ID ${id} deleted successfully.`);

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    logger.error(`Failed to delete doctor. Error: ${error.message}`);
    next(error);
  }
};
