const express = require("express");
const app = express();
const fs = require('fs');

app.use(express.json());

const student = [
    { id: 1, name: "Shivansh", branch: "cse", state: "up" },
    { id: 2, name: "Aman", branch: "ese" },
    { id: 3, name: "ravi", branch: "ml" },
];

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/user", (req, res) => {
    res.send("user page");
});
app.get("/students", (req, res) => {
    res.json(student);
});


app.get("/student", (req, res) => {
    const branch = req.query.branch;
    const foundStudent = student.filter(s => s.branch === branch);
    res.json(foundStudent);
});

// GET http://localhost:8000/student?branch=cse


app.get("/student/:id", (req, res) => {
    const id = Number(req.params.id);
    const studentResult = student.find(s => s.id === id);

    if (!studentResult) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(studentResult);
});

app.post("/student/register", (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send("No data provided!");
    }

    student.push(data); 

    res.json({
        message: "Student registered successfully",
        allStudents: student
    });
});
app.put("/student/update/:id", (req, res) => {
    const id = Number(req.params.id);
    const newData = req.body;

    const studentIndex = student.findIndex(s => s.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({ message: "Student not found" });
    }
    student[studentIndex] = { ...student[studentIndex], ...newData };

    res.json({
        message: "Student updated successfully",
        updatedStudent: student[studentIndex]
    });
});


app.delete('/student/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = student.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deletedStudent = student.splice(index, 1);

    res.json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});