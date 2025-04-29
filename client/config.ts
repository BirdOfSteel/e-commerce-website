let SERVER_URL = null;

if (process.env.NODE_ENV === "production") {
    SERVER_URL = process.env.NEXT_PUBLIC_PRODUCTION_SERVER_URL;
} else if (process.env.NODE_ENV === "development") {
    SERVER_URL = process.env.NEXT_PUBLIC_DEV_SERVER_URL;
} else {
    console.log("ENVIRONMENT WARNING!");
    console.error("CRITICAL: ENVIRONMENT NOT SET OR INVALID TYPE. VERIFY process.env.NODE_ENV AND config.ts FILE.");
};

console.log('SERVER_URL: ' + SERVER_URL)

export { SERVER_URL };

