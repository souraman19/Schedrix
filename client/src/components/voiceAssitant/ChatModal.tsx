import React, { useState, useRef, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, TextField, Fade, Button } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function ChatModal({
  isChatOpen,
  handleChatClose,
  messages,
  setMessages,
  handleStopVoiceAssistance
}: {
  isChatOpen: boolean;
  handleChatClose: () => void;
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
    handleStopVoiceAssistance: () => void;
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages])


  return (
    <Modal
      open={isChatOpen}
    //   onClose={handleChatClose}
      closeAfterTransition
      sx={{
        transition: 'transform 0.3s ease-in-out',
        '& .MuiBackdrop-root': {
          background: 'rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '380px',
          maxHeight: '80vh',
          backgroundColor: '#121212',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: 8,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          animation: 'zoomIn 0.3s ease-out',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#00c853',
              letterSpacing: '1px',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
            }}
          >
            Assistant Chat
          </Typography>
          <IconButton onClick={handleChatClose}>
            <Close
              sx={{
                color: '#00c853',
                '&:hover': { color: '#b2ff59' },
                transition: 'color 0.3s ease',
              }}
            />
          </IconButton>
        </div>

        {/* Messages Section */}
        <div
          style={{
            flex: 1,
            maxHeight: 'calc(100% - 110px)',
            overflowY: 'auto',
            paddingRight: '12px',
            animation: 'slideUp 0.5s ease-in-out',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '12px',
                display: 'flex',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                animation: 'fadeIn 0.5s ease-in-out',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: index % 2 === 0 ? '#80deea' : '#a5d6a7',
                  borderRadius: '20px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  color: '#333',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s ease',
                  fontWeight: 500,
                }}
              >
                {message}
              </div>
            </div>
          ))}

            <div ref={bottomRef} /> {/* Scroll to this element */}
            <div>
                <Button
                    onClick={handleStopVoiceAssistance}
                >B</Button>
            </div>
        </div>
      </Box>
    </Modal>
  );
}
