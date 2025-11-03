'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Message {
  content: string;
  isUser: boolean;
  time: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: '안녕하세요! 👋\nBSD 챗봇입니다. 무엇을 도와드릴까요?',
      isUser: false,
      time: '방금 전',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const responses: { [key: string]: string} = {
    '서비스 소개': 'BSD는 혁신적인 비즈니스 솔루션을 제공합니다. 고객의 성공을 위해 최선을 다하고 있습니다. 🚀',
    '가격 문의': '가격은 프로젝트 규모와 요구사항에 따라 다릅니다. 자세한 상담을 원하시면 연락주세요! 💼',
    '고객 지원': '24/7 고객 지원 서비스를 제공합니다. 언제든지 문의해주세요! 📞',
    '시작하기': '시작하기 위해 먼저 회원가입이 필요합니다. 도움이 필요하시면 말씀해주세요! ✨',
    '안녕': '안녕하세요! 반갑습니다! 😊',
    '감사': '천만에요! 도움이 되어 기쁩니다! 🙏',
    '도움': '무엇을 도와드릴까요? 궁금한 점을 말씀해주세요! 💡',
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  function getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function getBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase().trim();

    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key.toLowerCase())) {
        return value;
      }
    }

    return '죄송합니다. 잘 이해하지 못했습니다. 다시 한 번 말씀해주시겠어요? 🤔';
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    setIsTyping(false);
    const botResponse = getBotResponse(inputValue);
    const botMessage: Message = {
      content: botResponse,
      isUser: false,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const sendQuickReply = (message: string) => {
    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-[90px] h-[90px] bg-transparent border-none cursor-pointer z-[999] transition-all duration-300 hover:scale-110"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3))',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/bsd-symbol-color.png"
            alt="BSD 챗봇"
            width={90}
            height={90}
            className="w-full h-full object-contain"
          />
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[3px] border-[#2563eb] rounded-full"
            style={{ animation: 'pulseRing 2s ease-out infinite' }}
          />
        </div>
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulseRing {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.4);
              opacity: 0;
            }
          }
        `}</style>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-full max-w-[450px] h-[700px] bg-[#2d2d2d] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-[999]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-5 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        <div className="w-[50px] h-[50px] bg-white rounded-full p-2 flex items-center justify-center">
          <Image
            src="/images/bsd-symbol-color.png"
            alt="BSD 아이콘"
            width={50}
            height={50}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-white text-xl font-semibold mb-[3px]">BSD 챗봇</h2>
          <p className="text-white/80 text-[13px]">무엇을 도와드릴까요?</p>
        </div>
        <div
          className="w-2.5 h-2.5 bg-[#2ecc71] rounded-full"
          style={{ animation: 'pulse 2s infinite' }}
        />
        <button
          onClick={() => setIsOpen(false)}
          className="text-white text-3xl leading-none hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none"
        >
          ×
        </button>
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 px-5 py-2.5 overflow-x-auto">
        <button
          onClick={() => sendQuickReply('서비스 소개')}
          className="px-4 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-[20px] text-[#e0e0e0] text-[13px] cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-[#2563eb] hover:border-[#2563eb] hover:text-white"
        >
          🏢 서비스 소개
        </button>
        <button
          onClick={() => sendQuickReply('가격 문의')}
          className="px-4 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-[20px] text-[#e0e0e0] text-[13px] cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-[#2563eb] hover:border-[#2563eb] hover:text-white"
        >
          💰 가격 문의
        </button>
        <button
          onClick={() => sendQuickReply('고객 지원')}
          className="px-4 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-[20px] text-[#e0e0e0] text-[13px] cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-[#2563eb] hover:border-[#2563eb] hover:text-white"
        >
          💬 고객 지원
        </button>
        <button
          onClick={() => sendQuickReply('시작하기')}
          className="px-4 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-[20px] text-[#e0e0e0] text-[13px] cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-[#2563eb] hover:border-[#2563eb] hover:text-white"
        >
          🚀 시작하기
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#2563eb #1a1a1a',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 ${message.isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <div
              className={`w-[35px] h-[35px] rounded-full flex-shrink-0 flex items-center justify-center ${
                message.isUser
                  ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold text-sm'
                  : 'bg-white p-1.5'
              }`}
            >
              {message.isUser ? (
                'U'
              ) : (
                <Image
                  src="/images/bsd-symbol-color.png"
                  alt="BSD"
                  width={35}
                  height={35}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div>
              <div
                className={`max-w-[70%] px-4 py-3 rounded-[18px] leading-6 text-sm whitespace-pre-wrap ${
                  message.isUser
                    ? 'bg-[#2563eb] text-white rounded-br-[4px]'
                    : 'bg-[#3a3a3a] text-[#e0e0e0] rounded-bl-[4px]'
                }`}
              >
                {message.content}
              </div>
              <div className="text-[11px] text-[#888] mt-1 px-4">{message.time}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2.5">
            <div className="w-[35px] h-[35px] bg-white rounded-full p-1.5">
              <Image
                src="/images/bsd-symbol-color.png"
                alt="BSD"
                width={35}
                height={35}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-[#3a3a3a] px-4 py-3 rounded-[18px] rounded-bl-[4px] flex gap-1">
              <span
                className="w-2 h-2 bg-[#888] rounded-full"
                style={{ animation: 'typing 1.4s infinite' }}
              />
              <span
                className="w-2 h-2 bg-[#888] rounded-full"
                style={{ animation: 'typing 1.4s 0.2s infinite' }}
              />
              <span
                className="w-2 h-2 bg-[#888] rounded-full"
                style={{ animation: 'typing 1.4s 0.4s infinite' }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 bg-[#2d2d2d] border-t border-[#3a3a3a]">
        <div className="flex gap-2.5 bg-[#1a1a1a] p-3 rounded-[25px] border-2 border-transparent focus-within:border-[#2563eb] transition-colors duration-300">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-transparent border-none outline-none text-[#e0e0e0] text-sm placeholder:text-[#666]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-[#2563eb] border-none rounded-full text-white cursor-pointer flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:bg-[#1d4ed8] hover:scale-105 active:scale-95 disabled:bg-[#555] disabled:cursor-not-allowed disabled:scale-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
