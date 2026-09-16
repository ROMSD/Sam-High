// =================================
// AUTHENTICATION MIDDLEWARE
// =================================

const jwt =
    require("jsonwebtoken");


// =================================
// JWT SECRET
// =================================

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "student-results-development-secret";


// =================================
// VERIFY TOKEN
// =================================

function authenticateToken(req, res, next) {

    const authHeader =
        req.headers.authorization;


    // CHECK AUTHORIZATION HEADER

    if (!authHeader) {

        return res.status(401).json({

            message:
                "Authentication required."

        });

    }


    // EXPECTED FORMAT:
    // Authorization: Bearer TOKEN

    const parts =
        authHeader.split(" ");


    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {

        return res.status(401).json({

            message:
                "Invalid authentication format."

        });

    }


    const token =
        parts[1];


    // VERIFY TOKEN

    try {

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        // MAKE USER AVAILABLE
        // TO THE ROUTE

        req.user =
            decoded;


        next();


    } catch (error) {

        return res.status(403).json({

            message:
                "Invalid or expired token."

        });

    }

}


module.exports =
    authenticateToken;