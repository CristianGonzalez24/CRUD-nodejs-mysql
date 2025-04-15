export const authDocs = {
    '/register': {
        post: {
            tags: ['Auth'],
            summary: 'Register a new user',
            description: 'Creates a new user with the role "user" or "admin".',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['username', 'email', 'password'],
                            properties: {
                                username: {
                                    type: 'string',
                                    example: 'john',
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'johndoe@example.com',
                                },
                                password: {
                                    type: 'string',
                                    example: 'Password123!',
                                },
                                role: {
                                    type: 'string',
                                    example: 'user',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { 
                    description: 'User created successfully', 
                    content: { 
                        'application/json': { 
                            schema: { 
                                type: 'object', 
                                properties: { 
                                    message: { type: 'string', example: 'User created successfully' }, 
                                    data: { $ref: '#/components/schemas/User' }, 
                                }, 
                            }, 
                        }, 
                    }, 
                }, 
                400: { 
                    description: 'Username or email already taken', 
                    content: {
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/ValidationError' },
                            example: {
                                message: 'Username or email already taken',
                                status: 400,
                                details: {
                                    username: true,
                                    email: true,
                                },
                            },
                        }, 
                    },
                }, 
                500: {  
                    description: 'User registration failed', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'User registration failed', 
                                status: 500
                            }
                        }, 
                    }, 
                }, 
            }, 
        },
    },

    '/login': {
        post: {
            tags: ['Auth'],
            summary: 'Login a registered user',
            description: 'Logs in a user by validating email and password. Sets an HTTP-only cookie with a JWT token on success.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', example: 'test@example.com' },
                                password: { type: 'string', example: 'yourPassword123' }
                            },
                            required: ['email', 'password']
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'Login successful' }
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Invalid credentials (email or password incorrect)',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Invalid email or password', 
                                status: 401
                            }
                        },
                    },
                },
                403: {
                    description: 'User account is inactive',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' },
                            example: {
                                message: 'Account is inactive. Contact support.', 
                                status: 403
                            }
                        },
                    },
                },
                500: { 
                    description: 'Internal server error', 
                    content: {  
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: { 
                                message: 'Internal server error', 
                                status: 500
                            }, 
                        }, 
                    }, 
                }, 
            },
        },
    },

    '/logout': {
        post: {
            tags: ['Auth'],
            summary: 'Logout the user',
            description: 'Logs out the authenticated user by clearing the session cookie.',
            responses: {
                200: {
                    description: 'Logout successful',
                    content: {
                        'application/json': {
                            example: {
                                message: 'Logout successful',
                            },
                        },
                    },
                },
                500: { 
                    description: 'Internal server error', 
                    content: {  
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: { 
                                message: 'Internal server error', 
                                status: 500
                            }, 
                        }, 
                    }, 
                }, 
            },
        },
    },

    '/admin/register': {
        post: { 
            tags: ['Auth'], 
            summary: 'Register a new admin user', 
            description: 'Registers a new admin user in the database', 
            security: [ { bearerAuth: [] } ],
            requestBody: {
                required: true,
            },
            content : { 
                'application/json': { 
                    schema: { 
                        type: 'object', 
                        required : ['username', 'email', 'password', 'role'],
                        properties: { 
                            username: { type: 'string', example: 'admin' }, 
                            email: { type: 'string', format: 'email', example: 'johndoe@example.com' }, 
                            password: { type: 'string', example: 'Admin123!' }, 
                            role: { type: 'string', example: 'admin' }, 
                        },  
                    }, 
                }, 
            }, 
            
            responses: { 
                201: { 
                    description: 'User registered successfully', 
                    content: {
                        'application/json': { 
                            schema: { 
                                type: 'object', 
                                properties: { 
                                    message: { type: 'string', example: 'User registered successfully' }, 
                                    data: { $ref: '#/components/schemas/User' },
                                }, 
                            }, 
                        }, 
                    }, 
                }, 
                400: {
                    description: 'Username or email already taken',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ValidationError' },
                            example: {
                                message: 'Username or email already taken',
                                status: 400,
                                details: {
                                    username: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            }, 
                        }, 
                    }, 
                },
                401: {
                    description: 'Unauthorized: No user data', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No user data', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },  
                        },
                    },
                },
                403: { 
                    description: 'Access denied. Admins only', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: {
                                message: 'Access denied. Admins only', 
                                status: 403
                            }, 
                        },
                    },
                },
                500: { 
                    description: 'User registration failed', 
                    content: {
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'User registration failed', 
                                status: 500
                            },
                        },
                    }, 
                }, 
            }, 
        },
    }, 

    '/users/{id}': {
        delete: { 
            tags: ['Users'],
            summary: 'Delete a user by ID',
            description: 'Deletes a user from the database using their ID. Only accessible by admin users.',
            security: [ { bearerAuth: [] } ],
            parameters: [ 
                {
                    name: 'id', 
                    in: 'path', 
                    required: true, 
                    description: 'User ID', 
                    schema: { type: 'integer', example: 1 },
                }
            ],
            responses: {
                200: { 
                    description: 'User deleted successfully', 
                    content: { 
                        'application/json': { 
                            schema: { 
                                type: 'object', 
                                properties: { 
                                    message: { type: 'string', example: 'User deleted successfully' },
                                }, 
                            }, 
                        }, 
                    }, 
                },
                400: { 
                    description: 'Invalid ID format', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Invalid ID format', 
                                status: 400
                            },
                        }, 
                    }, 
                },
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                401: {
                    description: 'Unauthorized: No user data', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No user data', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },
                        },
                    },
                },
                403: { 
                    description: 'Access denied. Admins only', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: {
                                message: 'Access denied. Admins only', 
                                status: 403
                            },
                        },
                    },
                },
                404: { 
                    description: 'User not found', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'User not found', 
                                status: 404
                            },
                        }, 
                    }, 
                }, 
                500: { 
                    description: 'Error deleting the user', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Error deleting the user', 
                                status: 500
                            },
                        }, 
                    }, 
                },
            },
        },

        patch: {
            tags: ['Users'],
            summary: 'Update a user by ID',
            description: 'Allows a user to update their personal data (username or email). Only the user themselves can access this route.',
            security: [ { bearerAuth: [] } ],
            parameters: [ 
                {
                    name: 'id', 
                    in: 'path', 
                    required: true, 
                    description: 'ID of the user to update', 
                    schema: { type: 'integer', example: 1 },
                }
            ],
            requestBody: { 
                required: true,
                content: {
                    'application/json': {
                        schema: { 
                            type: 'object',
                            properties: {
                                username: { type: 'string', example: 'newusername' },
                                email: { type: 'string', example: 'newemail@example' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'User updated successfully' }
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ZodValidationError' },
                            example: {
                                error: {
                                    message: 'Validation error',
                                    status: 400,
                                    details: [
                                        {
                                            code: 'invalid_type',
                                            expected: 'string',
                                            received: 'undefined',
                                            path: ['username'],
                                            message: 'Username is required'
                                        }
                                    ]
                                },
                            },
                        },
                    },
                },
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },
                        },
                    },
                },
                403: {
                    description: 'User Id mismatch',
                    content: {
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Unauthorized: User ID mismatch', 
                                status: 403
                            }, 
                        },
                    },
                },
                500: { 
                    description: 'Error deleting the user', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Error deleting the user', 
                                status: 500
                            },
                        }, 
                    }, 
                },
            },
        },	
    },

    '/me': {
        get: { 
            tags: ['Auth'], 
            summary: 'Get the authenticated user profile', 
            description: 'Retrieves the profile details of the authenticated user.', 
            security: [ { bearerAuth: [] } ], 
            responses: {
                200: { 
                    description: 'User profile retrieved successfully', 
                    content: { 
                        'application/json': { 
                            schema: { 
                                $ref: '#/components/schemas/User', 
                            }, 
                        }, 
                    }, 
                }, 
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },  
                        },
                    },
                },
                404: { 
                    description: 'User not found', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'User not found', 
                                status: 404
                            },
                        }, 
                    }, 
                },
                500: { 
                    description: 'Internal server error', 
                    content: {  
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: { 
                                message: 'Internal server error', 
                                status: 500
                            }, 
                        }, 
                    }, 
                }, 
            },
        },
    },

    '/users': {
        get: {
            tags: ['Users'],
            summary: 'Get all users',
            description: 'Retrieves a list of all users.',
            security: [{ bearerAuth: [] }],
            responses: { 
                200: { 
                    description: 'Users retrieved successfully', 
                    content: { 
                        'application/json': { 
                            schema: { 
                                type: 'array',
                                items: { $ref: '#/components/schemas/User' }, 
                            }, 
                        }, 
                    }, 
                }, 
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            }, 
                        }, 
                    }, 
                },
                401: {
                    description: 'Unauthorized: No user data', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No user data', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },  
                        },
                    },
                },
                403: { 
                    description: 'Access denied. Admins only', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: {
                                message: 'Access denied. Admins only', 
                                status: 403
                            }, 
                        },
                    },
                },
                404: {
                    description: 'No users found', 
                    content: {
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: { 
                                message: 'No users found', 
                                status: 404
                            },
                        },
                    },
                },
                500: { 
                    description: 'Internal server error', 
                    content: {  
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: { 
                                message: 'Internal server error', 
                                status: 500
                            }, 
                        }, 
                    }, 
                }, 
            },
        },
    },
    
    '/users/{id}/activate': {
        patch: {
            tags: ['Users'],
            summary: 'Activate or deactivate a user',
            description: 'Activates or deactivates a user by ID. Only accessible by admin users.',
            security: [{ bearerAuth: [] }], 
            parameters: [
                { 
                    name: 'id', 
                    in: 'path', 
                    required: true, 
                    description: 'ID of the user to activate or deactivate', 
                    schema: { type: 'integer', example: 1 }, 
                }
            ],
            requestBody: { 
                required: true, 
                content: { 
                    'application/json': { 
                        schema: { $ref: '#/components/schemas/toggleUserSchema' },  
                        example: { 
                            is_active: false
                        },
                    }, 
                }, 
            },
            responses: {
                200: {
                    description: 'Status changed successfully', 
                    content: { 
                        'application/json': { 
                            schema: {
                                type: 'object', 
                                properties: { 
                                    message: { type: 'string', example: 'Status changed successfully' }, 
                                },
                            }, 
                        }, 
                    },
                },
                400: {
                    description: 'Request body is empty',
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/ZodValidationError' },
                            example: { 
                                message: 'Request body is empty', 
                                status: 400 
                            }, 
                        }, 
                    },
                },
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            }, 
                        }, 
                    }, 
                },
                401: {
                    description: 'Unauthorized: No user data', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No user data', 
                                status: 401
                            },
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },  
                        },
                    },
                },
                403: { 
                    description: 'Access denied. Admins only', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: {
                                message: 'Access denied. Admins only', 
                                status: 403
                            }, 
                        },
                    },
                },
                404: {
                    description: 'User not found', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'User not found', 
                                status: 404
                            },
                        }, 
                    },
                },
                500: { 
                    description: 'Internal server error', 
                    content: {  
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' },
                            example: { 
                                message: 'Internal server error', 
                                status: 500
                            }, 
                        }, 
                    }, 
                }, 
            },
        },
    },

    '/users/{id}/password': { 
        patch: {
            tags: ['Users'],
            summary: 'Update user password',
            description: 'Allows an authenticated user to change their password. Only the user can change their own password.',
            security: [{ bearerAuth: [] }], 
            parameters: [
                { 
                    name: 'id', 
                    in: 'path', 
                    required: true,     
                    description: 'User ID', 
                    schema: { type: 'integer', example: 1 }, 
                }
            ],
            requestBody: { 
                required: true, 
                content: { 
                    'application/json': { 
                        schema: {
                            type: 'object',
                                properties: {
                                    current_password: {
                                        type: 'string',
                                        example: 'OldPassword123!'
                                    },
                                    new_password: {
                                        type: 'string',
                                        example: 'NewPassword456@'
                                    }
                                },
                                required: ['current_password', 'new_password'] 
                        }, 
                    }, 
                }, 
            },
            responses: {
                200: {
                    description: 'Password updated successfully',
                    content: { 
                        'application/json': { 
                            schema: { 
                                type: 'object', 
                                properties: { 
                                    message: { type: 'string', example: 'Password updated successfully' }, 
                                }, 
                            }, 
                        }, 
                    }, 
                },
                400: {
                    description: 'Validation error or new password matches the current one',
                    content: { 
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ZodValidationError' }, 
                            example: {
                                ValidationError: {
                                    summary: 'Missing or invalid fields',
                                    value: {
                                        error: {
                                            message: 'Validation error',
                                            status: 400,
                                            details: [
                                                {
                                                    code: 'invalid_type',
                                                    expected: 'string',
                                                    received: 'undefined',
                                                    path: ['current_password'],
                                                    message: 'Password is required'
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'New password is the same as the current password',
                    content: { 
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'New password cannot be the same as the current password',
                                status: 400
                            },
                        },
                    },
                },
                401: {
                    description: 'Incorrect current password',
                    content: { 
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Incorrect current password', 
                                status: 401
                            }, 
                        },
                    },
                },
                401: { 
                    description: 'Unauthorized: No token provided', 
                    content: { 
                        'application/json': {  
                            schema: { $ref: '#/components/schemas/Error' },  
                            example: {
                                message: 'Unauthorized: No token provided', 
                                status: 401
                            }, 
                        }, 
                    }, 
                },
                403: { 
                    description: 'Forbidden: Invalid token', 
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: {
                                message: 'Forbidden: Invalid token', 
                                status: 403
                            },  
                        },
                    },
                },
                500: { 
                    description: 'Failed to update password', 
                    content: {  
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/Error' }, 
                            example: { 
                                message: 'Failed to update password', 
                                status: 500 
                            }, 
                        }, 
                    }, 
                }, 
            },
        },
    },
};