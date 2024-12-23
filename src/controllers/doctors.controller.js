import {
  getActiveDoctors, 
  countActiveDoctors, 
  getAllDoctors, 
  countAllDoctors,
  findDoctorByEmailOrPhone,
  createDoctor,
  getDoctorById,
  deactivateDoctorById,
  activateDoctorById,
  checkDuplicateDoctor,
  updateDoctorById,
  deleteDoctorById
} from '../models/doctor.model.js';

export const getDoctors = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const doctors = await getActiveDoctors(parseInt(limit), parseInt(offset));
        const totalDoctors = await countActiveDoctors();

        res.json({
            message: 'Active doctors retrieved successfully',
            total: totalDoctors,
            data: doctors,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        next(error);
    }
};

export const getAllDoctors = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const doctors = await getAllDoctors(parseInt(limit), parseInt(offset));
        const totalDoctors = await countAllDoctors();

        res.json({
            message: 'All doctors retrieved successfully',
            total: totalDoctors,
            data: doctors,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        next(error);
    }
};

export const createDoctor = async (req, res, next) => {
    try {
        const doctor = req.validData;

        const existingDoctor = await findDoctorByEmailOrPhone(doctor.email,doctor.phone);

        if (existingDoctor.length > 0) {
          const error = new Error(
            "Doctor with this email or phone already exists"
          );
          error.status = 400;
          throw error;
        }

        const doctorId = await createDoctor(doctor);
        const newDoctor = await getDoctorById(doctorId);

        res.status(200).json({
            message: 'Doctor created successfully',
            doctor: newDoctor,
        });
    } catch (error) {
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