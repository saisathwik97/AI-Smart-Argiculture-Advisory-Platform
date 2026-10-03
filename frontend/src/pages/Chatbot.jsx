import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import {
  Send,
  Mic,
  Volume2,
  VolumeX,
  Sprout,
  MapPin,
  FlaskConical,
  Languages,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  UserRound,
  Leaf,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

import "../styles/Chatbot.css";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [lastCategory, setLastCategory] =
    useState("Crop Specialist");

  const [showForm, setShowForm] = useState(true);
  const [language, setLanguage] =
    useState("English");

  const [farmerDetails, setFarmerDetails] =
    useState({
      name: "",
      location: "",
      soilType: "",
      ph: "",
    });

  const [messages, setMessages] =
    useState([]);

  const messagesEndRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const API_URL = `http://${window.location.hostname}:5000`;

  /* =========================================================
     SCROLL
  ========================================================= */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* =========================================================
     UNLOCK SPEECH
  ========================================================= */

  useEffect(() => {
    const unlockSpeech = () => {
      try {
        window.speechSynthesis?.resume();
      } catch (error) {
        console.warn(
          "Speech synthesis could not be resumed:",
          error
        );
      }
    };

    document.addEventListener(
      "click",
      unlockSpeech
    );

    return () => {
      document.removeEventListener(
        "click",
        unlockSpeech
      );
    };
  }, []);

  /* =========================================================
     LOAD FARMER MEMORY
  ========================================================= */

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${API_URL}/memory/${user._id}`)
      .then((res) => {
        if (
          res.data &&
          res.data.location
        ) {
          setFarmerDetails((prev) => ({
            ...prev,
            name:
              res.data.name ||
              user.name ||
              "",
            location:
              res.data.location || "",
            soilType:
              res.data.soilType || "",
            ph: res.data.ph || "",
          }));

          setShowForm(false);

          setMessages([
            {
              sender: "bot",
              text: `Welcome back ${
                res.data.name ||
                user.name ||
                "farmer"
              }! How can I help with your farm today?`,
            },
          ]);
        }
      })
      .catch(() => {
        console.log(
          "No existing memory found."
        );
      });
  }, []);

  /* =========================================================
     VOICE INPUT
  ========================================================= */

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      language === "Telugu"
        ? "te-IN"
        : language === "Hindi"
        ? "hi-IN"
        : "en-IN";

    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const transcript =
        e.results?.[0]?.[0]?.transcript;

      if (transcript) {
        setQuestion(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.warn(
        "Speech recognition error:",
        event.error
      );
    };

    try {
      recognition.start();
    } catch (error) {
      console.warn(
        "Could not start speech recognition:",
        error
      );
    }
  };

  /* =========================================================
     TEXT TO SPEECH
  ========================================================= */

  const speakText = (text) => {
    if (
      !text ||
      !window.speechSynthesis
    ) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const speech =
        new SpeechSynthesisUtterance(
          String(text)
        );

      const targetLang =
        language === "Telugu"
          ? "te-IN"
          : language === "Hindi"
          ? "hi-IN"
          : "en-IN";

      speech.lang = targetLang;
      speech.rate = 0.9;
      speech.pitch = 1;
      speech.volume = 1;

      const speakWithCorrectVoice = () => {
        const voices =
          window.speechSynthesis.getVoices();

        let selectedVoice = null;

        if (language === "Telugu") {
          selectedVoice = voices.find(
            (voice) =>
              voice.lang?.toLowerCase() ===
              "te-in"
          );

          if (!selectedVoice) {
            selectedVoice = voices.find(
              (voice) =>
                voice.lang
                  ?.toLowerCase()
                  .startsWith("te")
            );
          }

          if (!selectedVoice) {
            selectedVoice = voices.find(
              (voice) =>
                voice.name
                  ?.toLowerCase()
                  .includes("telugu")
            );
          }
        } else if (
          language === "Hindi"
        ) {
          selectedVoice = voices.find(
            (voice) =>
              voice.lang?.toLowerCase() ===
              "hi-in"
          );

          if (!selectedVoice) {
            selectedVoice = voices.find(
              (voice) =>
                voice.lang
                  ?.toLowerCase()
                  .startsWith("hi")
            );
          }

          if (!selectedVoice) {
            selectedVoice = voices.find(
              (voice) =>
                voice.name
                  ?.toLowerCase()
                  .includes("hindi")
            );
          }
        } else {
          selectedVoice = voices.find(
            (voice) =>
              voice.lang?.toLowerCase() ===
              "en-in"
          );

          if (!selectedVoice) {
            selectedVoice = voices.find(
              (voice) =>
                voice.lang
                  ?.toLowerCase()
                  .startsWith("en")
            );
          }
        }

        if (selectedVoice) {
          speech.voice = selectedVoice;
          speech.lang = selectedVoice.lang;
        } else {
          speech.lang = targetLang;
        }

        speech.onerror = (event) => {
          if (
            event.error !== "interrupted" &&
            event.error !== "canceled"
          ) {
            console.warn(
              "Text-to-speech error:",
              event.error
            );
          }
        };

        window.speechSynthesis.speak(
          speech
        );
      };

      const voices =
        window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        speakWithCorrectVoice();
      } else {
        window.speechSynthesis.onvoiceschanged =
          () => {
            window.speechSynthesis.onvoiceschanged =
              null;

            speakWithCorrectVoice();
          };
      }
    } catch (error) {
      console.warn(
        "Text-to-speech failed:",
        error
      );
    }
  };

  /* =========================================================
     STOP SPEAKING
  ========================================================= */

  const stopSpeaking = () => {
    try {
      window.speechSynthesis?.cancel();
    } catch (error) {
      console.warn(
        "Could not stop speech:",
        error
      );
    }
  };

  /* =========================================================
     FORM INPUT
  ========================================================= */

  const handleInputChange = (e) => {
    setFarmerDetails((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* =========================================================
     SAVE FARMER
  ========================================================= */

  const saveFarmerDetails = async () => {
    try {
      await axios.post(
        `${API_URL}/memory/save`,
        {
          farmerId:
            user?._id || "farmer1",
          ...farmerDetails,
          preferred_language: language,
        }
      );

      setShowForm(false);

      setMessages([
        {
          sender: "bot",
          text: `Hello ${
            farmerDetails.name ||
            "farmer"
          }! Ask your farming questions.`,
        },
      ]);
    } catch (error) {
      console.error(
        "Error saving farmer details:",
        error
      );

      alert(
        "Error saving farmer details"
      );
    }
  };

  /* =========================================================
     SEND QUESTION
  ========================================================= */

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const currentQuestion =
      question.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");

    try {
      const res = await axios.post(
        `${API_URL}/agent/query`,
        {
          farmerId:
            user?._id || "farmer1",
          question: currentQuestion,
          language,
        }
      );

      const answer =
        res.data?.response?.answer ||
        "Sorry, I could not generate an answer.";

      speakText(answer);

      setLastCategory(
        res.data?.selectedAgent ||
          "virtual"
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: answer,
        },
        {
          sender: "bot",
          type: "feedback",
          text:
            "Are you satisfied with this answer?",
        },
      ]);

      setLastQuestion(
        currentQuestion
      );
    } catch (error) {
      console.error(
        "Chatbot request failed:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Sorry, I couldn't connect to the server. Please try again.",
        },
      ]);
    }
  };

  /* =========================================================
     FEEDBACK
  ========================================================= */

  const handleFeedback = async (
    type
  ) => {
    if (type === "yes") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Glad I could help! 😊",
        },
      ]);

      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `👨‍🔬 Redirecting to ${lastCategory} expert...`,
      },
    ]);

    try {
      const res = await axios.post(
        `${API_URL}/agent/query`,
        {
          farmerId:
            user?._id || "farmer1",
          question: lastQuestion,
          forceAgent: true,
          language,
        }
      );

      const answer =
        res.data?.response?.answer ||
        "Sorry, I couldn't get an expert response.";

      speakText(answer);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: answer,
        },
        {
          sender: "bot",
          type: "expert",
          text:
            "Need further help? Consult a real expert.",
        },
      ]);
    } catch (error) {
      console.error(
        "Expert request failed:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Unable to connect to the expert service.",
        },
      ]);
    }
  };

  /* =========================================================
     OPEN EXPERTS
  ========================================================= */

  const openExperts = () => {
    window.location.href =
      "/experts";
  };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendQuestion();
    }
  };

  /* =========================================================
     REGISTRATION
  ========================================================= */

  if (showForm) {
    return (
      <div className="agri-chat-page">
        <div className="agri-onboarding-card">

          <div className="agri-onboarding-visual">
            <div className="agri-onboarding-icon">
              <Sprout size={38} />
            </div>

            <div className="agri-onboarding-label">
              AGRI<span>AI</span>
            </div>

            <h1>
              Your farm.
              <br />
              Your intelligent
              <br />
              <span>advisor.</span>
            </h1>

            <p>
              Tell us a little about your
              farm so AgriAI can provide
              more relevant agricultural
              guidance.
            </p>

            <div className="agri-onboarding-points">
              <div>
                <Leaf size={16} />
                Personalized crop advice
              </div>

              <div>
                <FlaskConical size={16} />
                Soil-aware recommendations
              </div>

              <div>
                <Sparkles size={16} />
                AI-powered farming support
              </div>
            </div>
          </div>

          <div className="agri-onboarding-form">
            <div className="agri-form-header">
              <div className="agri-form-icon">
                <UserRound size={21} />
              </div>

              <div>
                <div className="agri-eyebrow">
                  FARMER PROFILE
                </div>

                <h2>
                  Let's get started
                </h2>

                <p>
                  Add your farm details to
                  personalize your advisor.
                </p>
              </div>
            </div>

            <div className="agri-form-fields">

              <div className="agri-field">
                <label>
                  Preferred Language
                </label>

                <div className="agri-input-icon">
                  <Languages size={17} />

                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      English
                    </option>
                    <option>
                      Telugu
                    </option>
                    <option>
                      Hindi
                    </option>
                  </select>
                </div>
              </div>

              <div className="agri-field">
                <label>
                  Your Name
                </label>

                <div className="agri-input-icon">
                  <UserRound size={17} />

                  <input
                    name="name"
                    placeholder="Enter your name"
                    value={
                      farmerDetails.name
                    }
                    onChange={
                      handleInputChange
                    }
                  />
                </div>
              </div>

              <div className="agri-field">
                <label>
                  Farm Location
                </label>

                <div className="agri-input-icon">
                  <MapPin size={17} />

                  <input
                    name="location"
                    placeholder="City, State"
                    value={
                      farmerDetails.location
                    }
                    onChange={
                      handleInputChange
                    }
                  />
                </div>
              </div>

              <div className="agri-form-row">

                <div className="agri-field">
                  <label>
                    Soil Type
                  </label>

                  <div className="agri-input-icon">
                    <Sprout size={17} />

                    <input
                      name="soilType"
                      placeholder="e.g. Black Soil"
                      value={
                        farmerDetails.soilType
                      }
                      onChange={
                        handleInputChange
                      }
                    />
                  </div>
                </div>

                <div className="agri-field">
                  <label>
                    Soil pH
                  </label>

                  <div className="agri-input-icon">
                    <FlaskConical size={17} />

                    <input
                      name="ph"
                      placeholder="e.g. 6.5"
                      value={
                        farmerDetails.ph
                      }
                      onChange={
                        handleInputChange
                      }
                    />
                  </div>
                </div>

              </div>

              <button
                className="agri-primary-button"
                onClick={
                  saveFarmerDetails
                }
              >
                Start Smart Advisory
                <ArrowRight size={18} />
              </button>

              <div className="agri-privacy-note">
                <Sparkles size={13} />
                Your details help personalize
                agricultural recommendations.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     CHAT UI
  ========================================================= */

  return (
    <div className="agri-chat-page">

      <div className="agri-chat-shell">

        {/* HEADER */}

        <header className="agri-chat-header">

          <div className="agri-chat-title">

            <div className="agri-chat-avatar">
              <Sprout size={23} />
            </div>

            <div>
              <div className="agri-chat-name">
                AgriAI Smart Advisor
              </div>

              <div className="agri-chat-status">
                <span />
                AI farming assistant
              </div>
            </div>

          </div>

          <div className="agri-chat-controls">

            <div className="agri-language-control">
              <Languages size={16} />

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
              >
                <option>
                  English
                </option>
                <option>
                  Telugu
                </option>
                <option>
                  Hindi
                </option>
              </select>
            </div>

            <button
              className="agri-stop-button"
              onClick={
                stopSpeaking
              }
              title="Stop speaking"
            >
              <VolumeX size={16} />
              <span>
                Stop
              </span>
            </button>

          </div>
        </header>

        {/* CHAT CONTENT */}

        <div className="agri-messages">

          {messages.length === 0 && (
            <div className="agri-empty-state">

              <div className="agri-empty-icon">
                <Sprout size={34} />
              </div>

              <div className="agri-empty-eyebrow">
                SMART AGRICULTURE
              </div>

              <h2>
                How can I help
                <br />
                with your farm?
              </h2>

              <p>
                Ask about crops, soil,
                diseases, irrigation,
                fertilizers, weather,
                or farming practices.
              </p>

              <div className="agri-suggestion-grid">

                <Suggestion
                  icon="🌱"
                  text="Which crop should I grow?"
                  onClick={() =>
                    setQuestion(
                      "Which crop should I grow?"
                    )
                  }
                />

                <Suggestion
                  icon="🪨"
                  text="How can I improve my soil?"
                  onClick={() =>
                    setQuestion(
                      "How can I improve my soil?"
                    )
                  }
                />

                <Suggestion
                  icon="🐛"
                  text="How do I treat crop disease?"
                  onClick={() =>
                    setQuestion(
                      "How do I treat crop disease?"
                    )
                  }
                />

                <Suggestion
                  icon="💧"
                  text="How often should I irrigate?"
                  onClick={() =>
                    setQuestion(
                      "How often should I irrigate?"
                    )
                  }
                />

              </div>
            </div>
          )}

          {messages.map(
            (msg, i) => (
              <div
                key={i}
                className={`agri-message-row ${
                  msg.sender === "user"
                    ? "agri-user-row"
                    : "agri-bot-row"
                }`}
              >

                <div
                  className={`agri-message ${
                    msg.sender === "user"
                      ? "agri-user-message"
                      : "agri-bot-message"
                  }`}
                >

                  {msg.sender ===
                    "bot" && (
                    <div className="agri-message-icon">
                      <Sprout size={15} />
                    </div>
                  )}

                  <div className="agri-message-body">

                    {msg.sender ===
                    "bot" ? (
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <p>
                        {msg.text}
                      </p>
                    )}

                   {msg.sender === "bot" &&
  msg.text &&
  !msg.type && (
    <button
      type="button"
      className="agri-read-button"
      onClick={() => speakText(msg.text)}
      title="Read aloud"
      aria-label="Read aloud"
    >
      <Volume2 size={16} />
      <span>Listen</span>
    </button>
  )}

                    {msg.type ===
                      "feedback" && (
                      <div className="agri-feedback">
                        <span>
                          Was this helpful?
                        </span>

                        <button
                          onClick={() =>
                            handleFeedback(
                              "yes"
                            )
                          }
                        >
                          <ThumbsUp
                            size={14}
                          />
                          Yes
                        </button>

                        <button
                          onClick={() =>
                            handleFeedback(
                              "no"
                            )
                          }
                        >
                          <ThumbsDown
                            size={14}
                          />
                          No
                        </button>
                      </div>
                    )}

                    {msg.type ===
                      "expert" && (
                      <button
                        className="agri-expert-button"
                        onClick={
                          openExperts
                        }
                      >
                        <Stethoscope
                          size={15}
                        />
                        Consult a Real Expert
                        <ArrowRight
                          size={14}
                        />
                      </button>
                    )}

                  </div>
                </div>

              </div>
            )
          )}

          <div
            ref={messagesEndRef}
          />

        </div>

        {/* INPUT */}

        <div className="agri-input-wrapper">

          <div className="agri-input-box">

            <input
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Ask your farming question..."
            />

            <button
              className="agri-mic-button"
              onClick={
                startListening
              }
              title="Voice input"
            >
              <Mic size={19} />
            </button>

            <button
              className="agri-send-button"
              onClick={
                sendQuestion
              }
              disabled={
                !question.trim()
              }
              title="Send question"
            >
              <Send size={18} />
            </button>

          </div>

          <div className="agri-input-hint">
            Press Enter to send · 🎤 Use
            your voice to ask
          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SUGGESTION CARD
========================================================= */

function Suggestion({
  icon,
  text,
  onClick,
}) {
  return (
    <button
      className="agri-suggestion"
      onClick={onClick}
    >
      <span className="agri-suggestion-icon">
        {icon}
      </span>

      <span>{text}</span>

      <ArrowRight size={14} />
    </button>
  );
}