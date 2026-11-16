import fs from "fs";
import express from "express";

const app = express();

app.use(express.json());

const readData = () => {
  const data = fs.readFileSync("./data/faculty.json", "utf-8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(
    "./data/faculty.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
};

// Create a faculty member
app.post("/api/v1/faculty", (req, res) => {
  const allFaculty = readData();

  const newFaculty = {
    id: allFaculty.length === 0
      ? 1
      : allFaculty[allFaculty.length - 1].id + 1,
    ...req.body,
  };

  allFaculty.push(newFaculty);
  writeData(allFaculty);

  res.status(201).json({
    message: "Faculty member created successfully",
    data: newFaculty,
  });
});

// Get all faculty members
app.get("/api/v1/faculty", (req, res) => {
  let allFaculty = readData();
  const dept = req.query.dept;

  if (dept) {
    allFaculty = allFaculty.filter((faculty) => faculty.dept === dept);
  }

  res.status(200).json({
    message: "Faculty retrieved successfully",
    data: allFaculty,
  });
});

// Get one faculty member by ID
app.get("/api/v1/faculty/:id", (req, res) => {
  const allFaculty = readData();
  const facultyId = parseInt(req.params.id);

  const faculty = allFaculty.find(
    (faculty) => faculty.id === facultyId
  );

  if (faculty) {
    res.status(200).json({
      message: "Faculty member retrieved successfully",
      data: faculty,
    });
  } else {
    res.status(404).json({
      message: "Faculty member not found",
    });
  }
});

// Update a faculty member
app.put("/api/v1/faculty/:id", (req, res) => {
  const allFaculty = readData();
  const facultyId = parseInt(req.params.id);

  const facultyIndex = allFaculty.findIndex(
    (faculty) => faculty.id === facultyId
  );

  if (facultyIndex !== -1) {
    const updatedFaculty = {
      id: facultyId,
      ...req.body,
    };

    allFaculty[facultyIndex] = updatedFaculty;
    writeData(allFaculty);

    res.status(200).json({
      message: "Faculty member updated successfully",
      data: updatedFaculty,
    });
  } else {
    res.status(404).json({
      message: "Faculty member not found",
    });
  }
});

// Delete a faculty member
app.delete("/api/v1/faculty/:id", (req, res) => {
  const facultyId = parseInt(req.params.id);
  const allFaculty = readData();

  const facultyIndex = allFaculty.findIndex(
    (faculty) => faculty.id === facultyId
  );

  if (facultyIndex !== -1) {
    const deletedFaculty = allFaculty.splice(facultyIndex, 1)[0];
    writeData(allFaculty);

    res.status(200).json({
      message: "Faculty member deleted successfully",
      data: deletedFaculty,
    });
  } else {
    res.status(404).json({
      message: "Faculty member not found",
    });
  }
});

// Start the server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});