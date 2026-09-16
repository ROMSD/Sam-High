const express = require("express");
const router = express.Router();

const db = require("../database/database");


// ==============================
// CALCULATE GRADE
// ==============================

function calculateGrade(marks) {

    marks = Number(marks);

    if (marks >= 80) {
        return "A";
    }

    if (marks >= 70) {
        return "B";
    }

    if (marks >= 60) {
        return "C";
    }

    if (marks >= 50) {
        return "D";
    }

    return "F";
}


// ==============================
// GET ALL RESULTS
// ==============================

router.get("/", (req, res) => {

    const results = db.prepare(`
        SELECT
            results.id,
            results.student_id,
            students.name AS student_name,
            students.student_id AS student_number,
            results.subject_id,
            subjects.name AS subject_name,
            subjects.code AS subject_code,
            results.marks,
            results.percentage,
            results.grade,
            results.created_at

        FROM results

        INNER JOIN students
            ON results.student_id = students.id

        INNER JOIN subjects
            ON results.subject_id = subjects.id

        ORDER BY results.id DESC
    `).all();


    res.json(results);

});


// ==============================
// ADD RESULT
// ==============================

router.post("/", (req, res) => {

    const {
        studentId,
        subjectId,
        marks
    } = req.body;


    // VALIDATION

    if (
        studentId === undefined ||
        subjectId === undefined ||
        marks === undefined
    ) {

        return res.status(400).json({

            message:
                "Student, subject and marks are required."

        });

    }


    const numericMarks =
        Number(marks);


    if (
        isNaN(numericMarks) ||
        numericMarks < 0 ||
        numericMarks > 100
    ) {

        return res.status(400).json({

            message:
                "Mark must be between 0 and 100."

        });

    }


    try {

        // CHECK STUDENT

        const student =
            db.prepare(`
                SELECT *
                FROM students
                WHERE id = ?
            `).get(studentId);


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        // CHECK SUBJECT

        const subject =
            db.prepare(`
                SELECT *
                FROM subjects
                WHERE id = ?
            `).get(subjectId);


        if (!subject) {

            return res.status(404).json({

                message:
                    "Subject not found."

            });

        }


        // CHECK DUPLICATE RESULT

        const existingResult =
            db.prepare(`
                SELECT *
                FROM results
                WHERE student_id = ?
                AND subject_id = ?
            `).get(
                studentId,
                subjectId
            );


        if (existingResult) {

            return res.status(409).json({

                message:
                    "A result for this student and subject already exists."

            });

        }


        // CALCULATE GRADE

        const percentage =
            numericMarks;

        const grade =
            calculateGrade(numericMarks);


        // INSERT RESULT

        const statement =
            db.prepare(`

                INSERT INTO results
                (
                    student_id,
                    subject_id,
                    marks,
                    percentage,
                    grade
                )

                VALUES (?, ?, ?, ?, ?)

            `);


        const result =
            statement.run(

                studentId,

                subjectId,

                numericMarks,

                percentage,

                grade

            );


        res.status(201).json({

            message:
                "Result added successfully.",

            result: {

                id:
                    result.lastInsertRowid,

                studentId:
                    studentId,

                subjectId:
                    subjectId,

                marks:
                    numericMarks,

                percentage:
                    percentage,

                grade:
                    grade

            }

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Failed to add result."

        });

    }

});


// ==============================
// UPDATE RESULT
// ==============================

router.put("/:id", (req, res) => {

    const id =
        req.params.id;


    const {
        studentId,
        subjectId,
        marks
    } = req.body;


    // VALIDATION

    if (
        studentId === undefined ||
        subjectId === undefined ||
        marks === undefined
    ) {

        return res.status(400).json({

            message:
                "Student, subject and marks are required."

        });

    }


    const numericMarks =
        Number(marks);


    if (
        isNaN(numericMarks) ||
        numericMarks < 0 ||
        numericMarks > 100
    ) {

        return res.status(400).json({

            message:
                "Mark must be between 0 and 100."

        });

    }


    try {

        // CHECK STUDENT

        const student =
            db.prepare(`
                SELECT *
                FROM students
                WHERE id = ?
            `).get(studentId);


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        // CHECK SUBJECT

        const subject =
            db.prepare(`
                SELECT *
                FROM subjects
                WHERE id = ?
            `).get(subjectId);


        if (!subject) {

            return res.status(404).json({

                message:
                    "Subject not found."

            });

        }


        // CHECK FOR DUPLICATE

        const duplicate =
            db.prepare(`

                SELECT *
                FROM results

                WHERE student_id = ?

                AND subject_id = ?

                AND id != ?

            `).get(

                studentId,

                subjectId,

                id

            );


        if (duplicate) {

            return res.status(409).json({

                message:
                    "A result for this student and subject already exists."

            });

        }


        // CALCULATE GRADE

        const percentage =
            numericMarks;

        const grade =
            calculateGrade(numericMarks);


        // UPDATE

        const statement =
            db.prepare(`

                UPDATE results

                SET

                    student_id = ?,

                    subject_id = ?,

                    marks = ?,

                    percentage = ?,

                    grade = ?

                WHERE id = ?

            `);


        const result =
            statement.run(

                studentId,

                subjectId,

                numericMarks,

                percentage,

                grade,

                id

            );


        if (result.changes === 0) {

            return res.status(404).json({

                message:
                    "Result not found."

            });

        }


        res.json({

            message:
                "Result updated successfully."

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Failed to update result."

        });

    }

});


// ==============================
// DELETE RESULT
// ==============================

router.delete("/:id", (req, res) => {

    const id =
        req.params.id;


    const result =
        db.prepare(`

            DELETE FROM results

            WHERE id = ?

        `).run(id);


    if (result.changes === 0) {

        return res.status(404).json({

            message:
                "Result not found."

        });

    }


    res.json({

        message:
            "Result deleted successfully."

    });

});


// ==============================
// EXPORT ROUTER
// ==============================

module.exports = router;