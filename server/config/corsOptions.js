
const getAllowedOrigins = () => {
  const clientUrls = process.env.CLIENT_URL || "";
  return clientUrls
    .split(",")
    .map(url => url.trim())
    .filter(Boolean);
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(" Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export { getAllowedOrigins };
export default corsOptions;
