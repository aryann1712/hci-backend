// middleware/zodValidate.js
import { ZodError } from "zod";

export const zodValidate =
  (schema) =>
  (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
        if (error instanceof ZodError) {
            // Construct an array of { field, message } or any format you like
            const formattedErrors = error.errors.map((issue) => {
              const fieldPath = issue.path.join("."); 
              // e.g. if path = ["phone"], fieldPath = "phone"
              // if path = ["address", "street"], fieldPath = "address.street"
    
              return {
                field: fieldPath || "(root)", // handle empty path edge case
                message: issue.message,       // e.g. "Required"
              };
            });
    
            // Return a 400 with all details
            return res.status(400).json({ errors: formattedErrors });
          }
      next(error);
    }
  };
