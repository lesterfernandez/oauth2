import { z } from "zod";

const envVars = z.object({
  VITE_GOOGLE_CLIENT_ID: z.string(),
  VITE_CLIENT_URL: z.string(),
});

const parsedEnv = envVars.parse(import.meta.env);

console.log(parsedEnv);

export default parsedEnv;
