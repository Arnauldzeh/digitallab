// src/config/swagger.js (Version corrigée)

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "DIGITALAB API",
    version: "1.0.0",
    description: "Documentation de l'API DIGITALAB",
  },
  servers: [
    {
      url: "https://digitallab-5skm.onrender.com",
      description: "Serveur de Production",
    },
    {
      url: "http://localhost:5000",
      description: "Serveur de Développement Local",
    },
  ],
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
                        department: { type: "string" },
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
                  // CORRECTION : Décommenté car il est dans `required`.
                  userName: { type: "string", example: "johndoe" },
                  password: { type: "string", example: "secret123" },
                  qualification: { type: "string", example: "Technicien" },
                  department: { type: "string", example: "Accueil" },
                  phoneNumber: { type: "string", example: "656195342" },
                  email: { type: "string", example: "john@example.com" },
                },
                required: ["userName", "password", "lastName", "firstName"],
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
                      department: { type: "string" },
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
                    department: { type: "string" },
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
                  department: { type: "string" },
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
                  // CORRECTION : "String" devient "string"
                  lastName: { type: "string", example: "Jean" },
                  firstName: { type: "string", example: "Jean" },
                  birthDate: {
                    type: "string",
                    format: "date",
                    example: "1980-01-01",
                  },
                  gender: { type: "string", example: "M" },
                  neighborhood: { type: "string", example: "NKOLGUET" },
                  phoneNumber: { type: "string", example: "659124853" },
                  occupation: { type: "string", example: "Teacher" },
                  email: { type: "string", example: "Jean@gmail.com" },
                  department: { type: "string", example: "Cardiologie" },
                  prescribingDoctor: { type: "string", example: "Dr.Jean" },
                },
                required: ["firstName", "birthDate", "gender"],
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
    "/users/examination/new": {
      post: {
        summary: "Créer un nouvel examen",
        tags: ["Patients"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  patientId: { type: "string", example: "abc123" },
                  examType: { type: "string", example: "radiographie" },
                  date: {
                    type: "string",
                    format: "date-time",
                    example: "2025-06-07T12:00:00Z",
                  },
                  results: {
                    type: "string",
                    example: "Aucun problème détecté",
                  },
                },
                required: ["patientId", "examType", "date"],
              },
            },
          },
        },
        responses: {
          201: { description: "Examen créé" },
          400: { description: "Données invalides" },
        },
      },
    },
    "/users/examination": {
      get: {
        summary: "Récupère la liste de tous les examens",
        tags: ["Patients"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des examens",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      patientId: { type: "string" },
                      examType: { type: "string" },
                      date: { type: "string", format: "date-time" },
                      results: { type: "string" },
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
    "/users/patient/examinations": {
      get: {
        summary: "Récupère tous les examens des patients",
        tags: ["Patients"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des examens des patients",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      patientId: { type: "string" },
                      examId: { type: "string" },
                      examType: { type: "string" },
                      date: { type: "string", format: "date-time" },
                      results: { type: "string" },
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
    "/users/patient/{anonymizedCode}": {
      put: {
        summary: "Met à jour un patient via son code anonymisé",
        tags: ["Patients"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "anonymizedCode",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Code anonymisé du patient",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  firstName: { type: "string" },
                  birthDate: { type: "string", format: "date" },
                  gender: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Patient mis à jour" },
          400: { description: "Données invalides" },
          401: { description: "Non autorisé" },
          404: { description: "Patient non trouvé" },
        },
      },
    },
    "/users/stats": {
      get: {
        summary: "Statistiques des utilisateurs",
        tags: ["Utilisateurs"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Statistiques globales des utilisateurs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalUsers: { type: "integer", example: 120 },
                    activeUsers: { type: "integer", example: 100 },
                    blockedUsers: { type: "integer", example: 20 },
                  },
                },
              },
            },
          },
          401: { description: "Non autorisé" },
        },
      },
    },
    "/users/reset-password/{id}": {
      patch: {
        summary: "Réinitialisation du mot de passe",
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
                  newPassword: {
                    type: "string",
                    example: "newsecret123",
                  },
                },
                // CORRECTION : On retire `userName` qui n'est pas dans les propriétés.
                required: ["newPassword"],
              },
            },
          },
        },
        responses: {
          200: { description: "Mot de passe réinitialisé" },
          400: { description: "Données invalides" },
          404: { description: "Utilisateur non trouvé" },
        },
      },
    },
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
