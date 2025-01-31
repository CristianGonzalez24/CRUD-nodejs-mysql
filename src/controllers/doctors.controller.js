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

    const doctorId = await createDoctorInDB(doctor);
      if (!doctorId) {
          return next({
              message: "Failed to create doctor: Unable to generate ID",
              status: 500,
          });
      }

    const newDoctor = await getDoctorById(doctorId);
      if (!newDoctor) {
          return next({
              message: "Failed to retrieve the newly created doctor from the database",
              status: 500,
          });
      }

    res.status(201).json({
      message: "Doctor created successfully",
      data: newDoctor,
  });
  } catch (error) {
    next(error);
  }
};

export const deactivateDoctor = async (req, res, next) => {
  try {
      const { id } = req.params;

      if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
          return next({
              message: "Doctor ID must be a positive integer",
              status: 400,
          });
      }

      const existingDoctor = await getDoctorById(id);
      if (!existingDoctor) {
          return next({
              message: "Doctor not found",
              status: 404,
          });
      }

      const success = await deactivateDoctorById(id);
      if (!success || success.affectedRows === 0) {
          return next({
              message: "Failed to deactivate doctor",
              status: 500,
          });
      }

      res.status(200).json({
          message: "Doctor marked as inactive successfully",
          doctorId: id,
      });
  } catch (error) {
      next(error);
  }
};

export const activateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
      return next({
        message: "Doctor ID must be a positive integer",
        status: 400,
      });
    }

    const existingDoctor = await getDoctorById(id);
    if (!existingDoctor) {
      return next({
        message: "Doctor not found",
        status: 404,
      });
    }

    const result = await activateDoctorById(id);

    if (!result || result.affectedRows === 0) {
      return next({
        message: "Doctor not found or already active",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Doctor reactivated successfully",
      doctorId: id,
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

    console.log("updateDoctor req.body:", req.body);

    if (!id || isNaN(id) || parseInt(id, 10) <= 0) {
      return next({
        message: "Doctor ID must be a positive integer",
        status: 400,
      });
    }

    const existingDoctor = await getDoctorById(id);
    if (!existingDoctor) {
      console.log("updateDoctor: doctor not found");
      return next({
        message: "Doctor not found",
        status: 404,
      });
    }

    if (email || phone) {
      const hasDuplicate = await checkDuplicateDoctor(email, phone, id);
      if (hasDuplicate) {
        console.log("updateDoctor: duplicate doctor found");
        return next({
          message: "Email or phone number already in use by another doctor",
          status: 400,
        });
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

    if (!result || result.affectedRows === 0) {
      console.log("updateDoctor: failed to update doctor");
      return next({
        message: "Failed to update the doctor",
        status: 500,
      });
    }

    console.log("updateDoctor: doctor updated successfully");
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
    console.log("updateDoctor error:", error);
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