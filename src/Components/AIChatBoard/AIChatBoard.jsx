import React, { useState, useRef, useEffect } from "react";
import "./AIChatBoard.css";
import { X, Send, Bot, Sparkles, Mail, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chatbotIcon from "../../assets/chatbot-icon.png";

const AIChatBoard = () => {
  const navigate = useNavigate();

  const contactEmail = "hirenex5@gmail.com";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your AI assistant. I can help you with jobs, internships, companies, courses, applications, and saved jobs.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const requestRunningRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getLocalPath = (text) => {
    const msg = text.toLowerCase();

    if (msg.includes("job")) return "/jobs";
    if (msg.includes("intern")) return "/InternshipPage";
    if (msg.includes("company")) return "/CompanyPage";
    if (msg.includes("course")) return "/courses";
    if (msg.includes("saved")) return "/saved-jobs";
    if (msg.includes("apply")) return "/jobs";
    if (msg.includes("contact")) return "/contactus";
    if (msg.includes("support") || msg.includes("help")) return "/help-support";
    if (msg.includes("login")) return "/login";
    if (msg.includes("register") || msg.includes("signup")) return "/register";

    return null;
  };

  const handleRating = (messageIndex, ratingValue) => {
    setMessages((prev) =>
      prev.map((msg, index) =>
        index === messageIndex
          ? {
              ...msg,
              rating: ratingValue,
            }
          : msg
      )
    );
  };

  const handleBotResponse = async (text) => {
    if (requestRunningRef.current) return;

    requestRunningRef.current = true;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/ai-chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.reply || "Failed to get AI response");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "Sorry, I could not understand that. Please ask about jobs, internships, companies, courses, or applications.",
          path: data.path || getLocalPath(text),
          showContact: true,
          showRating: true,
          rating: 0,
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            error.message ||
            "AI service is temporarily unavailable. Please try again later.",
          showContact: true,
          showRating: true,
          rating: 0,
        },
      ]);
    } finally {
      requestRunningRef.current = false;
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || loading || requestRunningRef.current) return;

    const currentInput = input.trim();

    if (currentInput.length > 500) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Message is too long. Please keep it below 500 characters.",
          showContact: true,
          showRating: true,
          rating: 0,
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentInput,
      },
    ]);

    setInput("");
    handleBotResponse(currentInput);
  };

  const quickMessage = (text) => {
    if (loading || requestRunningRef.current) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    handleBotResponse(text);
  };

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className={`ai-chat-button ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <img src={chatbotIcon} alt="AI Chat" className="ai-chat-icon-image" />
        )}

        {!isOpen && <span className="ai-chat-pulse"></span>}
      </button>

      {isOpen && (
        <div className="ai-chat-box">
          <div className="ai-chat-header">
            <div className="ai-chat-profile">
              <div className="ai-chat-avatar">
                <img
                  src={chatbotIcon}
                  alt="AI"
                  className="ai-header-bot-image"
                />
              </div>

              <div>
                <h3>AI Job Assistant</h3>
                <p>
                  <span></span> Online • Ready to help
                </p>
              </div>
            </div>

            <button className="ai-chat-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="ai-chat-body">
            <div className="ai-chat-welcome">
              <Sparkles size={16} />
              <p>
                Ask about jobs, internships, companies, courses, or
                applications.
              </p>
            </div>

            <div className="ai-chat-quick-actions">
              <button disabled={loading} onClick={() => quickMessage("Show me latest jobs")}>
                Jobs
              </button>

              <button disabled={loading} onClick={() => quickMessage("Show internships")}>
                Internships
              </button>

              <button disabled={loading} onClick={() => quickMessage("Show companies")}>
                Companies
              </button>

              <button disabled={loading} onClick={() => quickMessage("Show courses")}>
                Courses
              </button>
            </div>

            <div className="ai-chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.sender === "user"
                      ? "ai-message-row user-row"
                      : "ai-message-row bot-row"
                  }
                >
                  {msg.sender === "bot" && (
                    <div className="ai-small-avatar">
                      <img
                        src={chatbotIcon}
                        alt="AI"
                        className="ai-small-bot-image"
                      />
                    </div>
                  )}

                  <div
                    className={
                      msg.sender === "user"
                        ? "ai-message user-message"
                        : "ai-message bot-message"
                    }
                  >
                    <p>{msg.text}</p>

                    {msg.path && (
                      <button
                        className="ai-chat-link-btn"
                        onClick={() => handleNavigate(msg.path)}
                      >
                        Open Page
                      </button>
                    )}

                    {msg.showContact && (
                      <div className="ai-contact-info">
                        <Mail size={13} />
                        <span>For more info:</span>
                        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                      </div>
                    )}

                    {msg.showRating && (
                      <div className="ai-rating-box">
                        <p>Was this helpful?</p>

                        <div className="ai-rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={msg.rating >= star ? "active" : ""}
                              onClick={() => handleRating(index, star)}
                            >
                              <Star size={15} />
                            </button>
                          ))}
                        </div>

                        {msg.rating > 0 && (
                          <span className="ai-rating-thanks">
                            Thanks for your rating!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="ai-message-row bot-row">
                  <div className="ai-small-avatar">
                    <Bot size={14} />
                  </div>

                  <div className="ai-message bot-message ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Ask about jobs..."
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendMessage();
                }
              }}
              disabled={loading}
            />

            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBoard;