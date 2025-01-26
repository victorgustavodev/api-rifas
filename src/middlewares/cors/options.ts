export const corsOptions = (origin: any, callback: any) => {
  const allowedOrigins = JSON.parse(process.env.ALLOWED_URLS || "[]");
  allowedOrigins.push(`http://localhost:${process.env.PORT || 3333}`);

  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback("Forbidden - Acess not permitted by: cors");
  }
};