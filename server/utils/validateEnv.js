export function validateEnv(requiredVars = []) {
  // Filter the required environment variables to find the ones missing
  // !process.env[key] is true if the variable is missing, empty, or falsy
  const missing = requiredVars.filter((key) => !process.env[key]);

  // If any required variable is missing, throw an error and stop server startup
  if (missing.length > 0) {
    throw new Error(`❌ Missing required env variables: ${missing.join(", ")}`);
  }
}

/*
Purpose of this function:
- Ensure that all required environment variables (like API keys, DB connection strings, secrets) exist.
- If any are missing, throw an error immediately to prevent the server from starting incorrectly.

How it works:
1. Takes an array of required environment variable names: requiredVars.
2. Checks each key in process.env:
   - If the variable is missing or empty (!process.env[key] is true), it is included in the missing array.
   - If the variable exists and has a value, it is skipped (filtered out).
3. If the missing array is not empty, throws an error listing the missing variables.
*/
