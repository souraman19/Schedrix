import React, { useEffect } from "react";

export default function CustomRepeat({
  errors,
  customModalOpen,
  setCustomModalOpen,
  customRepeat,
  setCustomRepeat,
}: // customRepeatError,
// setCustomRepeatError
{
  repeat: string;
  setRepeat: (value: string) => void;
  errors: any;
  setErrors: (value: any) => void;
  customModalOpen: boolean;
  setCustomModalOpen: (value: boolean) => void;
  customRepeat: any;
  setCustomRepeat: (value: any) => void;
  // customRepeatError: any;
  // setCustomRepeatError: (value: any) => void;
}) {
  const handleSaveCustomRepeat = () => {
    setCustomModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split("."); // Split the name by '.' to handle nested properties

    if (name === "endsOn.date" && customRepeat.endsType !== "date") return;
    if (
      name === "endsOn.afterOccurrences" &&
      customRepeat.endsType !== "afterOccurrences"
    )
      return;

    setCustomRepeat((prev: any) => {
      const updated = { ...prev };
      let temp = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] }; // Copy nested level
        temp = temp[keys[i]];
      }

      temp[keys[keys.length - 1]] = value; // Finally set the value

      if (keys[0] === "endsType" && value === "afterOccurrences") {
        updated.endsOn = { ...updated.endsOn, never: false };
        updated.endsOn = { ...updated.endsOn, date: "" };
        updated.endsOn = { ...updated.endsOn, afterOccurrences: "1" };
      } else if (keys[0] === "endsType" && value === "never") {
        updated.endsOn = { ...updated.endsOn, never: true };
        updated.endsOn = { ...updated.endsOn, date: "" };
        updated.endsOn = { ...updated.endsOn, afterOccurrences: "" };
      } else if (keys[0] === "endsType" && value === "date") {
        updated.endsOn = { ...updated.endsOn, never: false };
        updated.endsOn = { ...updated.endsOn, date: "" };
        updated.endsOn = { ...updated.endsOn, afterOccurrences: "" };
      }

      return updated;
    });

    // console.log(name, value);
    // console.log(customRepeat);
  };

  useEffect(() => {
    // console.log("Updated customRepeat:", customRepeat);
  }, [customRepeat]); // This will log the state after it's updated

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
              <button
                onClick={() => setCustomModalOpen(false)}
                style={closeButtonStyle}
              >
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
                    value={customRepeat.repeatInterval || 1}
                    style={{ ...inputBase, width: "80px" }}
                    name="repeatInterval"
                    onChange={handleChange}
                  />
                  {errors["repeatInterval"] && (
                    <div style={errorTextStyle}>{errors["repeatInterval"]}</div>
                  )}

                  <select
                    style={{ ...inputBase, width: "160px" }}
                    name="repeatUnit"
                    value={customRepeat.repeatUnit || "day"}
                    onChange={handleChange}
                  >
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                  {errors["repeatUnit"] && (
                    <div style={errorTextStyle}>{errors["repeatUnit"]}</div>
                  )}
                </div>
              </div>

              {/* StartDay */}
              <div style={sectionStyle}>
                <div style={labelStyle}>Start Day</div>
                <input
                  type="date"
                  name="startDate"
                  value={customRepeat.startDate || ""}
                  style={{ ...inputBase, marginLeft: "1rem", width: "180px" }}
                  onChange={handleChange}
                />
                {errors["startDate"] && (
                  <div style={errorTextStyle}>{errors["startDate"]}</div>
                )}
              </div>

              {/* Ends */}
              <div style={sectionStyle}>
                <div style={labelStyle}>Ends</div>
                <div style={radioGroupStyle}>
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="endsType"
                      value="date"
                      checked={customRepeat.endsType === "date"}
                      onChange={handleChange}
                    />
                    {errors["endsType"] && (
                      <div style={errorTextStyle}>{errors["endsType"]}</div>
                    )}
                    <span style={{ marginLeft: "0.5rem" }}>Ends on</span>
                    <input
                      type="date"
                      name="endsOn.date"
                      value={customRepeat.endsOn.date || ""}
                      style={{
                        ...inputBase,
                        marginLeft: "1rem",
                        width: "180px",
                      }}
                      onChange={handleChange}
                    />
                    {errors["endsOn.date"] && (
                      <div style={errorTextStyle}>{errors["endsOn.date"]}</div>
                    )}
                  </label>
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="endsType"
                      value="afterOccurrences"
                      checked={customRepeat.endsType === "afterOccurrences"}
                      onChange={handleChange}
                    />
                    {errors["endsType"] && (
                      <div style={errorTextStyle}>{errors["endsType"]}</div>
                    )}
                    <span style={{ marginLeft: "0.5rem" }}>After</span>
                    <input
                      type="number"
                      name="endsOn.afterOccurrences"
                      min={1}
                      value={customRepeat.endsOn.afterOccurrences || 1}
                      placeholder="Occurrences"
                      style={{
                        ...inputBase,
                        marginLeft: "1rem",
                        width: "120px",
                      }}
                      onChange={handleChange}
                    />{" "}
                    times
                  </label>
                  {errors["endsOn.afterOccurrences"] && (
                    <div style={errorTextStyle}>
                      {errors["endsOn.afterOccurrences"]}
                    </div>
                  )}
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="endsType"
                      value="never"
                      checked={customRepeat.endsType === "never"}
                      onChange={handleChange}
                    />
                    {errors["endsType"] && (
                      <div style={errorTextStyle}>{errors["endsType"]}</div>
                    )}
                    <span style={{ marginLeft: "0.5rem" }}>Never ends</span>
                  </label>
                </div>
              </div>

              {/* Dynamic Sections */}
              {customRepeat.repeatUnit === "week" && (
                <div style={sectionStyle}>
                  <div style={labelStyle}>Select Week Days</div>
                  <div style={checkboxGroupStyle}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <label key={day} style={checkboxLabelStyle}>
                          <input
                            type="checkbox"
                            name="weekDaysIfWeekInterval"
                            value={day}
                            checked={customRepeat.weekDaysIfWeekInterval.includes(
                              day
                            )}
                            onChange={(e) => {
                              const selectedDays = e.target.checked
                                ? [...customRepeat.weekDaysIfWeekInterval, day]
                                : customRepeat.weekDaysIfWeekInterval.filter(
                                    (d: string) => d !== day
                                  );
                              setCustomRepeat({
                                ...customRepeat,
                                weekDaysIfWeekInterval: selectedDays,
                              });
                            }}
                          />
                          {errors["weekDaysIfWeekInterval"] && (
                            <div style={errorTextStyle}>
                              {errors["weekDaysIfWeekInterval"]}
                            </div>
                          )}
                          <span style={{ marginLeft: "0.5rem" }}>{day}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {customRepeat.repeatUnit === "month" && (
                <div style={sectionStyle}>
                  <div style={labelStyle}>Select Month Days</div>
                  <div style={checkboxGroupStyle}>
                    {Array.from({ length: 31 }).map((_, idx) => (
                      <label key={idx} style={checkboxLabelStyle}>
                        <input
                          type="checkbox"
                          name="monthDaysIfMonthInterval"
                          value={idx + 1}
                          checked={customRepeat.monthDaysIfMonthInterval.includes(
                            idx + 1
                          )}
                          onChange={(e) => {
                            const selectedDays = e.target.checked
                              ? [
                                  ...customRepeat.monthDaysIfMonthInterval,
                                  idx + 1,
                                ]
                              : customRepeat.monthDaysIfMonthInterval.filter(
                                  (d: number) => d !== idx + 1
                                );
                            setCustomRepeat({
                              ...customRepeat,
                              monthDaysIfMonthInterval: selectedDays,
                            });
                          }}
                        />
                        <span style={{ marginLeft: "0.4rem" }}>{idx + 1}</span>
                        {errors["monthDaysIfMonthInterval"] && (
                          <div style={errorTextStyle}>
                            {errors["monthDaysIfMonthInterval"]}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {customRepeat.repeatUnit === "year" && (
                <div style={sectionStyle}>
                  <div style={labelStyle}>Select Year Dates</div>
                  <div style={{ marginTop: "0.8rem" }}>
                    <input
                      type="date"
                      name="yearDatesIfYearInterval"
                      value={customRepeat.yearDatesIfYearInterval || ""}
                      style={{ ...inputBase }}
                      onChange={handleChange}
                    />
                    {errors["yearDatesIfYearInterval"] && (
                      <div style={errorTextStyle}>
                        {errors["yearDatesIfYearInterval"]}
                      </div>
                    )}
                    <small
                      style={{
                        display: "block",
                        marginTop: "0.5rem",
                        color: "gray",
                      }}
                    >
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
const labelStyle:React.CSSProperties = {
  marginBottom: "0.6rem",
  display: "block",
  fontWeight: 600,
  color: "#b2ff59",
  fontSize: "0.85rem", // Smaller font size
};

const inputBase:React.CSSProperties = {
  padding: "0.6rem",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#1c1c1c",
  color: "#eee",
  fontSize: "1rem",
};

const modalOverlayStyle: React.CSSProperties = {
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

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#121212",
  padding: "2rem",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "550px",
  boxShadow: "0 0 30px rgba(0, 200, 83, 0.5)",
  position: "relative",
  color: "#fff",
};

const modalHeaderStyle:React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
};

const modalTitleStyle:React.CSSProperties = {
  margin: 0,
  fontSize: "1.5rem",
};

const closeButtonStyle:React.CSSProperties = {
  background: "transparent",
  border: "none",
  fontSize: "2rem",
  color: "#00c853",
  cursor: "pointer",
};

const modalBodyStyle:React.CSSProperties = {
  marginBottom: "2rem",
};

const sectionStyle:React.CSSProperties = {
  marginBottom: "2rem",
};

const inputRowStyle:React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  marginTop: "0.5rem",
};

const radioGroupStyle:React.CSSProperties  = {
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const radioLabelStyle:React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const checkboxGroupStyle:React.CSSProperties = {
  marginTop: "0.8rem",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
};

const checkboxLabelStyle:React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const saveButtonStyle:React.CSSProperties = {
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

const errorTextStyle:React.CSSProperties = {
  color: "#f44336",
  marginTop: "0.4rem",
  fontSize: "0.75rem",
  fontWeight: 500,
  paddingLeft: "0.6rem",
  animation: "fadeInError 0.3s ease-in-out",
};
