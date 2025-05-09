import redis from '../redis';

export default async function validateAuth(req) {
    const sessionCookie = req.cookies.get('session_token');
    console.log(sessionCookie)
    // Check if session token exists
    if (!sessionCookie) {
        return { isAuthenticated: false, message: 'You must be logged in to access this page'};
    }


    try {
        // Validate session token in Redis
        const redisSessionValues = await redis.get(sessionCookie.value);
        
        if (!redisSessionValues) {
            return { isAuthenticated: false, message: 'Invalid session, please log in again.'};
        }

    } catch (err) {
        return { isAuthenticated: false, message: "Redis service error. Please try again or contact the website administrator if this keeps happening."};
    }

    return { isAuthenticated: true, message: "Success!" };
}