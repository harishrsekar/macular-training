import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./styles.css"; 

// AppBar component
function AppBar({ patientName, onFontSizeChange, selectedQuadrant, setSelectedQuadrant, duration, setDuration, showDurationDropdown = false, scrollSpeed, setScrollSpeed, showSpeedDropdown = false, fontSizeOptions, selectedFontSize, centralSpot, setCentralSpot, showCentralSpot = false }) {
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

// Define test cases with progressive sizes and cycling directions
const testCases = [
  { size: 52, direction: "ArrowRight", power_grid: "1" },
  { size: 45, direction: "ArrowLeft", power_grid: "2" },
  { size: 30, direction: "ArrowDown", power_grid: "3" },
  { size: 26, direction: "ArrowLeft", power_grid: "4" },
  { size: 23, direction: "ArrowRight", power_grid: "1" },
  { size: 20, direction: "ArrowDown", power_grid: "2" },
  { size: 18, direction: "ArrowLeft", power_grid: "3" },
  { size: 16, direction: "ArrowUp", power_grid: "4" },
  { size: 14, direction: "ArrowRight", power_grid: "1" },
  { size: 12, direction: "ArrowLeft", power_grid: "2" },
  { size: 10, direction: "ArrowRight", power_grid: "3" },
  { size: 8, direction: "ArrowDown", power_grid: "4" },
];

// Component to render the C overlay
function COverlay({ direction, size, power_grid }) {
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
        color: 'black',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formData)); // Store user data
    navigate("/instructions"); // Navigate to instructions page first
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

          <button type="submit">Start Test</button>
        </form>
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
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [showCorrectAudio, setShowCorrectAudio] = useState(false);
  const [showWrongAudio, setShowWrongAudio] = useState(false);
  const correctAudioRef = useRef(null);
  const wrongAudioRef = useRef(null);

  // Get unique font sizes from test cases for the dropdown
  const fontSizeOptions = [...new Set(testCases.map(tc => tc.size))].sort((a, b) => b - a);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      if (!arrowKeys.includes(event.key)) {
        return; // Ignore non-arrow key presses
      }

      if (event.key === testCases[currentIndex].direction) {
        setShowCorrectAudio(true);
        // Wait for audio to finish before proceeding
        setTimeout(() => {
          if (currentIndex + 1 < testCases.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedQuadrant(testCases[currentIndex + 1].power_grid);
          } else {
            navigate("/success");
          }
        }, 500); // Adjust timing based on audio length
      } else {
        setShowWrongAudio(true);
        // Wait for 2 seconds before navigating to result page
        setTimeout(() => {
          navigate(`/result/${testCases[currentIndex].power_grid}`);
        }, 1500); // 2 second delay for wrong answer
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, currentIndex, testCases]);

  // Get grid position (same as COverlay)
  const getPosition = () => {
    const positions = {
      "1": { top: "25%", left: "50%" },    // Top-center
      "2": { top: "50%", left: "75%" },    // Center-right
      "3": { top: "75%", left: "50%" },    // Bottom-center
      "4": { top: "50%", left: "25%" }     // Center-left
    };
    return positions[selectedQuadrant] || { top: "50%", left: "50%" };
  };

  const position = getPosition();

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
        onFontSizeChange={() => {}} // Disable font size changes
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
        fontSizeOptions={fontSizeOptions}
        selectedFontSize={testCases[currentIndex].size}
        centralSpot={centralSpot}
        setCentralSpot={setCentralSpot}
        showCentralSpot={true}
      />
      <div style={{ marginTop: '60px' }}>
        <h1 className="test-title">PRL Detection</h1>
        <p className="test-instruction">Press the direction of opening in C using the arrow keys.</p>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img src="/empty_grid.png" alt="Grid" className="test-image" />
          {/* Central spot */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: centralSpot === "big" ? '80px' : centralSpot === "medium" ? '60px' : '20px',
              height: centralSpot === "big" ? '80px' : centralSpot === "medium" ? '60px' : '20px',
              borderRadius: '50%',
              backgroundColor: 'black',
              pointerEvents: 'none',
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              transform: `translate(-50%, -50%) rotate(${
                testCases[currentIndex].direction === "ArrowRight" ? "0deg" :
                testCases[currentIndex].direction === "ArrowLeft" ? "180deg" :
                testCases[currentIndex].direction === "ArrowUp" ? "270deg" :
                "90deg"
              })`,
              fontSize: `${testCases[currentIndex].size}px`,
              fontFamily: 'sans-serif',
              color: 'black',
              fontWeight: 'bold',
              pointerEvents: 'none',
            }}
          >
            C
          </div>
        </div>
        <div style={{marginTop: 20, color: '#888'}}>Test {currentIndex + 1} of {testCases.length}</div>
      </div>
    </div>
  );
}

function ResultPage() {
  const { power_grid } = useParams();
  const navigate = useNavigate();
  const [showGridAudio, setShowGridAudio] = useState(true);
  const audioRef = useRef(null);

  // Map the mistaken quadrant to the training quadrant
  const quadrantMap = { '1': '2', '2': '3', '3': '4', '4': '1' };
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
        <button onClick={handleEccentricTraining}>Go to Eccentric View Training</button>
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
  const [showCorrectAudio, setShowCorrectAudio] = useState(false);
  const [showWrongAudio, setShowWrongAudio] = useState(false);
  const correctAudioRef = useRef(null);
  const wrongAudioRef = useRef(null);
  const timerRef = useRef(null);

  // Generate font size options from 80 to 30 in decrements of 10
  const fontSizeOptions = [80, 70, 60, 50, 40, 30];

  useEffect(() => {
    setEccentricTestCases(generateEccentricTestCases(selectedFontSize));
  }, [selectedFontSize]);

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
      if (event.key === eccentricTestCases[currentIndex].direction) {
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
        setTimeout(() => {
          setMistakeRuns(prev => prev + 1);
          setRunCount(prev => prev + 1);
          resetTest();
        }, 500); // Adjust timing based on audio length
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, currentIndex, eccentricTestCases, testActive]);

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
    setEccentricTestCases(generateEccentricTestCases(80));
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
      />
      <div style={{ marginTop: '60px' }}>
        <h1 className="test-title">Eccentric View Training</h1>
        <p className="test-instruction">Press the direction of opening in C using the arrow keys.</p>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img src="/empty_grid.png" alt="Grid" className="test-image" />
          {/* Central spot */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: centralSpot === "big" ? '70px' : centralSpot === "medium" ? '50px' : '20px',
              height: centralSpot === "big" ? '70px' : centralSpot === "medium" ? '50px' : '20px',
              borderRadius: '50%',
              backgroundColor: 'black',
              pointerEvents: 'none',
            }}
          />
          {showLetter && (
            <COverlay 
              direction={eccentricTestCases[currentIndex].direction} 
              size={eccentricTestCases[currentIndex].size} 
              power_grid={selectedQuadrant}
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
      />
      <div style={{ marginTop: '60px' }}>
        <h1 className="test-title">Eccentric View Training</h1>
        <p className="test-instruction">Press the direction of opening in {showLetter} using the arrow keys.</p>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img src="/empty_grid.png" alt="Grid" className="test-image" />
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
              color: 'black',
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
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const [selectedQuadrant, setSelectedQuadrant] = React.useState("4");
  const [scrollSpeed, setScrollSpeed] = React.useState("medium");
  const [selectedFontSize, setSelectedFontSize] = React.useState(80);
  const [centralSpot, setCentralSpot] = React.useState("big");
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

  // Dot positioning logic
  const getDotStyle = () => {
    switch (selectedQuadrant) {
      case "1": // 20vh from bottom edge, horizontally centered
        return {
          left: '50%',
          bottom: '30vh',
          top: 'auto',
          transform: 'translateX(-50%)',
        };
      case "2": // 10vw from left edge, vertically centered
        return {
          left: '20vw',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case "3": // 20vh from top edge, horizontally centered
        return {
          left: '50%',
          top: '30vh',
          transform: 'translateX(-50%)',
        };
      case "4": // 10vw from right edge, vertically centered
        return {
          right: '20vw',
          left: 'auto',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      default:
        return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
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
      />
      <div style={{
        width: '100vw',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Scrolling text box */}
        <div 
          ref={containerRef}
          style={{
            width: '50vw',
            height: selectedFontSize * 2,
            background: '#ffe066',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
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
        {/* Dot, absolutely positioned relative to the parent container */}
        <div
          style={{
            position: 'absolute',
            // Spot sizes: big = 24px, medium = 18px, small = 12px
            width: centralSpot === "big" ? '30px' : centralSpot === "medium" ? '24px' : '18px',
            height: centralSpot === "big" ? '30px' : centralSpot === "medium" ? '24px' : '18px',
            borderRadius: '50%',
            background: 'black',
            ...getDotStyle(),
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/test/:index" element={<TestPageWrapper />} />
        <Route path="/result/:power_grid" element={<ResultPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/eccentric-training" element={<EccentricViewTraining />} />
        <Route path="/eccentric-result" element={<EccentricResultPage />} />
        <Route path="/eccentric-success" element={<EccentricSuccessPage />} />
        <Route path="/eccentric-stats" element={<EccentricStatsPage />} />
        <Route path="/scroll-text-training" element={<ScrollTextTrainingPage />} />
      </Routes>
    </Router>
  );
}

// Wrapper for test page route params
function TestPageWrapper() {
  const { index } = useParams();
  return <TestPage index={parseInt(index, 10)} />;
}
