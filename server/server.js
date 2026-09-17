const express = require("express");
const cors = require("cors");

const db = require("./database/database");
const studentRoutes = require("./routes/students");
const subjectRoutes = require("./routes/subjects");
const resultRoutes = require("./routes/results");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/auth");

const app = express();

const PORT = 3000;


// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());


// ==============================
// TEST API
// ==============================

app.get("/api/test", (req, res) => {

    const studentCount =
        db.prepare(
            "SELECT COUNT(*) AS count FROM students"
        ).get();


    res.json({

        message:
            "API and database are working!",

        totalStudents:
            studentCount.count

    });

});


// ==============================
// DASHBOARD API
// ==============================

app.get(
    "/api/dashboard",
    authenticateToken,
    (req, res) => {

        try {

            // ==============================
            // TOTAL STUDENTS
            // ==============================

            const totalStudents =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM students
                `).get().count;


            // ==============================
            // TOTAL SUBJECTS
            // ==============================

            const totalSubjects =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM subjects
                `).get().count;


            // ==============================
            // TOTAL RESULTS
            // ==============================

            const totalResults =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM results
                `).get().count;


            // ==============================
            // AVERAGE MARK
            // ==============================

            const averageMark =
                db.prepare(`
                    SELECT AVG(marks) AS average
                    FROM results
                `).get().average;


            // ==============================
            // DEBUG AVERAGE MARK
            // ==============================

            console.log(
                "Average Mark from database:",
                averageMark
            );


            // ==============================
            // PASSED RESULTS
            // ==============================

            const passedResults =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM results
                    WHERE marks >= 50
                `).get().count;


            // ==============================
            // PASS RATE
            // ==============================

            let passRate = 0;


            if (totalResults > 0) {

                passRate =
                    (passedResults / totalResults) * 100;

            }


            // ==============================
            // SEND DASHBOARD DATA
            // ==============================

            res.json({

                totalStudents:
                    totalStudents,

                totalSubjects:
                    totalSubjects,

                totalResults:
                    totalResults,

                averageMark:
                    averageMark
                        ? Number(
                            averageMark.toFixed(1)
                        )
                        : 0,

                passRate:
                    Number(
                        passRate.toFixed(1)
                    )

            });


        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to load dashboard statistics."

            });

        }

    }
);


// ==============================
// STUDENT API
// ==============================

app.use(
    "/api/students",
    authenticateToken,
    studentRoutes
);


// ==============================
// SUBJECT API
// ==============================

app.use(
    "/api/subjects",
    authenticateToken,
    subjectRoutes
);


// ==============================
// RESULT API
// ==============================

app.use(
    "/api/results",
    authenticateToken,
    resultRoutes
);


// ==============================
// AUTH API
// ==============================

app.use(
    "/api/auth",
    authRoutes
);


// ==============================
// START SERVER
// ==============================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);