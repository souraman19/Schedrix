import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import { Close, StopCircle } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const zoomIn = keyframes`
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 230, 118, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 230, 118, 0);
  }
`;

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
  }, [messages]);

  return (
    <Modal
      open={isChatOpen}
      closeAfterTransition
      sx={{
        '& .MuiBackdrop-root': {
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 380,
          maxHeight: '80vh',
          bgcolor: '#1e1e1e',
          borderRadius: '20px',
          p: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.15)',
          animation: `${zoomIn} 0.3s ease-out`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#00e676',
              letterSpacing: '1px',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            Voice Chat
          </Typography>
          <IconButton onClick={handleChatClose} size="small">
            <Close
              sx={{
                color: '#00e676',
                transition: 'color 0.25s ease',
                '&:hover': { color: '#b9f6ca' },
              }}
            />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            pr: 1,
            pl: 0.5,
            maxHeight: 'calc(100% - 110px)',
            animation: `${slideUp} 0.4s ease-in-out`,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '8px',
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                mb: 1.5,
                display: 'flex',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                animation: `${fadeIn} 0.5s ease-in-out`,
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.2,
                  bgcolor: index % 2 === 0 ? '#4dd0e1' : '#81c784',
                  borderRadius: '18px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  color: '#1a1a1a',
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                {message}
              </Box>
            </Box>
          ))}

          <div ref={bottomRef}>
          <Button
  onClick={handleStopVoiceAssistance}
  startIcon={
    <StopCircle
      sx={{
        fontSize: 22,
        animation: `${pulse} 3s infinite`,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'rotate(-10deg) scale(1.1)',
        },
      }}
    />
  }
  sx={{
    mt: 2,
    fontSize: '13.5px',
    fontWeight: 700,
    px: 3,
    py: 1,
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #00c853, #b2ff59)',
    color: '#121212',
    boxShadow:
      '0 0 0 2px rgba(0,230,118,0.3), 0 4px 12px rgba(0, 230, 118, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(6px)',
    animation: `${pulse} 4s infinite`,
    transition: 'all 0.35s ease-in-out',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '&:hover': {
      background: 'linear-gradient(135deg, #00e676, #ccff90)',
      boxShadow:
        '0 0 0 4px rgba(0,230,118,0.4), 0 8px 24px rgba(0, 255, 118, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)',
      transform: 'scale(1.05)',
    },
  }}
>
  Stop Voice
</Button>

          </div>
        </Box>
      </Box>
    </Modal>
  );
}
