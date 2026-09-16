const express = require("express");
const router = express.Router();

const db = require("../database/database");


// ==============================
// GET ALL SUBJECTS
// ==============================

router.get("/", (req, res) => {

    const subjects = db.prepare(`
        SELECT *
        FROM subjects
        ORDER BY id DESC
    `).all();

    res.json(subjects);

});


// ==============================
// ADD NEW SUBJECT
// ==============================

router.post("/", (req, res) => {

    const {
        name,
        code,
        category,
        status
    } = req.body;


    // Check required fields

    if (!name || !code || !category || !status) {

        return res.status(400).json({

            message:
                "All fields are required."

        });

    }


    try {

        const statement = db.prepare(`

            INSERT INTO subjects
            (
                name,
                code,
                category,
                status
            )

            VALUES (?, ?, ?, ?)

        `);


        const result = statement.run(

            name,
            code,
            category,
            status

        );


        res.status(201).json({

            message:
                "Subject added successfully.",

            subject: {

                id:
                    result.lastInsertRowid,

                name:
                    name,

                code:
                    code,

                category:
                    category,

                status:
                    status

            }

        });


    } catch (error) {

        console.error(error);


        // Duplicate subject code

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                message:
                    "Subject code already exists."

            });

        }


        res.status(500).json({

            message:
                "Failed to add subject."

        });

    }

});


// ==============================
// UPDATE SUBJECT
// ==============================

router.put("/:id", (req, res) => {

    const id = req.params.id;


    const {
        name,
        code,
        category,
        status
    } = req.body;


    // Check required fields

    if (!name || !code || !category || !status) {

        return res.status(400).json({

            message:
                "All fields are required."

        });

    }


    try {

        const statement = db.prepare(`

            UPDATE subjects

            SET

                name = ?,

                code = ?,

                category = ?,

                status = ?

            WHERE id = ?

        `);


        const result = statement.run(

            name,

            code,
            category,
            status,
            id

        );


        // Check if subject exists

        if (result.changes === 0) {

            return res.status(404).json({

                message:
                    "Subject not found."

            });

        }


        res.json({

            message:
                "Subject updated successfully."

        });


    } catch (error) {

        console.error(error);


        // Duplicate subject code

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                message:
                    "Subject code already exists."

            });

        }


        res.status(500).json({

            message:
                "Failed to update subject."

        });

    }

});


// ==============================
// DELETE SUBJECT
// ==============================

router.delete("/:id", (req, res) => {

    const id = req.params.id;


    const result = db.prepare(`

        DELETE FROM subjects

        WHERE id = ?

    `).run(id);


    // Check if subject exists

    if (result.changes === 0) {

        return res.status(404).json({

            message:
                "Subject not found."

        });

    }


    res.json({

        message:
            "Subject deleted successfully."

    });

});


// ==============================
// EXPORT ROUTER
// ==============================

module.exports = router;