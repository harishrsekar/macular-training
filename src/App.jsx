import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./styles.css"; 

// Define test cases
const testCases = [
  { imageSrc: "/page1.png", correct_direction: "ArrowRight", power_grid: "1" },
  { imageSrc: "/page2.png", correct_direction: "ArrowLeft", power_grid: "2" },
  { imageSrc: "/page3.png", correct_direction: "ArrowUp", power_grid: "3" },
  { imageSrc: "/page4.png", correct_direction: "ArrowLeft", power_grid: "4" }
];

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    eye: "OD",
    spectacle: "No",
    bcva: "",
    contact: "",
    address: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formData)); // Store user data
    navigate("/test/0"); // Start test
  };

  return (
    <div className="form-container">
      <h1>Patient Registration</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

        <label>Age:</label>
        <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />

        <label>Gender:</label>
        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Eye:</label>
        <select value={formData.eye} onChange={(e) => setFormData({ ...formData, eye: e.target.value })}>
          <option value="OD">OD</option>
          <option value="OS">OS</option>
        </select>

        <label>Spectacle:</label>
        <select value={formData.spectacle} onChange={(e) => setFormData({ ...formData, spectacle: e.target.value })}>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        <label>BCVA:</label>
        <input type="text" value={formData.bcva} onChange={(e) => setFormData({ ...formData, bcva: e.target.value })} />

        <label>Contact:</label>
        <input type="text" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />

        <label>Address:</label>
        <textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}></textarea>

        <button type="submit">Start Test</button>
      </form>
    </div>
  );
}

function TestPage({ index }) {
  const navigate = useNavigate();
  const testCase = testCases[index];

  useEffect(() => {
    const handleKeyPress = (event) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(event.key)) {
        return; // Ignore non-arrow key presses
      }

      if (event.key === testCase.correct_direction) {
        if (index + 1 < testCases.length) {
          navigate(`/test/${index + 1}`);
        } else {
          navigate("/success");
        }
      } else {
        navigate(`/result/${testCase.power_grid}`);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, testCase, index]);

  return (
    <div className="test-container">
      <h1 className="test-title">PRL Detection</h1>
      <p className="test-instruction">Press the direction of opening in C using the arrow keys.</p>
      <img src={testCase.imageSrc} alt="C-Test" className="test-image" />
    </div>
  );
}

function ResultPage() {
  const { power_grid } = useParams();

  return (
    <div className="result-container">
      <h1>You will continue your training in Grid {power_grid}</h1>
      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }} onClick={() => window.location.href = "/"}>Restart</button>
        <button onClick={() => window.location.href = "/eccentric-training"}>Go to Eccentric View Training</button>
      </div>
    </div>
  );  
}


function SuccessPage() {
  return (
    <div className="success-container">
      <h1>You will continue the training in Grid 4.</h1>
      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }} onClick={() => window.location.href = "/"}>Restart</button>
        <button onClick={() => window.location.href = "/eccentric-training"}>Go to Eccentric View Training</button>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/test/:index" element={<TestPageWrapper />} />
        <Route path="/result/:power_grid" element={<ResultPage />} />
        <Route path="/success" element={<SuccessPage />} />
        
      </Routes>
    </Router>
  );
}

// Wrapper for test page route params
function TestPageWrapper() {
  const { index } = useParams();
  return <TestPage index={parseInt(index, 10)} />;
}
