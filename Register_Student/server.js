const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const filePath = path.join(__dirname, 'data.json');

app.post("/students/register", (req, res) => {
    const { name, branch } = req.body;

    if (!name || !branch) {
        return res.send("<h2>All fields required</h2>");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
        let students = [];

        if (!err && data) {
            students = JSON.parse(data);
        }
        const newStudent = {
            id: students.length + 1,
            name,
            branch
        };

        students.push(newStudent);

        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.send("<h2>Error saving student</h2>");
            }

            res.send(`
                <h2>Student Registered Successfully 🎉</h2>
                <p>Name: ${name}</p>
                <p>Branch: ${branch}</p>
                <a href="/">Go Back</a>
            `);
        });
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});

app.listen(5500, () => console.log("Server running on port 5500"));
