export const IS_SERVER = typeof window === "undefined";

export const getAbsoluteUrl = () => {
  //get absolute url in client/browser
  if (!IS_SERVER) {
    return location.origin;
  }
  //get absolute url in server.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  //if you are using npm run dev, use localhost
  return `http://localhost:3000`;
};
