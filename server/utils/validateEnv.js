export function validateEnv(requiredVars = []) {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`❌ Missing required env variables: ${missing.join(", ")}`);
  }
}
