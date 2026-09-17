// =================================
// AUTHENTICATION ROUTES
// =================================

const express =
    require("express");

const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");

const router =
    express.Router();

const db =
    require("../database/database");

const authenticateToken =
    require("../middleware/auth");



// =================================
// JWT SECRET
// =================================

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "student-results-development-secret";


// =================================
// REGISTER USER
// =================================

router.post(
    "/register",
    async (req, res) => {

        const {
            name,
            email,
            password
        } = req.body;


        // VALIDATION

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Name, email and password are required."

            });

        }


        // PASSWORD LENGTH

        if (password.length < 6) {

            return res.status(400).json({

                message:
                    "Password must be at least 6 characters."

            });

        }


        try {

            // CHECK EXISTING USER

            const existingUser =
                db.prepare(`
                    SELECT id
                    FROM users
                    WHERE email = ?
                `).get(email);


            if (existingUser) {

                return res.status(409).json({

                    message:
                        "An account with this email already exists."

                });

            }


            // HASH PASSWORD

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            // CREATE USER

            const statement =
                db.prepare(`
                    INSERT INTO users
                    (
                        name,
                        email,
                        password_hash
                    )
                    VALUES (?, ?, ?)
                `);


            const result =
                statement.run(
                    name,
                    email,
                    passwordHash
                );


            res.status(201).json({

                message:
                    "Account created successfully.",

                user: {

                    id:
                        result.lastInsertRowid,

                    name:
                        name,

                    email:
                        email

                }

            });


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to create account."

            });

        }

    }
);


// =================================
// LOGIN USER
// =================================

router.post(
    "/login",
    async (req, res) => {

        const {
            email,
            password
        } = req.body;


        // VALIDATION

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }


        try {

            // FIND USER

            const user =
                db.prepare(`
                    SELECT *
                    FROM users
                    WHERE email = ?
                `).get(email);


            if (!user) {

                return res.status(401).json({

                    message:
                        "Invalid email or password."

                });

            }


            // VERIFY PASSWORD

            const passwordMatches =
                await bcrypt.compare(
                    password,
                    user.password_hash
                );


            if (!passwordMatches) {

                return res.status(401).json({

                    message:
                        "Invalid email or password."

                });

            }


            // =================================
            // CREATE JWT
            // =================================

            const token =
                jwt.sign(

                    {
                        id:
                            user.id,

                        name:
                            user.name,

                        email:
                            user.email
                    },

                    JWT_SECRET,

                    {
                        expiresIn:
                            "2h"
                    }

                );


            // =================================
            // RETURN TOKEN
            // =================================

            res.json({

                message:
                    "Login successful.",

                token:
                    token,

                user: {

                    id:
                        user.id,

                    name:
                        user.name,

                    email:
                        user.email

                }

            });


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            res.status(500).json({

                message:
                    "Login failed."

            });

        }

    }
);
// =================================
// CHANGE PASSWORD
// =================================

router.put("/change-password", authenticateToken, async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        // VALIDATION
        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "Current password and new password are required."
            });

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                message: "New password must be at least 6 characters."
            });

        }


        // GET CURRENT USER
        const user =
            db.prepare(`
                SELECT *
                FROM users
                WHERE id = ?
            `).get(req.user.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }


        // CHECK CURRENT PASSWORD
        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                user.password_hash
            );


        if (!passwordMatches) {

            return res.status(401).json({
                message: "Current password is incorrect."
            });

        }


        // HASH NEW PASSWORD
        const newPasswordHash =
            await bcrypt.hash(
                newPassword,
                10
            );


        // UPDATE PASSWORD
        db.prepare(`
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
        `).run(
            newPasswordHash,
            req.user.id
        );


        res.json({
            message: "Password changed successfully."
        });


    } catch (error) {

        console.error(
            "Change password error:",
            error
        );


        res.status(500).json({
            message: "Failed to change password."
        });

    }

});


module.exports = router;