const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
app.use(express.json());

const port = 8000;

app.use(async (req, res, next) => {
    const log = `${new Date().toISOString()} ${req.method} ${req.url}\n`;
    await fs.appendFile(path.join(__dirname, 'requests.log'), log);
    next();
});

app.use((req, res, next) => {
    console.log(`I am middleware 1`);
    next();
});

app.use((req, res, next) => {
    console.log(`I am middleware 2`);
    next();
});

const studentsFile = path.join(__dirname, 'students.json');

const readStudentsFromFile = async () => {
    const data = await fs.readFile(studentsFile, 'utf-8');
    return JSON.parse(data || '[]');
};

const writeStudentsToFile = async (students) => {
    await fs.writeFile(studentsFile, JSON.stringify(students, null, 2));
};

app.get("/students", async (req, res) => {
    const students = await readStudentsFromFile();
    return res.status(200).json(students);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});