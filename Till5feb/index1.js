const express = require('express');
const app = express();
const fs = require('fs');

const PORT = 8000;

// middleware
app.use(express.json());

const students = [
    { id: 1, name: 'Raj', branch: 'CSE' },
    { id: 2, name: 'Ajay', branch: 'ECE' },
    { id: 3, name: 'Yash', branch: 'ME' },
];

// READ FUNCTION 
const readStudentFormFile = () => {
    const data = fs.readFileSync("./students.json", "utf-8");
    const students = JSON.parse(data || "[]");
    return students;
};

// WRITE FUNCTION 
const writeStudentToFile = (students) => {
    fs.writeFileSync(
        "./students.json",
        JSON.stringify(students, null, 2)
    );
};

app.get("/students", (req,res) => {
    fs.readFile("./students.json", (err,data) =>{
        if(err){
            return res.status(500).send("Error occured");
        }
        return res.status(200).send(JSON.parse(data));
    });
    return res.json(students);
});

app.get('/', (req, res) => {
    res.send('Welcome to Homepage');
});

app.get('/user', (req, res) => {
    res.send('Welcome to User Page');
});


// get student by id
app.get('/students/:id', (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
});

// get students (optional query)
app.get('/students', (req, res) => {
    const branch = req.query.branch;

    if (!branch) {
        return res.json(students);
    }

    const foundStudents = students.filter(s => s.branch === branch);
    res.json(foundStudents);
});


// // post student



app.post("/students/register", (req,res) =>{

    const {name, branch} = req.body;
    if(!name || !branch) return res.status(400).send("Detailed missing");


    // Read the file first

    // fs.readFile("./students.json", "utf-8", (err, data) => {

    //  if (err) return res.status(500).send("Could not read file");

    // //. Parse existing data or start with empty array

    // const students = JSON.parse(data || "[]");

    const students = readStudentFormFile();
    // Create and push new student

    const newStudent={

     id: students.length > 0 ? students[students.length - 1].id+1:1,
     name,
     branch,

   };

  students.push(newStudent);

// write the WHOLE array back to the file (Overwriting)I

writeStudentToFile(students);


// fs.writeFile("./students.json", JSON.stringify(students, null, 2),(err) => {

//     if (err) return res.status(588).send("Error writing to file");

// ONLY send response inside the success callback



return res.status(201).json({message: "Registered", student: newStudent});
});

    


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


app.put("/students/:id", (req,res) => {

    const userId = Number(req.params.id);

    const foundIndex = students.findIndex((stu) => stu.id === userId);

    if(foundIndex == -1){
        return res.status(404).send("Student not found");
    }

    students[foundIndex] = {
        ...students[foundIndex],
        ...req.body,
    };

    const result = {message: "Student updated", student: students[foundIndex]};
    return res.status(200).json(result);
    
});