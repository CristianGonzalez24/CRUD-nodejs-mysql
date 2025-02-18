export const doctorDocs = {
  "/doctors": {
    get: {
      summary: "Get a paginated list of active doctors",
      description: "Retrieves a list of active doctors with pagination. The limit and page query parameters define the number of doctors returned per page.",
      tags: ["Doctors"],
      parameters: [
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Number of doctors to return per page",
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
          },
          description: "Page number to retrieve",
        },
      ],
      responses: {
        200: {
          description: "List of active doctors retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Active doctors retrieved successfully" },
                  total: { type: "integer", example: 50 },
                  totalPages: { type: "integer", example: 5 },
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 10 },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Doctor",
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid query parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Both 'limit' and 'page' must be positive integers" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Create a new doctor",
      description: "Registers a new doctor in the system. The request body must contain valid doctor data. A doctor cannot be created if the email or phone number already exists in the database.",
      tags: ["Doctors"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Doctor" },
          },
        },
      },
      responses: {
        201: {
          description: "Doctor created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor created successfully" },
                  data: { $ref: "#/components/schemas/Doctor" },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request or doctor already exists",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor object is invalid or missing required fields" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        500: {
          description: "Server error when creating doctor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Failed to create doctor: Unable to generate ID" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          },
        },
      },
    },
  },

  "/doctors/all": {
    get: {
      summary: "Get a paginated list of all doctors",
      description: "Retrieves a list of all doctors (both active and inactive) with pagination. The limit and page query parameters define the number of doctors returned per page.",
      tags: ["Doctors"],
      parameters: [
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Number of doctors to return per page",
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
          },
          description: "Page number to retrieve",
        },
      ],
      responses: {
        200: {
          description: "List of all doctors retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "All doctors retrieved successfully" },
                  total: { type: "integer", example: 100 },
                  totalPages: { type: "integer", example: 10 },
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 10 },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Doctor",
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid query parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Limit and page must be positive integers" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          }
        },
      },
    },
  },

  "/doctors/{id}": {
    put: {
      summary: "Update a doctor's information",
      description: "Updates the details of an existing doctor using their ID. Ensures that the email and phone number are unique among all doctors.",
      tags: ["Doctors"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Doctor's unique identifier",
          schema: { type: "integer", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                first_name: { type: "string", example: "John" },
                last_name: { type: "string", example: "Doe" },
                specialty: { type: "string", example: "Neurology" },
                phone: { type: "string", example: "123-456-7890" },
                email: { type: "string", example: "john.doe@example.com" },
                years_of_experience: { type: "integer", example: 15 },
                is_active: { type: "boolean", example: true },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Doctor updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor updated successfully" },
                  updatedDoctor: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      first_name: { type: "string", example: "John" },
                      last_name: { type: "string", example: "Doe" },
                      specialty: { type: "string", example: "Neurology" },
                      phone: { type: "string", example: "123-456-7890" },
                      email: { type: "string", example: "john.doe@example.com" },
                      years_of_experience: { type: "integer", example: 15 },
                      is_active: { type: "boolean", example: true },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID or duplicate email/phone",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor ID must be a positive integer" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        404: {
          description: "Doctor not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor not found" },
                  status: { type: "integer", example: 404 },
                },
              },
            },
          },
        },
        500: {
          description: "Error updating the doctor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Failed to update the doctor" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Delete a doctor",
      description: "Deletes a doctor from the database using their ID. If the doctor does not exist, it returns a 404 error.",
      tags: ["Doctors"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Doctor's unique identifier",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: {
          description: "Doctor deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor deleted successfully" },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor ID must be a positive integer" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        404: {
          description: "Doctor not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor not found" },
                  status: { type: "integer", example: 404 },
                },
              },
            },
          },
        },
        500: {
          description: "Error deleting the doctor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Failed to delete the doctor" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          },
        },
      },
    },
  },

  "/doctors/{id}/deactivate": {
    patch: {
      summary: "Deactivate a doctor",
      description: "Marks a doctor as inactive instead of deleting them. This is a soft delete operation.",
      tags: ["Doctors"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Doctor's unique identifier",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: {
          description: "Doctor successfully deactivated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor marked as inactive successfully" },
                  doctorId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor ID must be a positive integer" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        404: {
          description: "Doctor not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor not found" },
                  status: { type: "integer", example: 404 },
                },
              },
            },
          },
        },
        500: {
          description: "Error deactivating doctor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Failed to deactivate doctor" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          },
        },
      },
    },
  },

  "/doctors/{id}/activate": {
    patch: {
      summary: "Activate a doctor",
      description: "Reactivates a doctor that was previously marked as inactive.",
      tags: ["Doctors"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Doctor's unique identifier",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: {
          description: "Doctor successfully reactivated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor reactivated successfully" },
                  doctorId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor ID must be a positive integer" },
                  status: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
        404: {
          description: "Doctor not found or already active",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Doctor not found or already active" },
                  status: { type: "integer", example: 404 },
                },
              },
            },
          },
        },
        500: {
          description: "Error activating doctor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Failed to activate doctor" },
                  status: { type: "integer", example: 500 },
                },
              },
            },
          },
        },
      },
    },
  },
};