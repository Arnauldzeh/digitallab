// src/config/swagger.js
module.exports = {
  openapi: "3.0.0",
  info: {
    title: "DIGITALAB API",
    version: "1.0.0",
    description: "Documentation de l'API DIGITALAB",
  },
  tags: [
    {
      name: "Authentification",
      description: "Opérations liées à l'authentification",
    },
    { name: "Utilisateurs", description: "Gestion des utilisateurs" },
    { name: "Patients", description: "Gestion des patients et examens" },
  ],
  paths: {
    "/users/signin": {
      post: {
        summary: "Authentifie un utilisateur",
        tags: ["Authentification"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userName: { type: "string", example: "SA001" },
                  password: { type: "string", example: "Admin" },
                },
                required: ["userName", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentification réussie",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        lastName: { type: "string" },
                        firstName: { type: "string" },
                        userName: { type: "string" },
                        qualification: { type: "string" },
                        departments: {
                          type: "array",
                          items: { type: "string" },
                        },
                        phoneNumber: { type: "string" },
                        email: { type: "string" },
                        isBlocked: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Identifiants incorrects" },
        },
      },
    },

    "/users/register": {
      post: {
        summary: "Créer un nouvel utilisateur",
        tags: ["Utilisateurs"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lastName: { type: "string", example: "Doe" },
                  firstName: { type: "string", example: "John" },
                  password: { type: "string", example: "secret123" },
                  qualification: { type: "string", example: "Technicien" },
                  departments: {
                    type: "array",
                    items: { type: "string", example: "Accueil" },
                  },
                  phoneNumber: { type: "string", example: "656195342" },
                  email: { type: "string", example: "john@example.com" },
                },
                required: [
                  "lastName",
                  "firstName",
                  "password",
                  "qualification",
                  "departments",
                  "phoneNumber",
                  "email",
                ],
              },
            },
          },
        },
        responses: {
          201: { description: "Utilisateur créé avec succès" },
          401: { description: "Non autorisé" },
          400: { description: "Données invalides" },
        },
      },
    },

    "/users": {
      get: {
        summary: "Récupère la liste des utilisateurs",
        tags: ["Utilisateurs"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des utilisateurs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      lastName: { type: "string" },
                      firstName: { type: "string" },
                      userName: { type: "string" },
                      qualification: { type: "string" },
                      departments: {
                        type: "array",
                        items: { type: "string" },
                      },
                      phoneNumber: { type: "string" },
                      email: { type: "string" },
                      isBlocked: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Non autorisé" },
        },
      },
    },

    "/users/{id}": {
      get: {
        summary: "Récupère un utilisateur par son ID",
        tags: ["Utilisateurs"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur",
          },
        ],
        responses: {
          200: {
            description: "Utilisateur trouvé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    lastName: { type: "string" },
                    firstName: { type: "string" },
                    userName: { type: "string" },
                    qualification: { type: "string" },
                    departments: {
                      type: "array",
                      items: { type: "string" },
                    },
                    phoneNumber: { type: "string" },
                    email: { type: "string" },
                    isBlocked: { type: "boolean" },
                  },
                },
              },
            },
          },
          404: { description: "Utilisateur non trouvé" },
          401: { description: "Non autorisé" },
        },
      },
      patch: {
        summary: "Met à jour un utilisateur par son ID",
        tags: ["Utilisateurs"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lastName: { type: "string" },
                  firstName: { type: "string" },
                  qualification: { type: "string" },
                  departments: { type: "array", items: { type: "string" } },
                  phoneNumber: { type: "string" },
                  email: { type: "string" },
                  isBlocked: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Utilisateur mis à jour" },
          400: { description: "Données invalides" },
          401: { description: "Non autorisé" },
          404: { description: "Utilisateur non trouvé" },
        },
      },
      delete: {
        summary: "Supprime un utilisateur par son ID",
        tags: ["Utilisateurs"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur",
          },
        ],
        responses: {
          200: { description: "Utilisateur supprimé" },
          401: { description: "Non autorisé" },
          404: { description: "Utilisateur non trouvé" },
        },
      },
    },

    // Patient endpoints
    "/users/patient/new": {
      post: {
        summary: "Créer un nouveau patient",
        tags: ["Patients"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lastName: { type: "string", example: "Jean" },
                  firstName: { type: "string", example: "Dupont" },
                  birthDate: {
                    type: "string",
                    format: "date",
                    example: "1980-01-01",
                  },
                  gender: { type: "string", example: "M" },
                  neighborhood: { type: "string", example: "NKOLGUET" },
                  phoneNumber: { type: "string", example: "659124853" },
                  occupation: { type: "string", example: "Teacher" },
                  email: { type: "string", example: "jean@gmail.com" },
                  department: { type: "string", example: "Cardiologie" },
                  prescribingDoctor: { type: "string", example: "Dr.Jean" },
                },
                required: ["firstName", "lastName", "birthDate", "gender"],
              },
            },
          },
        },
        responses: {
          201: { description: "Patient créé" },
          401: { description: "Non autorisé" },
          400: { description: "Données invalides" },
        },
      },
    },

    // Ajouter ici les autres endpoints patients / examens de façon similaire...
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
