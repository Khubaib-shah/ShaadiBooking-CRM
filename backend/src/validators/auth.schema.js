/**
 * Auth Validation Schemas
 * ───────────────────────
 * Strict Zod schemas for registration, login, and profile update.
 * Used with the validateResource middleware.
 */
const { z } = require("zod");

const ROLES = ["wedding_planner", "vendor", "customer"];

const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address.")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one digit."
    ),
  firstName: z
    .string({ required_error: "First name is required." })
    .min(1, "First name cannot be empty.")
    .max(50, "First name is too long.")
    .trim(),
  lastName: z
    .string({ required_error: "Last name is required." })
    .min(1, "Last name cannot be empty.")
    .max(50, "Last name is too long.")
    .trim(),
  role: z.enum(ROLES, {
    errorMap: () => ({
      message: `Role must be one of: ${ROLES.join(", ")}`,
    }),
  }),
  organizationId: z.string().optional(),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address.")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password cannot be empty."),
});

const updateProfileSchema = z
  .object({
    firstName: z.string().min(1).max(50).trim().optional(),
    lastName: z.string().min(1).max(50).trim().optional(),
    profile: z
      .object({
        phone: z.string().optional(),
        avatar: z.string().url("Avatar must be a valid URL.").optional(),
        bio: z.string().max(500, "Bio is too long.").optional(),
        location: z
          .object({
            address: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update."
  );

module.exports = { registerSchema, loginSchema, updateProfileSchema };
