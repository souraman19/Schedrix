import { useEffect, useState } from "react";

export default function RepeatSelector({repeat, setRepeat}: {repeat: string, setRepeat: (value: string) => void}) {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [repeatsEvery, setRepeatsEvery] = useState("day");


  useEffect(() => {
    if (repeat === "custom") {
        setCustomModalOpen(true);
    }
  }, [repeat]);

  const handleSaveCustomRepeat = () => {
    setCustomModalOpen(false);
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Main Repeat Selection */}

      {/* Modal for Custom Repeat */}
      {customModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {/* Modal Header */}
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Custom Repeat Setup</h2>
              <button onClick={() => setCustomModalOpen(false)} style={closeButtonStyle}>
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={modalBodyStyle}>
              {/* Repeats Every */}
              <div style={sectionStyle}>
                <div style={labelStyle}>Repeats Every</div>
                <div style={inputRowStyle}>
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    style={{ ...inputBase, width: "80px" }}
                    name="repeatInterval"
                  />
                  <select
                    style={{ ...inputBase, width: "160px" }}
                    value={repeatsEvery}
                    onChange={(e) => setRepeatsEvery(e.target.value)}
                    name="repeatUnit"
                  >
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>
              </div>

              {/* Ends */}
              <div style={sectionStyle}>
                <div style={labelStyle}>Ends</div>
                <div style={radioGroupStyle}>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="endsOnDate" value="onDate" defaultChecked /> 
                    <span style={{ marginLeft: "0.5rem" }}>Ends on</span>
                    <input type="date" name="endsOnDate" style={{ ...inputBase, marginLeft: "1rem", width: "180px" }} />
                  </label>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="endsOnOccurances" value="afterOccurrences" />
                    <span style={{ marginLeft: "0.5rem" }}>After</span>
                    <input
                      type="number"
                      name="endsAfterOccurrences"
                      min={1}
                      placeholder="Occurrences"
                      style={{ ...inputBase, marginLeft: "1rem", width: "120px" }}
                    /> times
                  </label>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="endsOnNever" value="never" /> 
                    <span style={{ marginLeft: "0.5rem" }}>Never ends</span>
                  </label>
                </div>
              </div>

              {/* Dynamic Sections */}
              {repeatsEvery === "week" && (
                <div style={sectionStyle}>
                  <div style={labelStyle}>Select Week Days</div>
                  <div style={checkboxGroupStyle}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <label key={day} style={checkboxLabelStyle}>
                        <input type="checkbox" name="weekDaysIfWeekInterval" value={day} />
                        <span style={{ marginLeft: "0.5rem" }}>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {repeatsEvery === "month" && (
                <div style={sectionStyle}>
                  <div style={labelStyle}>Select Month Days</div>
                  <div style={checkboxGroupStyle}>
                    {Array.from({ length: 31 }).map((_, idx) => (
                      <label key={idx} style={checkboxLabelStyle}>
                        <input type="checkbox" name="monthDaysIfMonthInterval" value={idx + 1} />
                        <span style={{ marginLeft: "0.4rem" }}>{idx + 1}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {repeatsEvery === "year" && (
                <div style={sectionStyle}>
                  <div style={labelStyle}>Select Year Dates</div>
                  <div style={{ marginTop: "0.8rem" }}>
                    <input
                      type="date"
                      name="yearDatesIfYearInterval"
                      style={{ ...inputBase }}
                    />
                    <small style={{ display: "block", marginTop: "0.5rem", color: "gray" }}>
                      You can select one or more dates.
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button onClick={handleSaveCustomRepeat} style={saveButtonStyle}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Styles */
const labelStyle = {
    marginBottom: "0.6rem",
    display: "block",
    fontWeight: 600,
    color: "#b2ff59",
    fontSize: "0.85rem", // Smaller font size
  };
  
const inputBase = {
  padding: "0.6rem",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#1c1c1c",
  color: "#eee",
  fontSize: "1rem",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: "#121212",
  padding: "2rem",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "550px",
  boxShadow: "0 0 30px rgba(0, 200, 83, 0.5)",
  position: "relative",
  color: "#fff",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
};

const modalTitleStyle = {
  margin: 0,
  fontSize: "1.5rem",
};

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  fontSize: "2rem",
  color: "#00c853",
  cursor: "pointer",
};

const modalBodyStyle = {
  marginBottom: "2rem",
};

const sectionStyle = {
  marginBottom: "2rem",
};

const inputRowStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  marginTop: "0.5rem",
};

const radioGroupStyle = {
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
};

const checkboxGroupStyle = {
  marginTop: "0.8rem",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
};

const saveButtonStyle = {
  marginTop: "2rem",
  width: "100%",
  padding: "0.8rem",
  borderRadius: "8px",
  backgroundImage: "linear-gradient(to right, #00c853, #b2ff59)",
  border: "none",
  color: "#000",
  fontWeight: "bold",
  fontSize: "1.1rem",
  cursor: "pointer",
  transition: "all 0.3s",
};

