import { Button } from "@mui/material";
import { Mic } from "lucide-react";
import React from "react";



export default function QuickTask(
    {setTitle, setDuration}: {setTitle: React.Dispatch<React.SetStateAction<string>>, setDuration: React.Dispatch<React.SetStateAction<string>>}
) {

   const handleVoiceTaskCreation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
    const recognition = new SpeechRecognition(); 

    //configure
    recognition.continuous = false; 
    recognition.lang = "en-US"; 
    recognition.interimResults = false;

    let stage = "askTitle"; // stages: askTitle → confirmTitle → askDuration → confirmDuration → finalConfirm
    let taskTitle = "";
    let taskDuration = "";

    let isActive = true; //flag to check if the recognition is active
    let recognitionStarted = false; //flag to check if the recognition has started

    const speak = (message: string, callback?: () => void) => {
        const utterance = new SpeechSynthesisUtterance(message); 
        if(callback){
            utterance.onend = callback; //call the callback function after the speech ends
        }
        speechSynthesis.speak(utterance); //speak the message

    }

    const listen = () => { 
        if(!speechSynthesis.speaking && !recognitionStarted){
            recognitionStarted = true; //set the flag to true
            recognition.start(); //start the recognition
        } else {
            setTimeout(listen, 300);
        }
    }

    recognition.onresult = (event: any) => {
        const speech = event.results[0][0].transcript.toLowerCase(); 
        console.log("User said: ", speech); 
        
        if(speech.includes("stop")){
            speak("Exiting now. Goodbye!");
            isActive = false; //stop the recognition
            recognition.stop();
        }
        else if(stage === "askTitle"){
            taskTitle = speech.trim();
            speak(`You said ${taskTitle}. Say confirm to continue or repeat to try again`);
            stage = "confirmTitle";
        } else if(stage === "confirmTitle"){
            if(speech.includes("confirm")){
                setTitle(taskTitle); //set the title of the task
                speak("How long the task will take? Say in hours");
                stage = "askDuration";
            } else if(speech.includes("repeat")){
                speak("Please say the title of the task again");
                stage = "askTitle";
            } else {
                speak("Please confirm to continue or repeat to try again");
            }
        } else if(stage === "askDuration"){
            const match = speech.match(/(\d+)(?:\s*(hour|hours)?)/); //match the speech input with the regex to get the number of hours
            if(match){
                taskDuration = match[1];
                speak(`You said ${taskDuration} hours. Say confirm to continue or repeat to try again`);
                stage = "confirmDuration";
            } else {
                speak("Please say the duration of the task in hours");
            }
        } else if(stage === "confirmDuration"){
            if(speech.includes("confirm")){
                setDuration(taskDuration); //set the duration of the task
                speak(`You want to create a task with title ${taskTitle} and duration ${taskDuration} hours. Say confirm to create it or, repeat to try again from start or, cancel to exit`);
                stage = "finalConfirm";
            } else if(speech.includes("repeat")){
                speak("Please say the duration of the task again");
                stage = "askDuration";
            } else {
                speak("Please confirm to continue or repeat to try again");
            }
        } else if(stage === "finalConfirm"){
            if(speech.includes("confirm")){
                document.querySelector('form')?.requestSubmit(); //submit the form
                speak("Task created successfully. Exiting now.");
                isActive = false; 
                recognition.stop(); //stop the recognition
            } else if(speech.includes("repeat")){
                speak("Please say the title of the task again");
                stage = "askTitle";
            } else if(speech.includes("cancel")){
                speak("Task creation cancelled. Exiting now.");
                isActive = false; 
                recognition.stop(); //stop the recognition
            } else {
                speak("Please confirm to create the task or repeat to try again from start or cancel to exit");
            }
        } 
    }


    recognition.onerror = (event: any) => {
        console.error("Speech error:", event.error);
        speak("Sorry, I couldn't understand. Please try again.");
        isActive = false; //stop the recognition
        recognition.stop(); //stop the recognition
    }

    speak("Lets create a new task. Please say the title of the task", () => {
        listen();
    });


    recognition.onend = () => { 
        recognitionStarted = false; //reset the flag
        setTimeout(()=> {
            if(isActive) listen(); //start listening again after 700ms
        }, 300)
    }


   }



    return (
        <>
            <Button
              onClick={handleVoiceTaskCreation}
              style={{
                background: "linear-gradient(to right, #00c853, #b2ff59)",
                borderRadius: "150rem",
                width: "44px",
                height: "60px",
                padding: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 12px rgba(0, 200, 83, 0.4)",
                position: "absolute",
                right: "5rem",
              }}
            >
              <Mic size={20} color="#000" />
            </Button>
        </>
    );
}