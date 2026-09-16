
// =================================
// STUDENTS ROUTES
// =================================

const express = require("express");

const router = express.Router();

const db = require("../database/database");


// =================================
// GET ALL STUDENTS
// =================================

router.get("/", (req, res) => {

    try {

        const students =
            db.prepare(`
                SELECT
                    students.id,
                    students.name,
                    students.student_id,
                    students.student_class,
                    students.gender,

                    COALESCE(
                        AVG(results.percentage),
                        0
                    ) AS average_mark

                FROM students

                LEFT JOIN results
                    ON students.id =
                       results.student_id

                GROUP BY students.id

                ORDER BY students.id DESC
            `).all();


        res.json(students);


    } catch (error) {

        console.error(
            "Error fetching students:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch students."
        });
    }

});


// =================================
// ADD STUDENT
// =================================

router.post("/", (req, res) => {

    try {

        const {
            name,
            studentId,
            studentClass,
            gender
        } = req.body;


        // VALIDATION
        if (
            !name ||
            !studentId ||
            !studentClass ||
            !gender
        ) {

            return res.status(400).json({
                message:
                    "All fields are required."
            });
        }


        // CHECK DUPLICATE STUDENT ID
        const existingStudent =
            db.prepare(`
                SELECT id
                FROM students
                WHERE student_id = ?
            `).get(studentId);


        if (existingStudent) {

            return res.status(409).json({
                message:
                    "Student ID already exists."
            });
        }


        // INSERT STUDENT
        const result =
            db.prepare(`
                INSERT INTO students (
                    name,
                    student_id,
                    student_class,
                    gender
                )
                VALUES (?, ?, ?, ?)
            `).run(
                name,
                studentId,
                studentClass,
                gender
            );


        res.status(201).json({

            message:
                "Student added successfully.",

            student: {
                id: result.lastInsertRowid,
                name: name,
                student_id: studentId,
                student_class: studentClass,
                gender: gender
            }

        });


    } catch (error) {

        console.error(
            "Error adding student:",
            error
        );

        res.status(500).json({
            message:
                "Failed to add student."
        });
    }

});


// =================================
// UPDATE STUDENT
// =================================

router.put("/:id", (req, res) => {

    try {

        const studentId =
            req.params.id;


        const {
            name,
            studentId: newStudentId,
            studentClass,
            gender
        } = req.body;


        // VALIDATION
        if (
            !name ||
            !newStudentId ||
            !studentClass ||
            !gender
        ) {

            return res.status(400).json({
                message:
                    "All fields are required."
            });
        }


        // CHECK STUDENT EXISTS
        const student =
            db.prepare(`
                SELECT id
                FROM students
                WHERE id = ?
            `).get(studentId);


        if (!student) {

            return res.status(404).json({
                message:
                    "Student not found."
            });
        }


        // CHECK DUPLICATE STUDENT ID
        const duplicate =
            db.prepare(`
                SELECT id
                FROM students
                WHERE student_id = ?
                AND id != ?
            `).get(
                newStudentId,
                studentId
            );


        if (duplicate) {

            return res.status(409).json({
                message:
                    "Student ID already exists."
            });
        }


        // UPDATE
        db.prepare(`
            UPDATE students

            SET
                name = ?,
                student_id = ?,
                student_class = ?,
                gender = ?

            WHERE id = ?
        `).run(
            name,
            newStudentId,
            studentClass,
            gender,
            studentId
        );


        res.json({

            message:
                "Student updated successfully."

        });


    } catch (error) {

        console.error(
            "Error updating student:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update student."
        });
    }

});


// =================================
// DELETE STUDENT
// =================================

router.delete("/:id", (req, res) => {

    try {

        const studentId =
            req.params.id;


        // CHECK STUDENT EXISTS
        const student =
            db.prepare(`
                SELECT id
                FROM students
                WHERE id = ?
            `).get(studentId);


        if (!student) {

            return res.status(404).json({
                message:
                    "Student not found."
            });
        }


        // DELETE STUDENT
        db.prepare(`
            DELETE FROM students
            WHERE id = ?
        `).run(studentId);


        res.json({

            message:
                "Student deleted successfully."

        });


    } catch (error) {

        console.error(
            "Error deleting student:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete student."
        });
    }

});

module.exports = router;
// =================================
// EXPORT ROUTER
// =================================

