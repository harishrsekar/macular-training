import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { ref, set, get } from "firebase/database";
import { database } from "./firebase";
import "./styles.css";

// Helper function to get formatted timestamp with IST offset (+5:30)
const getFormattedTimestamp = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istTime = new Date(now.getTime() + istOffset);
  
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const year = istTime.getUTCFullYear();
  const hours = String(istTime.getUTCHours()).padStart(2, '0');
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}; 

// AppBar component
function AppBar({ patientName, onFontSizeChange, selectedQuadrant, setSelectedQuadrant, duration, setDuration, showDurationDropdown = false, scrollSpeed, setScrollSpeed, showSpeedDropdown = false, fontSizeOptions, selectedFontSize, centralSpot, setCentralSpot, showCentralSpot = false, selectedChart, setSelectedChart, showChartDropdown = false, quadrantBlur, setQuadrantBlur, showQuadrantBlurDropdown = false, quadrantBlurDropdownOpen, setQuadrantBlurDropdownOpen, nonIdentifiableQuadrants, setNonIdentifiableQuadrants, showPRLScrollButton = false, onGoToPRLScroll, spacing, setSpacing, showSpacingSlider = false }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#2a2a2a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 32px',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ color: 'white', fontSize: '18px', whiteSpace: 'nowrap' }}>
        Name: {patientName}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'nowrap' }}>
        {showCentralSpot && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap' }}>Central Spot:</label>
            <select
              value={centralSpot}
              onChange={e => setCentralSpot(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', minWidth: 80 }}
            >
              <option value="big">Big</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap' }}>Quadrant:</label>
          <select
            value={selectedQuadrant}
            onChange={e => setSelectedQuadrant(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', minWidth: 60 }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        
        {showDurationDropdown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap' }}>Duration:</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', minWidth: 80 }}
            >
              <option value="infinite">&#8734; (infinite)</option>
              <option value="5">5 seconds</option>
              <option value="4">4 seconds</option>
              <option value="3">3 seconds</option>
              <option value="2">2 seconds</option>
              <option value="1">1 second</option>
            </select>
          </div>
        )}
        {showChartDropdown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap' }}>Grid Type:</label>
            <select
              value={selectedChart}
              onChange={e => setSelectedChart(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', minWidth: 100 }}
            >
              <option value="1">Chart 1</option>
              <option value="2">Chart 2</option>
              <option value="3">Chart 3</option>
              <option value="4">Chart 4</option>
              <option value="5">Chart 5</option>
              <option value="6">Chart 6</option>
              <option value="7">Chart 7</option>
            </select>
          </div>
        )}
        {showQuadrantBlurDropdown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap' }}>Quadrant Blur:</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setQuadrantBlurDropdownOpen(!quadrantBlurDropdownOpen)}
                style={{ 
                  padding: '8px', 
                  borderRadius: '4px', 
                  backgroundColor: '#333', 
                  color: 'white', 
                  border: '1px solid #555', 
                  minWidth: 120,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>
                  {quadrantBlur.size === 0 ? 'Select' : 
                   Array.from(quadrantBlur).sort().map(q => `Q${q}`).join(', ')}
                </span>
                <span>{quadrantBlurDropdownOpen ? '▼' : '▶'}</span>
              </button>
              {quadrantBlurDropdownOpen && (
                <div style={{ 
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#333', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  padding: '8px',
                  minWidth: 120,
                  zIndex: 1001,
                  marginTop: '2px'
                }}>
                  {['1', '2', '3', '4'].map(q => (
                    <div key={q} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <input
                        type="checkbox"
                        id={`quadrant-${q}`}
                        checked={quadrantBlur.has(q)}
                        onChange={(e) => {
                          const newSet = new Set(quadrantBlur);
                          if (e.target.checked) {
                            newSet.add(q);
                          } else {
                            newSet.delete(q);
                          }
                          setQuadrantBlur(newSet);
                          
                          // Also sync with nonIdentifiableQuadrants
                          if (setNonIdentifiableQuadrants) {
                            const newNonIdentifiableSet = new Set(nonIdentifiableQuadrants || new Set());
                            if (e.target.checked) {
                              newNonIdentifiableSet.add(q);
                            } else {
                              newNonIdentifiableSet.delete(q);
                            }
                            setNonIdentifiableQuadrants(newNonIdentifiableSet);
                          }
                        }}
                        style={{ margin: 0 }}
                      />
                      <label htmlFor={`quadrant-${q}`} style={{ color: 'white', fontSize: '12px', margin: 0 }}>
                        Quadrant {q}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {showSpeedDropdown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap' }}>Speed:</label>
            <select
              value={scrollSpeed}
              onChange={e => setScrollSpeed(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', minWidth: 80 }}
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        )}
        {showSpacingSlider && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: 'white', marginRight: 4, whiteSpace: 'nowrap', fontSize: '14px' }}>Spacing:</label>
            <button
              onClick={() => setSpacing(Math.max(0, spacing - 1))}
              disabled={spacing === 0}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: spacing === 0 ? '#555' : '#333',
                color: 'white',
                border: '1px solid #555',
                cursor: spacing === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                height: '32px'
              }}
              title="Decrease spacing"
            >
              ←
            </button>
            <span style={{ color: 'white', fontSize: '14px', minWidth: 35, textAlign: 'center' }}>{spacing}%</span>
            <button
              onClick={() => setSpacing(Math.min(30, spacing + 1))}
              disabled={spacing === 30}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: spacing === 30 ? '#555' : '#333',
                color: 'white',
                border: '1px solid #555',
                cursor: spacing === 30 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                height: '32px'
              }}
              title="Increase spacing"
            >
              →
            </button>
          </div>
        )}
        <select 
          value={selectedFontSize}
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          style={{
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #555',
            minWidth: 60
          }}
        >
          {(fontSizeOptions || [80, 70, 60, 50]).map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        </div>
        {showPRLScrollButton && (
          <button
            onClick={onGoToPRLScroll}
            style={{
              marginLeft: 12,
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: '1px solid #3385ff',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Go to PRL Scroll test
          </button>
        )}
      </div>
    </div>
  );
}

// Function to generate eccentric test cases based on starting font size
function generateEccentricTestCases(startingSize) {
  const directions = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
  const testCases = [];
  
  for (let i = 0; i < 12; i++) {
    const size = startingSize - (i * 5);
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    testCases.push({ size, direction: randomDirection });
  }
  
  return testCases;
}

// Function to generate randomized PRL detection test cases
function generatePRLTestCases() {
  const directions = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
  const testCases = [];
  
  // Generate 24 test cases with decreasing font sizes
  for (let i = 0; i < 24; i++) {
    const size = 75 - (i * 3); // Start at 75px, decrease by 3 each time
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const cyclicQuadrant = (i % 4) + 1; // Cycles through 1, 2, 3, 4, 1, 2, 3, 4...
    
    testCases.push({ 
      size: Math.max(size, 8), // Ensure minimum size of 8px
      direction: randomDirection, 
      power_grid: cyclicQuadrant.toString()
    });
  }
  
  return testCases;
}

// Audio component to handle audio playback
function AudioPlayer({ src, onEnded, ref }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      // Preload the audio
      audioRef.current.load();
      // Play the audio
      audioRef.current.play().catch(error => {
        console.log("Audio playback failed:", error);
      });
    }
  }, [src]);

  return <audio ref={audioRef} src={src} onEnded={onEnded} preload="auto" />;
}

// Video component to handle video playback
function VideoPlayer({ src, onEnded, ref }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Preload the video
      videoRef.current.load();
      // Play the video
      videoRef.current.play().catch(error => {
        console.log("Video playback failed:", error);
      });
    }
  }, [src]);

  return <video ref={videoRef} src={src} onEnded={onEnded} preload="auto" />;
}

// Generate randomized PRL detection test cases
const testCases = generatePRLTestCases();

// Component to render the C overlay
function COverlay({ direction, size, power_grid, textColor = 'black' }) {
  const getRotation = () => {
    switch (direction) {
      case "ArrowRight": return "0deg";
      case "ArrowLeft": return "180deg";
      case "ArrowUp": return "270deg";
      case "ArrowDown": return "90deg";
      default: return "0deg";
    }
  };

  const getPosition = () => {
    // Grid positions (top, left percentages)
    const positions = {
      "1": { top: "25%", left: "50%" },    // Top-center
      "2": { top: "50%", left: "75%" },    // Center-right
      "3": { top: "75%", left: "50%" },    // Bottom-center
      "4": { top: "50%", left: "25%" }     // Center-left
    };
    return positions[power_grid] || { top: "50%", left: "50%" };
  };

  const position = getPosition();

  return (
    <div 
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: `translate(-50%, -50%) rotate(${getRotation()})`,
        fontSize: `${size}px`,
        fontFamily: 'sans-serif',
        color: textColor,
        fontWeight: 'bold',
        pointerEvents: 'none',
      }}
    >
      C
    </div>
  );
}

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
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    
    try {
      // Get all patients to check for case-insensitive name match
      const patientsRef = ref(database, 'patients');
      const snapshot = await get(patientsRef);
      
      let existingPatientKey = null;
      let existingPatientData = null;
      
      if (snapshot.exists()) {
        const patients = snapshot.val();
        // Check for case-insensitive name match
        existingPatientKey = Object.keys(patients).find(
          key => key.toLowerCase() === formData.name.toLowerCase()
        );
        
        if (existingPatientKey) {
          existingPatientData = patients[existingPatientKey];
        }
      }
      
      if (existingPatientData) {
        // Patient exists, navigate to existing results page
        // Use the original case from database for consistency
        const updatedFormData = { ...formData, name: existingPatientKey };
        localStorage.setItem("userData", JSON.stringify(updatedFormData));
        navigate("/existing-patient", { state: { patientData: existingPatientData } });
      } else {
        // New patient, proceed with registration
        localStorage.setItem("userData", JSON.stringify(formData));
        
        // Write patient registration data to Firebase
        const registrationRef = ref(database, `patients/${formData.name}/registrationDetails`);
        await set(registrationRef, {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          eye: formData.eye,
          spectacle: formData.spectacle,
          bcva: formData.bcva,
          contact: formData.contact,
          address: formData.address,
          registrationDate: getFormattedTimestamp()
        });
        
        navigate("/instructions");
      }
    } catch (error) {
      console.error("Error checking patient data:", error);
      // Fallback to normal registration flow
      localStorage.setItem("userData", JSON.stringify(formData));
      navigate("/instructions");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="centered-page">
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

          <button type="submit" disabled={isChecking}>
            {isChecking ? "Checking..." : "Start Test"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ExistingPatientPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientData = location.state?.patientData || {};
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleRetakePRL = () => {
    navigate("/instructions");
  };

  const handleContinueTraining = () => {
    // Check if there are existing test results to determine where to continue
    if (patientData.testResults) {
      // If there are test results, continue to eccentric training
      localStorage.setItem("selectedGrid", patientData.testResults.trainingQuadrant || "4");
      navigate("/eccentric-training");
    } else {
      // If no test results, start from PRL detection
      navigate("/instructions");
    }
  };

  return (
    <div className="centered-page">
      <div className="form-container" style={{ maxWidth: '800px' }}>
        <h1>Existing Patient Found</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          There is an existing entry under the name: <strong>{userData.name}</strong>
        </p>
        
        {patientData.registrationDetails && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Registration Details:</h3>
            <p><strong>Age:</strong> {patientData.registrationDetails.age}</p>
            <p><strong>Gender:</strong> {patientData.registrationDetails.gender}</p>
            <p><strong>Eye:</strong> {patientData.registrationDetails.eye}</p>
            <p><strong>Spectacle:</strong> {patientData.registrationDetails.spectacle}</p>
            {patientData.registrationDetails.bcva && (
              <p><strong>BCVA:</strong> {patientData.registrationDetails.bcva}</p>
            )}
            <p><strong>Contact:</strong> {patientData.registrationDetails.contact}</p>
            <p><strong>Registration Date:</strong> {patientData.registrationDetails.registrationDate}</p>
          </div>
        )}

        {patientData.testResults && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
            <h3>PRL Detection Results:</h3>
            <p><strong>Training Quadrant:</strong> {patientData.testResults.trainingQuadrant}</p>
            <p><strong>Letter Size:</strong> {patientData.testResults.letterSize}px</p>
            <p><strong>Central Dot Size:</strong> {patientData.testResults.centralDotSize}</p>
            <p><strong>Test End Date:</strong> {patientData.testResults.testEndDate}</p>
          </div>
        )}

        {patientData.trainingResults && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
            <h3>Training Results:</h3>
            <p><strong>Correct Responses:</strong> {patientData.trainingResults.evtCorrectResponses}</p>
            <p><strong>Wrong Responses:</strong> {patientData.trainingResults.evtWrongResponses}</p>
            <p><strong>Training End Date:</strong> {patientData.trainingResults.trainingEndDate}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
          <button 
            onClick={handleRetakePRL}
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Attempt PRL Detection Again
          </button>
          <button 
            onClick={handleContinueTraining}
            style={{ 
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Continue with Training
          </button>
        </div>
      </div>
    </div>
  );
}

function InstructionsPage() {
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload the audio to reduce delay
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  const handleAudioEnded = () => {
    setShowAudio(false);
    // Add a small delay before navigating to ensure audio is fully stopped
    setTimeout(() => {
      navigate("/test/0");
    }, 500);
  };

  return (
    <div className="centered-page">
      <div className="instructions-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        textAlign: 'center'
      }}>
        {showAudio && (
          // Plays intro.mp3 audio file when instructions page loads
          <AudioPlayer
            src="/intro.mp3"
            onEnded={handleAudioEnded}
            ref={audioRef}
          />
        )}
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '20px',
          maxWidth: '800px'
        }}>
          Please press the arrow indicating the direction of opening in the letter C
        </h1>
      </div>
    </div>
  );
}

function TestPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuadrant, setSelectedQuadrant] = useState("1");
  const [centralSpot, setCentralSpot] = useState("big");
  const [selectedChart, setSelectedChart] = useState("1");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [showCorrectAudio, setShowCorrectAudio] = useState(false);
  const [showWrongAudio, setShowWrongAudio] = useState(false);
  const correctAudioRef = useRef(null);
  const wrongAudioRef = useRef(null);
  
  // Adaptive testing state
  const [currentFontSize, setCurrentFontSize] = useState(testCases[0].size);
  // Track wrong attempts per quadrant and which quadrants are non-identifiable
  const [quadrantWrongAttempts, setQuadrantWrongAttempts] = useState({ '1': 0, '2': 0, '3': 0, '4': 0 });
  const [nonIdentifiableQuadrants, setNonIdentifiableQuadrants] = useState(new Set());
  const [quadrantBlur, setQuadrantBlur] = useState(new Set());
  const [quadrantBlurDropdownOpen, setQuadrantBlurDropdownOpen] = useState(false);
  // Track current direction for wrong responses - changes with each wrong attempt
  const [currentDirection, setCurrentDirection] = useState(testCases[0].direction);

  // Get unique font sizes from test cases for the dropdown
  const fontSizeOptions = [...new Set(testCases.map(tc => tc.size))].sort((a, b) => b - a);

  // Restore PRL detection state if returning from PRL Scroll Test
  useEffect(() => {
    const saved = localStorage.getItem('prlDetectionState');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (typeof s.currentIndex === 'number') setCurrentIndex(s.currentIndex);
        if (s.selectedQuadrant) setSelectedQuadrant(s.selectedQuadrant);
        if (s.centralSpot) setCentralSpot(s.centralSpot);
        if (s.selectedChart) setSelectedChart(s.selectedChart);
        if (typeof s.currentFontSize === 'number') setCurrentFontSize(s.currentFontSize);
        if (s.quadrantWrongAttempts) setQuadrantWrongAttempts(s.quadrantWrongAttempts);
        if (Array.isArray(s.nonIdentifiableQuadrants)) setNonIdentifiableQuadrants(new Set(s.nonIdentifiableQuadrants));
        if (Array.isArray(s.quadrantBlur)) setQuadrantBlur(new Set(s.quadrantBlur));
        if (s.currentDirection) setCurrentDirection(s.currentDirection);
      } catch {}
      localStorage.removeItem('prlDetectionState');
    }
  }, []);

  useEffect(() => {
    const findNextAvailableIndex = (fromIndex) => {
      for (let i = fromIndex + 1; i < testCases.length; i++) {
        const q = testCases[i].power_grid;
        if (!nonIdentifiableQuadrants.has(q)) {
          return i;
        }
      }
      return -1;
    };

    const handleKeyPress = (event) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(event.key)) {
        return; // Ignore non-arrow key presses
      }

      if (event.key === currentDirection) {
        setShowCorrectAudio(true);
        // Wait for audio to finish before proceeding
        setTimeout(() => {
          const nextIdx = findNextAvailableIndex(currentIndex);
          if (nextIdx !== -1) {
            setCurrentIndex(nextIdx);
            setSelectedQuadrant(testCases[nextIdx].power_grid);
            setCurrentFontSize(testCases[nextIdx].size);
            setCurrentDirection(testCases[nextIdx].direction);
          } else {
            navigate("/success");
          }
        }, 500); // Adjust timing based on audio length
      } else {
        setShowWrongAudio(true);
        const q = selectedQuadrant;
        const newCount = (quadrantWrongAttempts[q] || 0) + 1;
        setQuadrantWrongAttempts(prev => ({ ...prev, [q]: newCount }));

        const justBecameNonIdentifiable = newCount >= 5 && !nonIdentifiableQuadrants.has(q);

        // Immediately update direction and size for wrong response, then handle navigation logic
        if (justBecameNonIdentifiable) {
          // Mark quadrant as non-identifiable and jump to next available test case
          setNonIdentifiableQuadrants(prev => new Set(prev).add(q));
          setQuadrantBlur(prev => new Set(prev).add(q));
          const newNonIdentifiableSet = new Set([...nonIdentifiableQuadrants, q]);
          
          // If 3 quadrants are non-identifiable, end test and continue in remaining quadrant
          if (newNonIdentifiableSet.size >= 3) {
            const remainingQuadrant = ['1', '2', '3', '4'].find(q => !newNonIdentifiableSet.has(q));
            localStorage.setItem("selectedGrid", remainingQuadrant);
            
            // Store test results
            localStorage.setItem("testResults", JSON.stringify({
              letterSize: currentFontSize,
              centralDotSize: centralSpot
            }));
            
            setTimeout(() => {
              navigate(`/result/${remainingQuadrant}`);
            }, 1500);
          } else {
            setTimeout(() => {
              const nextIdx = findNextAvailableIndex(currentIndex);
              if (nextIdx !== -1) {
                setCurrentIndex(nextIdx);
                setSelectedQuadrant(testCases[nextIdx].power_grid);
                setCurrentFontSize(testCases[nextIdx].size);
                setCurrentDirection(testCases[nextIdx].direction);
              } else {
                navigate("/success");
              }
            }, 1500);
          }
        } else {
          // Increase font size and change direction for wrong response immediately
          setCurrentFontSize(prev => prev + 3);
          // Generate a new random direction for the wrong response
          const directions = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
          const newDirection = directions[Math.floor(Math.random() * directions.length)];
          setCurrentDirection(newDirection);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, currentIndex, testCases, selectedQuadrant, quadrantWrongAttempts, nonIdentifiableQuadrants, currentDirection]);

  // Get grid position (same as COverlay)
  const getPosition = () => {
    const positions = {
      "1": { top: "25%", left: "50%" },    // Top-center
      "2": { top: "50%", left: "75%" },    // Center-right
      "3": { top: "75%", left: "50%" },    // Bottom-center
      "4": { top: "50%", left: "25%" }    
       // Center-left
    };
    return positions[selectedQuadrant] || { top: "50%", left: "50%" };
  };

  const position = getPosition();
  const isDarkChart = ["3", "4", "5", "7"].includes(selectedChart);
  const overlayTextColor = ["3", "4", "5", "7"].includes(selectedChart) ? 'white' : 'black';

  return (
    <div className="test-container">
      {showCorrectAudio && (
        <AudioPlayer
          src="/correct_direction.mp3"
          onEnded={() => setShowCorrectAudio(false)}
          ref={correctAudioRef}
        />
      )}
      {showWrongAudio && (
        <AudioPlayer
          src="/wrong_direction.mp3"
          onEnded={() => setShowWrongAudio(false)}
          ref={wrongAudioRef}
        />
      )}
      <AppBar 
        patientName={userData.name || "Unknown"} 
        onFontSizeChange={setCurrentFontSize}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
        fontSizeOptions={fontSizeOptions}
        selectedFontSize={currentFontSize}
        centralSpot={centralSpot}
        setCentralSpot={setCentralSpot}
        showCentralSpot={true}
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
        showChartDropdown={true}
        quadrantBlur={quadrantBlur}
        setQuadrantBlur={setQuadrantBlur}
        showQuadrantBlurDropdown={true}
        quadrantBlurDropdownOpen={quadrantBlurDropdownOpen}
        setQuadrantBlurDropdownOpen={setQuadrantBlurDropdownOpen}
        nonIdentifiableQuadrants={nonIdentifiableQuadrants}
        setNonIdentifiableQuadrants={setNonIdentifiableQuadrants}
        showPRLScrollButton={true}
        onGoToPRLScroll={() => {
          // Save PRL detection state before navigating
          const stateToSave = {
            currentIndex,
            selectedQuadrant,
            centralSpot,
            selectedChart,
            currentFontSize,
            quadrantWrongAttempts,
            nonIdentifiableQuadrants: Array.from(nonIdentifiableQuadrants),
            quadrantBlur: Array.from(quadrantBlur),
            currentDirection
          };
          localStorage.setItem('prlDetectionState', JSON.stringify(stateToSave));
          navigate('/prl-scroll-test');
        }}
      />
      <div style={{ marginTop: '60px' }}>
        <h1 className="test-title">PRL Detection</h1>
        <p className="test-instruction">Press the direction of opening in C using the arrow keys.</p>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={["1","2","3","7"].includes(String(selectedChart))
              ? `/charts/Chart_${selectedChart}_new.png`
              : `/charts/Chart${selectedChart}.png`}
            alt="Grid"
            className="test-image"
          />
          {/* Quadrant blur overlays for non-identifiable quadrants */}
          {Array.from(quadrantBlur).map(quadrant => {
            const rotations = {
              '1': '270deg',    // Top-center
              '2': '0deg',   // Center-right  
              '3': '90deg',  // Bottom-center
              '4': '180deg'   // Center-left
            };
            
            const offsets = {
              '1': '7px',    // Offset down by 5px
              '2': '0px',    // No offset
              '3': '-7px',   // Offset up by 5px
              '4': '0px'     // No offset
            };
            
            return (
              <div
                key={quadrant}
                style={{
                  position: "absolute",
                  inset: 0, // shorthand for top:0, right:0, bottom:0, left:0
                  backgroundImage: `url("/charts/quadrant_blur.png")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  transform: `rotate(${rotations[quadrant]})`,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            );
          })}
          {/* Central spot */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
              height: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
              borderRadius: '50%',
              backgroundColor: isDarkChart ? 'white' : 'black',
              pointerEvents: 'none',
            }}
          />
          {!quadrantBlur.has(selectedQuadrant) && !nonIdentifiableQuadrants.has(selectedQuadrant) && (
            <div 
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: `translate(-50%, -50%) rotate(${
                  currentDirection === "ArrowRight" ? "0deg" :
                  currentDirection === "ArrowLeft" ? "180deg" :
                  currentDirection === "ArrowUp" ? "270deg" :
                  "90deg"
                })`,
                fontSize: `${currentFontSize}px`,
                fontFamily: 'sans-serif',
                color: overlayTextColor,
                fontWeight: 'bold',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              C
            </div>
          )}
        </div>
        <div style={{marginTop: 20, color: '#888'}}>
          Test {currentIndex + 1} of {testCases.length} | 
          Font Size: {currentFontSize}px | 
          Wrong Attempts in Quadrant {selectedQuadrant}: {quadrantWrongAttempts[selectedQuadrant] || 0}/5
          {Array.from(nonIdentifiableQuadrants).length > 0 && (
            <span style={{ marginLeft: 12 }}>
              Non identifiable: {Array.from(nonIdentifiableQuadrants).sort().join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultPage() {
  const { power_grid } = useParams();
  const navigate = useNavigate();
  const [showGridAudio, setShowGridAudio] = useState(true);
  const audioRef = useRef(null);

  // Map the mistaken quadrant to the training quadrant (add 2 to power_grid)
  const quadrantMap = { '1': '3', '2': '4', '3': '1', '4': '2' };
  const trainingQuadrant = quadrantMap[power_grid] || power_grid;

  // Add 1 to power_grid for audio file
  const audioGrid = (parseInt(power_grid) + 1).toString();

  useEffect(() => {
    // Preload the audio to reduce delay
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  const handleEccentricTraining = () => {
    localStorage.setItem("selectedGrid", trainingQuadrant);
    
    // Get user data and test results
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const testResults = JSON.parse(localStorage.getItem("testResults") || "{}");
    
    // Write test results to Firebase
    const testResultsRef = ref(database, `patients/${userData.name}/testResults`);
    set(testResultsRef, {
      trainingQuadrant: trainingQuadrant,
      letterSize: testResults.letterSize || 0,
      centralDotSize: testResults.centralDotSize || "big",
      testEndDate: getFormattedTimestamp()
    }).catch((error) => {
      console.error("Error writing test results:", error);
    });
    
    navigate("/eccentric-training");
  };

  // Also update selectedGrid in localStorage immediately so other pages use the mapped quadrant
  React.useEffect(() => {
    localStorage.setItem("selectedGrid", trainingQuadrant);
  }, [trainingQuadrant]);

  return (
    <div className="result-container">
      {showGridAudio && (
        // Plays grid-specific audio file based on the power_grid
        <AudioPlayer
          src={`/grid${audioGrid}.mp3`}
          onEnded={() => setShowGridAudio(false)}
          ref={audioRef}
        />
      )}
      <h1>KEEP YOUR VISUAL ATTENTION TO QUADRANT {trainingQuadrant} FOR FURTHER TRAINING</h1>
      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }} onClick={() => navigate("/test/0")}>Restart</button>
        <button style={{ marginRight: "10px" }} onClick={handleEccentricTraining}>Go to Eccentric View Training</button>
        <button onClick={() => navigate("/scroll-text-training")}>Go to Scroll Text Training</button>
      </div>
    </div>
  );  
}

function SuccessPage() {
  const navigate = useNavigate();
  const [showGridAudio, setShowGridAudio] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload the audio to reduce delay
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  return (
    <div className="success-container">
      {showGridAudio && (
        // Plays grid4.mp3 audio file for success page
        <AudioPlayer
          src="/grid2.mp3"
          onEnded={() => setShowGridAudio(false)}
          ref={audioRef}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>You will continue the training in Grid 2.</h1>
        <div style={{ marginTop: "20px" }}>
          <button style={{ marginRight: "10px" }} onClick={() => navigate("/test/0")}>Restart</button>
          <button onClick={() => window.location.href = "/eccentric-training"}>Go to Eccentric View Training</button>
        </div>
      </div>
    </div>
  );
}

function EccentricViewTraining() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFontSize, setSelectedFontSize] = useState(80);
  const [eccentricTestCases, setEccentricTestCases] = useState(generateEccentricTestCases(80));
  const selectedGrid = localStorage.getItem("selectedGrid") || "4";
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [runCount, setRunCount] = useState(0);
  const [correctRuns, setCorrectRuns] = useState(0);
  const [mistakeRuns, setMistakeRuns] = useState(0);
  const [testActive, setTestActive] = useState(true);
  const [selectedQuadrant, setSelectedQuadrant] = useState(selectedGrid);
  const [stimulusDuration, setStimulusDuration] = useState('infinite');
  const [showLetter, setShowLetter] = useState(true);
  const [centralSpot, setCentralSpot] = useState("big");
  const [selectedChart, setSelectedChart] = useState("1");
  const [showCorrectAudio, setShowCorrectAudio] = useState(false);
  const [showWrongAudio, setShowWrongAudio] = useState(false);
  const correctAudioRef = useRef(null);
  const wrongAudioRef = useRef(null);
  const timerRef = useRef(null);
  const [quadrantBlur, setQuadrantBlur] = useState(new Set());
  const [quadrantBlurDropdownOpen, setQuadrantBlurDropdownOpen] = useState(false);
  const [nonIdentifiableQuadrants, setNonIdentifiableQuadrants] = useState(new Set());
  // Track current direction for wrong responses - changes with each wrong attempt
  const [currentDirection, setCurrentDirection] = useState(eccentricTestCases[0]?.direction || "ArrowRight");

  // Generate font size options from 80 to 30 in decrements of 10
  const fontSizeOptions = [80, 70, 60, 50, 40, 30];

  useEffect(() => {
    const newTestCases = generateEccentricTestCases(selectedFontSize);
    setEccentricTestCases(newTestCases);
    setCurrentDirection(newTestCases[currentIndex]?.direction || "ArrowRight");
  }, [selectedFontSize, currentIndex]);

  // Reset showLetter and timer on new test case or duration change
  useEffect(() => {
    setShowLetter(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (stimulusDuration !== 'infinite') {
      timerRef.current = setTimeout(() => setShowLetter(false), parseInt(stimulusDuration, 10) * 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIndex, eccentricTestCases, stimulusDuration]);

  useEffect(() => {
    if (!testActive) return;
    const handleKeyPress = (event) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!arrowKeys.includes(event.key)) {
        return;
      }
      if (event.key === currentDirection) {
        // Correct key
        setShowCorrectAudio(true);
        setTimeout(() => {
          if (eccentricTestCases[currentIndex].size === 10) {
            setCorrectRuns(prev => prev + 1);
            setRunCount(prev => prev + 1);
            resetTest();
          } else if (currentIndex + 1 < eccentricTestCases.length) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setCorrectRuns(prev => prev + 1);
            setRunCount(prev => prev + 1);
            resetTest();
          }
        }, 500); // Adjust timing based on audio length
      } else {
        setShowWrongAudio(true);
        // Immediately increase font size and change direction for wrong response
        setSelectedFontSize(prev => Math.min(prev + 5, 120)); // Increase by 5, cap at 120
        // Generate a new random direction for the wrong response
        const directions = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
        const newDirection = directions[Math.floor(Math.random() * directions.length)];
        setCurrentDirection(newDirection);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, currentIndex, eccentricTestCases, testActive, currentDirection]);

  useEffect(() => {
    if (runCount >= 5) {
      setTestActive(false);
      localStorage.setItem("eccentricStats", JSON.stringify({ correctRuns, mistakeRuns }));
      navigate("/eccentric-stats");
    }
  }, [runCount, correctRuns, mistakeRuns, navigate]);

  function resetTest() {
    setCurrentIndex(0);
    setSelectedFontSize(80);
    const newTestCases = generateEccentricTestCases(80);
    setEccentricTestCases(newTestCases);
    setCurrentDirection(newTestCases[0]?.direction || "ArrowRight");
  }

  return (
    <div className="test-container">
      {showCorrectAudio && (
        <AudioPlayer
          src="/correct_direction.mp3"
          onEnded={() => setShowCorrectAudio(false)}
          ref={correctAudioRef}
        />
      )}
      {showWrongAudio && (
        <AudioPlayer
          src="/wrong_direction.mp3"
          onEnded={() => setShowWrongAudio(false)}
          ref={wrongAudioRef}
        />
      )}
      <AppBar 
        patientName={userData.name || "Unknown"} 
        onFontSizeChange={setSelectedFontSize}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
        duration={stimulusDuration}
        setDuration={setStimulusDuration}
        showDurationDropdown={true}
        centralSpot={centralSpot}
        setCentralSpot={setCentralSpot}
        showCentralSpot={true}
        fontSizeOptions={fontSizeOptions}
        selectedFontSize={selectedFontSize}
        quadrantBlur={quadrantBlur}
        setQuadrantBlur={setQuadrantBlur}
        showQuadrantBlurDropdown={true}
        quadrantBlurDropdownOpen={quadrantBlurDropdownOpen}
        setQuadrantBlurDropdownOpen={setQuadrantBlurDropdownOpen}
        nonIdentifiableQuadrants={nonIdentifiableQuadrants}
        setNonIdentifiableQuadrants={setNonIdentifiableQuadrants}
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
        showChartDropdown={true}
      />
      <div style={{ marginTop: '60px' }}>
        <h1 className="test-title">Eccentric View Training</h1>
        <p className="test-instruction">Press the direction of opening in C using the arrow keys.</p>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={["1","2","3","7"].includes(String(selectedChart))
              ? `/charts/Chart_${selectedChart}_new.png`
              : `/charts/Chart${selectedChart}.png`}
            alt="Grid"
            className="test-image"
          />
          {/* Quadrant blur overlays for non-identifiable quadrants */}
          {Array.from(quadrantBlur).map(quadrant => {
            const rotations = {
              '1': '270deg',    // Top-center
              '2': '0deg',   // Center-right  
              '3': '90deg',  // Bottom-center
              '4': '180deg'   // Center-left
            };
            
            const offsets = {
              '1': '7px',    // Offset down by 5px
              '2': '0px',    // No offset
              '3': '-7px',   // Offset up by 5px
              '4': '0px'     // No offset
            };
            
            return (
              <img 
                key={quadrant}
                src="/charts/quadrant_blur.png" 
                alt={`Quadrant ${quadrant} Blur`} 
                className="test-image"
                style={{
                  position: 'absolute',
                  top: offsets[quadrant],
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  transform: `rotate(${rotations[quadrant]})`,
                  zIndex: 1,
                }}
              />
            );
          })}
          {/* Central spot */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
              height: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
              borderRadius: '50%',
              backgroundColor: ["3","4","5","7"].includes(selectedChart) ? 'white' : 'black',
              
              pointerEvents: 'none',
            }}
          />
          {showLetter && !quadrantBlur.has(selectedQuadrant) && !nonIdentifiableQuadrants.has(selectedQuadrant) && (
            <COverlay 
              direction={currentDirection} 
              size={eccentricTestCases[currentIndex].size} 
              power_grid={selectedQuadrant}
              textColor={["3","4","5","7"].includes(selectedChart) ? 'white' : 'black'}
            />
          )}
        </div>
        <div style={{marginTop: 20, color: '#888'}}>Test {runCount + 1} of 5</div>
      </div>
    </div>
  );
}

function EccentricResultPage() {
  const navigate = useNavigate();
  const selectedGrid = localStorage.getItem("selectedGrid") || "4";
  const [selectedChart, setSelectedChart] = useState("1");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFontSize, setSelectedFontSize] = useState(80);
  const [showLetter, setShowLetter] = useState('C'); // 'C' or 'E'
  const [currentDirection, setCurrentDirection] = useState('');
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // Get grid position (same as COverlay)
  const getPosition = () => {
    const positions = {
      "1": { top: "25%", left: "50%" },    // Top-center
      "2": { top: "50%", left: "58%" },    // Center-right (was 60%)
      "3": { top: "75%", left: "50%" },    // Bottom-center
      "4": { top: "50%", left: "43%" }     // Center-left (was 40%)
    };
    return positions[selectedGrid] || { top: "50%", left: "50%" };
  };
  const position = getPosition();

  // Generate random direction
  useEffect(() => {
    const directions = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    setCurrentDirection(randomDirection);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(event.key)) {
        return;
      }

      if (event.key === currentDirection) {
        // Correct direction pressed
        setCurrentIndex(currentIndex + 1);
        setSelectedFontSize(prevSize => prevSize - 5);
        // Toggle between C and E
        setShowLetter(prev => prev === 'C' ? 'E' : 'C');
      } else {
        // Wrong direction pressed, restart
        navigate("/eccentric-result");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, currentDirection, currentIndex]);

  return (
    <div className="test-container">
      <AppBar 
        patientName={userData.name || "Unknown"} 
        onFontSizeChange={setSelectedFontSize}
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
        showChartDropdown={true}
      />
      <div style={{ marginTop: '60px' }}>
        <h1 className="test-title">Eccentric View Training</h1>
        <p className="test-instruction">Press the direction of opening in {showLetter} using the arrow keys.</p>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={["1","2","3","7"].includes(String(selectedChart))
              ? `/charts/Chart_${selectedChart}_new.png`
              : `/charts/Chart${selectedChart}.png`}
            alt="Grid"
            className="test-image"
          />
          <div 
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              transform: `translate(-50%, -50%) rotate(${
                currentDirection === "ArrowRight" ? "0deg" :
                currentDirection === "ArrowLeft" ? "180deg" :
                currentDirection === "ArrowUp" ? "270deg" :
                "90deg"
              })`,
              fontSize: `${selectedFontSize}px`,
              fontFamily: 'sans-serif',
              color: ["3","4","5","7"].includes(selectedChart) ? 'white' : 'black',
              fontWeight: 'bold'
            }}
          >
            {showLetter}
          </div>
        </div>
      </div>
    </div>
  );
}

function EccentricSuccessPage() {
  const navigate = useNavigate();
  const selectedGrid = localStorage.getItem("selectedGrid") || "4";

  return (
    <div className="success-container">
      <h1>Congratulations! You have completed the Eccentric View Training in Grid {selectedGrid}.</h1>
      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }} onClick={() => navigate("/eccentric-training")}>Restart Training</button>
        <button onClick={() => navigate("/")}>Back to Registration</button>
      </div>
    </div>
  );
}

// New stats page
function EccentricStatsPage() {
  const navigate = useNavigate();
  const stats = JSON.parse(localStorage.getItem("eccentricStats") || "{\"correctRuns\":0,\"mistakeRuns\":0}");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const testResults = JSON.parse(localStorage.getItem("testResults") || "{}");
  const selectedGrid = localStorage.getItem("selectedGrid") || "4";
  
  // Write training results to Firebase
  useEffect(() => {
    const trainingResultsRef = ref(database, `patients/${userData.name}/trainingResults`);
    set(trainingResultsRef, {
      evtCorrectResponses: stats.correctRuns,
      evtWrongResponses: stats.mistakeRuns,
      trainingEndDate: getFormattedTimestamp()
    }).catch((error) => {
      console.error("Error writing training results:", error);
    });
  }, [userData, stats]);
  return (
    <div className="result-container">
      <h1>Eccentric Training Results</h1>
      <p>Tests completed correctly: <b>{stats.correctRuns}</b></p>
      <p>Tests ended due to mistake: <b>{stats.mistakeRuns}</b></p>
      <button onClick={() => navigate("/eccentric-training")}>Restart Training</button>
      <button style={{marginLeft: 10}} onClick={() => navigate("/")}>Back to Registration</button>
      <button style={{marginLeft: 10}} onClick={() => navigate("/scroll-text-training")}>Go to Scroll Text Training</button>
    </div>
  );
}

// Placeholder for Scroll Text Training page
function ScrollTextTrainingPage() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const [selectedQuadrant, setSelectedQuadrant] = React.useState("4");
  const [scrollSpeed, setScrollSpeed] = React.useState("medium");
  const [selectedFontSize, setSelectedFontSize] = React.useState(80);
  const [centralSpot, setCentralSpot] = React.useState("big");
  const [spacing, setSpacing] = React.useState(8);
  const [position, setPosition] = React.useState(0);
  const containerRef = React.useRef(null);
  const textRef = React.useRef(null);

  const text = "Max set off early in the morning, his backpack full of supplies.  " +
    "He crossed rivers and climbed mountains, determined to find the hidden cave.  " +
    "After 3 days of searching, he saw the entrance through thick trees.  " +
    "Inside the cave, he discovered sparkling crystals that lit in the dark.  " +
    "Suddenly, he heard a noise—it was a bear, guarding the treasure!  " +
    "Max stayed calm and carefully backed out of the cave with treasure untouched.  " +
    "He returned home, after having the adventure he'd never forget.  ";

  // Map speed to pixels per frame
  const speedMap = { slow: 2, medium: 3.5, fast: 4.5 };
  const pixelsPerFrame = speedMap[scrollSpeed] || 2;

  React.useEffect(() => {
    let animationFrameId;
    let lastTimestamp;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > 16) { // approximately 60fps
        setPosition(prev => {
          const newPosition = prev - pixelsPerFrame;
          const containerWidth = containerRef.current?.offsetWidth || 0;
          const textWidth = textRef.current?.offsetWidth || 0;
          
          // Reset position when text is completely off screen
          if (newPosition < -textWidth) {
            return containerWidth;
          }
          return newPosition;
        });
        lastTimestamp = timestamp;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pixelsPerFrame]);

  // Container layout logic for scroll box + spacer + dot
  const getContainerLayout = () => {
    switch (selectedQuadrant) {
      case "1": // Above the scroll text box (Top-center)
        return {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['dot', 'spacer', 'scrollBox']
        };
      case "2": // To the right of the scroll text box (Center-right)
        return {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['scrollBox', 'spacer', 'dot']
        };
      case "3": // Below the scroll text box (Bottom-center)
        return {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['scrollBox', 'spacer', 'dot']
        };
      case "4": // To the left of the scroll text box (Center-left)
        return {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['dot', 'spacer', 'scrollBox']
        };
      default:
        return {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['scrollBox', 'spacer', 'dot']
        };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e5e5e5' }}>
      <AppBar
        patientName={userData.name || "Unknown"}
        onFontSizeChange={setSelectedFontSize}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
        scrollSpeed={scrollSpeed}
        setScrollSpeed={setScrollSpeed}
        showSpeedDropdown={true}
        fontSizeOptions={[80, 70, 60, 50, 40, 30, 20]}
        selectedFontSize={selectedFontSize}
        showCentralSpot={true}
        centralSpot={centralSpot}
        setCentralSpot={setCentralSpot}
        spacing={spacing}
        setSpacing={setSpacing}
        showSpacingSlider={true}
      />
      <div style={{
        width: '100vw',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Main flex container that scales with screen */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '85vw',
          height: '85vh',
        }}>
          {/* Container with scroll box + spacer + dot layout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: getContainerLayout().flexDirection,
            gap: 0,
            width: '100%',
            height: '100%',
          }}>
            {/* Dot component */}
            <div
              style={{
                // Spot sizes: big = 115px, medium = 85px, small = 60px
                width: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
                height: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
                borderRadius: '50%',
                background: 'black',
                flexShrink: 0,
                order: getContainerLayout().order.indexOf('dot'),
              }}
            />
            
            {/* Spacer element */}
            <div
              style={{
                width: getContainerLayout().flexDirection === 'row' ? (spacing === 0 ? '0px' : `${spacing}%`) : '0px',
                height: getContainerLayout().flexDirection === 'column' ? (spacing === 0 ? '0px' : `${spacing}%`) : '0px',
                flexShrink: 0,
                order: getContainerLayout().order.indexOf('spacer'),
              }}
            />
            
            {/* Scrolling text box */}
            <div 
              ref={containerRef}
              style={{
                width: getContainerLayout().flexDirection === 'row' ? '60%' : '80%',
                height: '15%',
                background: '#ffe066',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
                flexShrink: 0,
                order: getContainerLayout().order.indexOf('scrollBox'),
              }}
            >
              <div
                ref={textRef}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: selectedFontSize,
                  color: 'black',
                  fontWeight: 'bold',
                  position: 'absolute',
                  left: `${position}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {text}
              </div>
            </div>
          </div>
        </div>
        
        {/* Go to EVT Training button */}
        <button
          onClick={() => {
            navigate('/eccentric-training');
          }}
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            zIndex: 3,
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Go to EVT Training
        </button>
      </div>
    </div>
  );
}

// PRL Scroll Test page (replica of ScrollTextTrainingPage with resume button)
function PRLScrollTestPage() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [selectedQuadrant, setSelectedQuadrant] = React.useState("4");
  const [scrollSpeed, setScrollSpeed] = React.useState("medium");
  const [selectedFontSize, setSelectedFontSize] = React.useState(80);
  const [centralSpot, setCentralSpot] = React.useState("big");
  const [spacing, setSpacing] = React.useState(8);
  const [position, setPosition] = React.useState(0);
  const containerRef = React.useRef(null);
  const textRef = React.useRef(null);

  const text = "Max set off early in the morning, his backpack full of supplies.  " +
    "He crossed rivers and climbed mountains, determined to find the hidden cave.  " +
    "After 3 days of searching, he saw the entrance through thick trees.  " +
    "Inside the cave, he discovered sparkling crystals that lit in the dark.  " +
    "Suddenly, he heard a noise—it was a bear, guarding the treasure!  " +
    "Max stayed calm and carefully backed out of the cave with treasure untouched.  " +
    "He returned home, after having the adventure he'd never forget.  ";

  const speedMap = { slow: 2, medium: 3.5, fast: 4.5 };
  const pixelsPerFrame = speedMap[scrollSpeed] || 2;

  React.useEffect(() => {
    let animationFrameId;
    let lastTimestamp;
    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      if (elapsed > 16) {
        setPosition(prev => {
          const newPosition = prev - pixelsPerFrame;
          const containerWidth = containerRef.current?.offsetWidth || 0;
          const textWidth = textRef.current?.offsetWidth || 0;
          if (newPosition < -textWidth) {
            return containerWidth;
          }
          return newPosition;
        });
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pixelsPerFrame]);

  // Container layout logic for scroll box + spacer + dot
  const getContainerLayout = () => {
    switch (selectedQuadrant) {
      case "1": // Above the scroll text box (Top-center)
        return {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['dot', 'spacer', 'scrollBox']
        };
      case "2": // To the right of the scroll text box (Center-right)
        return {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['scrollBox', 'spacer', 'dot']
        };
      case "3": // Below the scroll text box (Bottom-center)
        return {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['scrollBox', 'spacer', 'dot']
        };
      case "4": // To the left of the scroll text box (Center-left)
        return {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['dot', 'spacer', 'scrollBox']
        };
      default:
        return {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          order: ['scrollBox', 'spacer', 'dot']
        };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e5e5e5' }}>
      <AppBar
        patientName={userData.name || "Unknown"}
        onFontSizeChange={setSelectedFontSize}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
        scrollSpeed={scrollSpeed}
        setScrollSpeed={setScrollSpeed}
        showSpeedDropdown={true}
        fontSizeOptions={[80, 70, 60, 50, 40, 30, 20]}
        selectedFontSize={selectedFontSize}
        showCentralSpot={true}
        centralSpot={centralSpot}
        setCentralSpot={setCentralSpot}
        spacing={spacing}
        setSpacing={setSpacing}
        showSpacingSlider={true}
      />
      <div style={{
        width: '100vw',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Main flex container that scales with screen */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '85vw',
          height: '85vh',
        }}>
          {/* Container with scroll box + spacer + dot layout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: getContainerLayout().flexDirection,
            gap: 0,
            width: '100%',
            height: '100%',
          }}>
            {/* Dot component */}
            <div
              style={{
                // Spot sizes: big = 115px, medium = 85px, small = 60px
                width: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
                height: centralSpot === "big" ? '115px' : centralSpot === "medium" ? '85px' : '60px',
                borderRadius: '50%',
                background: 'black',
                flexShrink: 0,
                order: getContainerLayout().order.indexOf('dot'),
              }}
            />
            
            {/* Spacer element */}
            <div
              style={{
                width: getContainerLayout().flexDirection === 'row' ? (spacing === 0 ? '0px' : `${spacing}%`) : '0px',
                height: getContainerLayout().flexDirection === 'column' ? (spacing === 0 ? '0px' : `${spacing}%`) : '0px',
                flexShrink: 0,
                order: getContainerLayout().order.indexOf('spacer'),
              }}
            />
            
            {/* Scrolling text box */}
            <div 
              ref={containerRef}
              style={{
                width: getContainerLayout().flexDirection === 'row' ? '60%' : '80%',
                height: '15%',
                background: '#ffe066',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
                flexShrink: 0,
                order: getContainerLayout().order.indexOf('scrollBox'),
              }}
            >
              <div
                ref={textRef}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: selectedFontSize,
                  color: 'black',
                  fontWeight: 'bold',
                  position: 'absolute',
                  left: `${position}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {/* Title adjusted for PRL Scroll Test */}
                PRL scroll test — {text}
              </div>
            </div>
          </div>
        </div>
        
        {/* Resume button */}
        <button
          onClick={() => {
            navigate('/test/0');
          }}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            zIndex: 3
          }}
        >
          Go back to PRL Detection
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/existing-patient" element={<ExistingPatientPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/test/:index" element={<TestPageWrapper />} />
        <Route path="/result/:power_grid" element={<ResultPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/eccentric-training" element={<EccentricViewTraining />} />
        <Route path="/eccentric-result" element={<EccentricResultPage />} />
        <Route path="/eccentric-success" element={<EccentricSuccessPage />} />
        <Route path="/eccentric-stats" element={<EccentricStatsPage />} />
        <Route path="/scroll-text-training" element={<ScrollTextTrainingPage />} />
        <Route path="/prl-scroll-test" element={<PRLScrollTestPage />} />
      </Routes>
    </Router>
  );
}

// Wrapper for test page route params
function TestPageWrapper() {
  const { index } = useParams();
  return <TestPage index={parseInt(index, 10)} />;
}