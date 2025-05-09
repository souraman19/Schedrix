import { Button } from "@mui/material";
import { Mic } from "lucide-react";
import React, { useRef, useState } from "react";
import ChatModal from "./ChatModal";

export default function QuickTask({
  setTitle,
  setDuration,
}: {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);

  const handleChatClose = () => {
    handleStopVoiceAssistance(); //stop the voice assistance when the chat is closed
    setIsChatOpen(false);
  };

  const handleStopVoiceAssistance = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      setMessages((prevMessages) => [
        ...prevMessages,
        "Voice Assistant stopped.",
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        "Voice Assistant is not active.",
      ]);
    }
    speechSynthesis.cancel(); //stop the speech synthesi
  };

  const handleVoiceTaskCreation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    //configure
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;

    let stage = "askTitle"; // stages: askTitle → confirmTitle → askDuration → confirmDuration → finalConfirm
    let taskTitle = "";
    let taskDuration = "";



  //------------------------------------------------------------------------------------------

    //below flags is VVI
    //first one to prevent call listen() function again after stop
    //second one to prevent call listen() multiple times when the recognition is active

    let isActive = true; //flag to check if the recognition is active  
    let recognitionStarted = false; //flag to check if the recognition has started

   //------------------------------------------------------------------------------------------


    const speak = (message: string, callback?: () => void) => {
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance); //speak the message
      if (callback) {
        utterance.onend = callback; //call the callback function after the speech ends
      }
    };

    const listen = () => {
      if (!speechSynthesis.speaking && !recognitionStarted) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = "en-US";
        }
        recognitionStarted = true; //set the flag to true
        recognitionRef.current.start();
      } else {
        setTimeout(listen, 300);
      }
    };

    recognitionRef.current.onresult = (event: any) => {
      const speech = event.results[0][0].transcript.toLowerCase();
      console.log("User said: ", speech);
      setMessages((prevMessages) => [...prevMessages, `User: ${speech}`]);

      if (speech.includes("stop")) {
        setMessages((prevMessages) => [
          ...prevMessages,
          "Voice Assistant: Exiting now. Goodbye!",
        ]);
        speak("Exiting now. Goodbye!");
        isActive = false; //stop the recognition
        recognitionRef.current.stop();
      } else if (stage === "askTitle") {
        taskTitle = speech.trim();
        setMessages((prevMessages) => [
          ...prevMessages,
          `Voice Assistant: You said ${taskTitle}. Say confirm to continue or repeat to try again`,
        ]);
        speak(
          `You said ${taskTitle}. Say confirm to continue or repeat to try again`
        );
        stage = "confirmTitle";
      } else if (stage === "confirmTitle") {
        if (speech.includes("confirm")) {
          setTitle(taskTitle); //set the title of the task
          setMessages((prevMessages) => [
            ...prevMessages,
            `How long the task will take? Say in hours`,
          ]);
          speak("How long the task will take? Say in hours");
          stage = "askDuration";
        } else if (speech.includes("repeat")) {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please say the title of the task again",
          ]);
          speak("Please say the title of the task again");
          stage = "askTitle";
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please confirm to continue or repeat to try again",
          ]);
          speak("Please confirm to continue or repeat to try again");
        }
      } else if (stage === "askDuration") {
        const match = speech.match(/(\d+)(?:\s*(hour|hours)?)/); //match the speech input with the regex to get the number of hours
        if (match) {
          taskDuration = match[1];
          setMessages((prevMessages) => [
            ...prevMessages,
            `Voice Assistant: You said ${taskDuration} hours. Say confirm to continue or repeat to try again`,
          ]);
          speak(
            `You said ${taskDuration} hours. Say confirm to continue or repeat to try again`
          );
          stage = "confirmDuration";
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please say the duration of the task in hours",
          ]);
          speak("Please say the duration of the task in hours");
        }
      } else if (stage === "confirmDuration") {
        if (speech.includes("confirm")) {
          setDuration(taskDuration); //set the duration of the task
          setMessages((prevMessages) => [
            ...prevMessages,
            `Voice Assistant: You want to create a task with title ${taskTitle} and duration ${taskDuration} hours. Say confirm to create it or, repeat to try again from start or, cancel to exit`,
          ]);
          speak(
            `You want to create a task with title ${taskTitle} and duration ${taskDuration} hours. Say confirm to create it or, repeat to try again from start or, cancel to exit`
          );
          stage = "finalConfirm";
        } else if (speech.includes("repeat")) {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please say the duration of the task again",
          ]);
          speak("Please say the duration of the task again");
          stage = "askDuration";
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please confirm to create the task or repeat to try again from start or cancel to exit",
          ]);
          speak("Please confirm to continue or repeat to try again");
        }
      } else if (stage === "finalConfirm") {
        if (speech.includes("confirm")) {
          document.querySelector("form")?.requestSubmit(); //submit the form
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Task created successfully. Exiting now.",
          ]);
          speak("Task created successfully. Exiting now.");
          isActive = false;
          recognitionRef.current.stop(); //stop the recognition
        } else if (speech.includes("repeat")) {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please say the title of the task again",
          ]);
          speak("Please say the title of the task again");
          stage = "askTitle";
        } else if (speech.includes("cancel")) {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Task creation cancelled. Exiting now.",
          ]);
          speak("Task creation cancelled. Exiting now.");
          isActive = false;
          recognitionRef.current.stop(); //stop the recognition
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Voice Assistant: Please confirm to create the task or repeat to try again from start or cancel to exit",
          ]);
          speak(
            "Please confirm to create the task or repeat to try again from start or cancel to exit"
          );
        }
      }
    };


    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      speak("Sorry, I couldn't understand. Please try again.");
      setMessages((prevMessages) => [
        ...prevMessages,
        "Voice Assistant: Sorry, I couldn't understand. Please try again.",
      ]);
      isActive = false; //stop the recognition
      recognitionRef.current.stop(); //stop the recognition
    };


    setIsChatOpen(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      "Voice Assistant: Lets create a new task. Please say the title of the task",
    ]);
    speak("Lets create a new task. Please say the title of the task", () => {
      listen();
    });


    recognitionRef.current.onend = () => {
      recognitionStarted = false; //reset the flag
      setTimeout(() => {
        if (isActive) listen(); //start listening again after 300ms
      }, 300);
    };
  };

  
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
      <ChatModal
        isChatOpen={isChatOpen}
        handleChatClose={handleChatClose}
        messages={messages} // Pass the messages to the ChatModal
        setMessages={setMessages} // Pass the setMessages function to the ChatModal
        handleStopVoiceAssistance={handleStopVoiceAssistance} // Pass the handleStopVoiceAssistance function to the ChatModal
      />
    </>
  );
}
