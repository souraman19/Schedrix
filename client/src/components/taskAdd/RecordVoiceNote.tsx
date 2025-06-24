import { useRef, useState } from "react";

export default function RecordVoiceNote({
  labelStyle,
  audioBlob,
  setAudioBlob,
  inputBase,
  isRecording,
  setIsRecording,
}: {
  labelStyle: Record<string, string>;
  audioBlob: Blob | null;
  setAudioBlob: (blob: Blob | null) => void;
  inputBase: Record<string, string>;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}) {
  const audioChunkRef = useRef<Blob[]>([]); // Temporarily stores the pieces of the recorded audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); //Stores the actual recorder (used to stop/start)
  const mediaStreamRef = useRef<MediaStream | null>(null); //Stores the microphone stream (used to stop mic access 🔴)

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null); // ref to timer for recording duration
  const [recordingDuration, setRecordingDuration] = useState(0); // In seconds
  const [isStarting, setIsStarting] = useState(false); // Prevent double clicks
  const [isPaused, setIsPaused] = useState(false); // Track if recording is paused

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startRecording = async () => {
    if (isRecording || isStarting) return; // Failsafe
    setIsStarting(true);

    setAudioBlob(null); // Reset the audio blob to start fresh

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Request microphone access
    const mediaRecorder = new MediaRecorder(stream); // Create a MediaRecorder instance to handle the audio recording

    audioChunkRef.current = []; // Reset the audio chunks array to start fresh

    mediaRecorder.ondataavailable = (e: any) => {
      audioChunkRef.current.push(e.data); //As the user speaks, small chunks of audio are saved
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunkRef.current, { type: "audio/webm" }); // Create a Blob from the collected audio chunks
      if (recordingIntervalRef.current)
        clearInterval(recordingIntervalRef.current);
      setAudioBlob(blob); // Save the full recording to state
    };

    mediaRecorderRef.current = mediaRecorder; // Store the MediaRecorder instance to start / stop recording later
    mediaStreamRef.current = stream; // Store the MediaStream instance to stop microphone access later
    mediaRecorder.start(); // Start recording the audio
    setIsRecording(true);

    setRecordingDuration(0);
    recordingIntervalRef.current = setInterval(() => {
      // Start a timer to track the recording duration
      setRecordingDuration((prev) => prev + 1); // Increment the recording duration every second
    }, 1000);
    setIsStarting(false); // Reset the starting state
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); //stop the recording
      mediaRecorderRef.current = null; // Clear the MediaRecorder reference
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks of the MediaStream to release microphone access
      mediaStreamRef.current = null; // Clear the MediaStream reference
    }
    setIsRecording(false);
  };

  const cancelAudioClip = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null; // Clear the MediaRecorder reference
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recordingIntervalRef.current)
      clearInterval(recordingIntervalRef.current);
    setRecordingDuration(0);
    setAudioBlob(null);
    setIsRecording(false);
  };

  const pauseOrResumeRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return; // If there's no recorder, do nothing

    if (recorder.state === "recording") {
        recorder.pause(); // Pause the recording
        setIsPaused(true); // Update the paused state
        if(recordingIntervalRef.current){
            clearInterval(recordingIntervalRef.current); // Stop the recording duration timer
        }
    } else if (recorder.state === "paused") {
        recorder.resume(); // Resume the recording
        setIsPaused(false); // Update the paused state
        recordingIntervalRef.current = setInterval(() => {
          // Restart the recording duration timer
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
    }
  }

  return (
<div
      style={{
        background: "#111",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0, 200, 83, 0.2)",
        marginTop: "1.5rem",
        border: "1px solid #333",
      }}
    >
      <label
        style={{
          ...labelStyle,
          fontSize: "1rem",
          fontWeight: "600",
          color: "#b2ff59",
          display: "block",
          marginBottom: "0.75rem",
        }}
      >
        🎤 Record Voice Note
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isStarting}
          style={{
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "0.95rem",
            background: isRecording
              ? "linear-gradient(to right, #f44336, #e57373)"
              : "linear-gradient(to right, #00c853, #b2ff59)",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            boxShadow: isRecording
              ? "0 0 12px #f44336aa"
              : "0 0 12px #00c853aa",
            transition: "0.3s ease",
            opacity: isStarting ? 0.6 : 1,
          }}
        >
          {isRecording ? "Stop" : "Start"}
        </button>

        {isRecording && (
          <>
            <button
              type="button"
              onClick={pauseOrResumeRecording}
              style={{
                padding: "10px 16px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                background: "linear-gradient(to right, #ff9800, #ffc107)",
                color: "#000",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                boxShadow: "0 0 12px #ffb300aa",
                transition: "0.3s ease",
              }}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>

            <span style={{ color: "#b2ff59", fontWeight: 500 }}>
              ⏱️ {formatDuration(recordingDuration)}
            </span>
          </>
        )}

        {audioBlob && (
          <>
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              style={{
                height: "36px",
                background: "#222",
                borderRadius: "6px",
              }}
            />
            <button
              type="button"
              onClick={cancelAudioClip}
              style={{
                padding: "10px 16px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                background: "linear-gradient(to right, #616161, #9e9e9e)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                boxShadow: "0 0 12px #757575aa",
                transition: "0.3s ease",
              }}
              title="Cancel and reset recording"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
