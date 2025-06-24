import { useRef, useState } from "react";

export default function RecordVoiceNote({labelStyle, audioBlob, setAudioBlob, inputBase, isRecording, setIsRecording}:{labelStyle: Record<string, string>, audioBlob: Blob | null, setAudioBlob: (blob: Blob) => void, inputBase: Record<string, string>, isRecording: boolean, setIsRecording: (isRecording: boolean) => void}) {
    const audioChunkRef = useRef<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Request microphone access
        const mediaRecorder = new MediaRecorder(stream);

        audioChunkRef.current = [];

        mediaRecorder.ondataavailable = (e : any) => {  // Handle audio data availability
            audioChunkRef.current.push(e.data); // Collect audio data chunks
        }

        mediaRecorder.onstop = () => { 
            const blob = new Blob(audioChunkRef.current, { type: 'audio/webm'}); // Create a Blob from the collected audio chunks
            setAudioBlob(blob);
        }

        mediaRecorderRef.current = mediaRecorder; // Store the MediaRecorder instance
        mediaRecorder.start();
        setIsRecording(true);
    }

    const stopRecording = () => {
        if(!mediaRecorderRef || !mediaRecorderRef.current) return;
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }




    return (<div>
        <label style={labelStyle}>🎤 Record Voice Note</label>
        <div>
            <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
            >
                {isRecording ? "Stop" : "Start"}
            </button>

            {audioBlob && (
                <div>
                    <audio controls src={URL.createObjectURL(audioBlob)}/>
                </div>
            )}
        </div>
    </div>);
}