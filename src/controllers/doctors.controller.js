import {
  getActiveDoctors, 
  countActiveDoctors, 
  getAllDoctorsFromDB, 
  countAllDoctors,
  findDoctorByEmailOrPhone,
  createDoctorInDB,
  getDoctorById,
  deactivateDoctorById,
  activateDoctorById,
  checkDuplicateDoctor,
  updateDoctorById,
  deleteDoctorById
} from '../models/doctor.model.js';

export const getDoctors = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;

  const validLimit = parseInt(limit, 10);
  const validPage = parseInt(page, 10);

  if (!Number.isInteger(validLimit) || validLimit <= 0 || 
      !Number.isInteger(validPage) || validPage <= 0) {
    return next({
      message: "Both 'limit' and 'page' must be positive integers",
      status: 400,
    });
  }

  try {
    const [doctors, totalDoctors] = await Promise.all([
      getActiveDoctors(validLimit, (validPage - 1) * validLimit),
      countActiveDoctors(),
    ]);

    res.status(200).json({
      message: "Active doctors retrieved successfully",
      total: totalDoctors,
      totalPages: Math.ceil(totalDoctors / validLimit),
      data: doctors,
      page: validPage,
      limit: validLimit,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;

  const validPage = parseInt(page, 10);
  const validLimit = parseInt(limit, 10);

  if (isNaN(validPage) || isNaN(validLimit) || validPage <= 0 || validLimit <= 0) {
    return next({
      message: "Limit and page must be positive integers",
      status: 400,
    });
  }

  try {
    const [doctors, totalDoctors] = await Promise.all([
      getAllDoctorsFromDB(validLimit, (validPage - 1) * validLimit),
      countAllDoctors(),
    ]);

    res.status(200).json({
      message: "All doctors retrieved successfully",
      total: totalDoctors,
      totalPages: Math.ceil(totalDoctors / validLimit),
      data: doctors,
      page: validPage,
      limit: validLimit,
    });
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {

  const doctor = req.validData;

  if (!doctor) {
      return next({
          message: "Doctor object is invalid or missing required fields",
          status: 400,
      });
  }

  try {
    const existingDoctor = await findDoctorByEmailOrPhone(doctor.email, doctor.phone);
      if (existingDoctor.length > 0) {
          return next({
              message: "Doctor with this email or phone already exists",
              status: 400,
          });
      }
    console.log('Existing doctor:', existingDoctor);

    const doctorId = await createDoctorInDB(doctor);
      if (!doctorId) {
          return next({
              message: "Failed to create doctor: Unable to generate ID",
              status: 500,
          });
      }
    console.log('Doctor ID:', doctorId); 

    const newDoctor = await getDoctorById(doctorId);
      if (!newDoctor) {
          return next({
              message: "Failed to retrieve the newly created doctor from the database",
              status: 500,
          });
      }
    console.log('New doctor data:', newDoctor); 

    res.status(201).json({
      message: "Doctor created successfully",
      data: newDoctor,
  });
  } catch (error) {
    console.error('Error occurred while creating doctor:', error);
    next(error);
  }
};

export const deactivateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deactivateDoctorById(id);

    if (result.affectedRows === 0) {
      const error = new Error(
        "Doctor not found or already inactive"
      );
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Doctor marked as inactive successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const activateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await activateDoctorById(id);

    if (result.affectedRows === 0) {
      const error = new Error(
        "Doctor not found or already active"
      );
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Doctor reactivated successfully",
    });
  } catch (error) {
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

    const existingDoctor = await getDoctorById(id);
    if (!existingDoctor) {
      const error = new Error("Doctor not found");
      error.status = 404;
      throw error;
    }

    if (email || phone) {
      const hasDuplicate = await checkDuplicateDoctor(email, phone, id);
      if (hasDuplicate) {
        const error = new Error(
          "Email or phone number already in use by another doctor"
        );
        error.status = 400;
        throw error;
      }
    }

    const result = await updateDoctorById(id, {
      first_name,
      last_name,
      specialty,
      phone,
      email,
      years_of_experience,
      is_active,
    });

    if (result.affectedRows === 0) {
      const error = new Error("Failed to update the doctor");
      error.status = 500;
      throw error;
    }

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
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingDoctor = await getDoctorById(id);
    if (!existingDoctor) {
      const error = new Error("Doctor not found");
      error.status = 404;
      throw error;
    }

    const result = await deleteDoctorById(id);

    if (result.affectedRows === 0) {
      const error = new Error("Failed to delete the doctor");
      error.status = 500;
      throw error;
    }

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};