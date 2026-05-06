/**
 * Zod Validation Middleware Factory
 * ──────────────────────────────────
 * Generic middleware that validates `req.body`, `req.query`, and/or `req.params`
 * against provided Zod schemas. On failure, the Zod error propagates to the
 * centralized error handler for consistent formatting.
 *
 * Usage:
 *   const { createEventSchema } = require("../validators/event.schema");
 *   router.post("/", validateResource({ body: createEventSchema }), controller.create);
 *
 * @param {{ body?: import('zod').ZodSchema, query?: import('zod').ZodSchema, params?: import('zod').ZodSchema }} schemas
 * @returns {import('express').RequestHandler}
 */
const validateResource = (schemas) => {
  return (req, _res, next) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }

    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }

    next();
  };
};

module.exports = validateResource;
