import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import BotImage from "../image/botimage.png";
import api from "../data/api";
import sent from "../image/icons8-send-button-48.png";
import styles from "./Chatbot.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

const Chatbot = ({ formId }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentElement, setCurrentElement] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const { shareToken } = useParams();
  const messagesEndRef = useRef(null);
  const [sessionId] = useState(() => {
    // Try to get existing sessionId from localStorage
    const existingSessionId = localStorage.getItem(`form_session_${formId}`);
    if (existingSessionId) {
      return existingSessionId;
    }

    // Generate new sessionId if none exists
    const newSessionId = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem(`form_session_${formId}`, newSessionId);
    return newSessionId;
  });
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === "dark");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? "dark" : "light");
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

  useEffect(() => {
      if (!formId && !shareToken) {
      setError("No form ID provided");
      setIsLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
          let response;
          if (shareToken) {
              // Use public route if accessing via share token
              response = await api.get(`/forms/public/${shareToken}`);
          } else {
              // Use authenticated route if accessing directly
              response = await api.get(`/forms/getFormById/${formId}`);
          }
        if (response.data.success) {
          setForm(response.data.form);
          if (response.data.form.elements.length > 0) {
            const firstElement = response.data.form.elements[0];
            setMessages([
              {
                type: "bot",
                content:
                  firstElement.type === "image"
                    ? firstElement.content
                    : firstElement.type.startsWith("input-")
                    ? firstElement.label
                    : firstElement.content,
                elementType: firstElement.type,
              },
            ]);
            setInputVisible(!firstElement.type.startsWith("image"));
          }
        } else {
          setError("Failed to load form");
        }
      } catch (err) {
        setError("Error loading form");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [formId, shareToken]);

  const DateInput = () => (
    <div className={styles.dateInputContainer}>
      <div className={styles.dateInputWrapper}>
        <div className={styles.dateInputWithButton}>
          <div
            className={styles.dateFieldContainer}
            onClick={() => setIsCalendarOpen(true)}
          >
            <div className={styles.datein}>
              <input
                type="text"
                value={selectedDate ? selectedDate.toLocaleDateString() : ""}
                placeholder="Click to select date"
                className={styles.dateInputField}
                readOnly
              />
              <button
                type="button"
                onClick={() => {
                  if (selectedDate) {
                    handleSubmit(selectedDate.toLocaleDateString());
                  }
                }}
                className={`${styles.sendButton} ${
                  !selectedDate ? styles.disabled : ""
                }`}
                disabled={!selectedDate}
              >
                <img src={sent} alt="" className={styles.sentbutton} />
              </button>
            </div>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              open={isCalendarOpen}
              onClickOutside={() => setIsCalendarOpen(false)}
              inline
              popperClassName={styles.datePopper}
              calendarClassName={styles.dateCalendar}
              wrapperClassName={styles.datePickerWrapper}
              showPopperArrow={false}
            />
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    handleSubmit(rating.toString()); // Directly handle the rating as input
  };

  const Message = ({ message }) => {
    if (message.elementType === "image") {
      return (
        <div
          className={`${styles.messageWrapper} ${
            message.type === "user" ? styles.userMessage : styles.botMessage
          }`}
        >
          {message.type === "bot" && (
            <div className={styles.avatar}>
              <img
                src={BotImage}
                alt="Bot Avatar"
                className={styles.avatarImage}
              />
            </div>
          )}
          <div className={`${styles.message} ${styles.imageMessage}`}>
            <img
              src={message.content}
              alt="Chat content"
              className={styles.chatImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/300/200"; // Fallback image
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        
        <div
          className={`${styles.messageWrapper} ${
            message.type === "user" ? styles.userMessage : styles.botMessage
          }`}
        >
          {message.type === "bot" && (
            <div className={styles.avatar}>
              <img
                src={BotImage}
                alt="Bot Avatar"
                className={styles.avatarImage}
              />
            </div>
          )}
          <div className={styles.message}>{message.content}</div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (inputValue = userInput) => {
    if (!inputValue && inputValue !== 0) return;

    const currentFormElement = form.elements[currentElement];

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: inputValue,
      },
    ]);
    // setInputVisible(false);

    try {
      const responseData = {
        elementId: currentFormElement.id || String(currentElement),
        elementLabel: currentFormElement.label,
        response: inputValue.toString(),
        sessionId: sessionId,
      };

        if (shareToken) {
            await api.post(`/forms/public/${shareToken}/responses`, responseData);
        } else {
            await api.post(`/forms/formsbot/${formId}/responses`, responseData);
        }

      console.log(responseData);
    //   await api.post(`/forms/formsbot/${formId}/responses`, responseData);

      const nextElement = currentElement + 1;

      if (nextElement < form.elements.length) {
        const nextFormElement = form.elements[nextElement];

        setTimeout(() => {
          if (nextFormElement.type === "image") {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                content: nextFormElement.content,
                elementType: nextFormElement.type,
              },
            ]);

            const followingElement = nextElement + 1;
            if (followingElement < form.elements.length) {
              const followingFormElement = form.elements[followingElement];
              setTimeout(() => {
                setCurrentElement(followingElement);
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "bot",
                    content:
                      followingFormElement.content ||
                      followingFormElement.label,
                    elementType: followingFormElement.type,
                  },
                ]);
                setInputVisible(!followingFormElement.type.startsWith("image"));
              }, 500);
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                content: nextFormElement.content || nextFormElement.label,
                elementType: nextFormElement.type,
              },
            ]);
            setCurrentElement(nextElement);
            setInputVisible(!nextFormElement.type.startsWith("image"));
          }

          setSelectedRating(null);
          setSelectedDate(null);
        }, 500);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: "Thank you for completing the form!",
            },
          ]);
          setIsFormCompleted(true);
          setCurrentElement(nextElement);
          setInputVisible(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Error saving response:", err);
      setError("Failed to save your response");
      setInputVisible(true);
    }

    setUserInput("");
  };

  const handleFormSubmit = async () => {
    try {
      // Remove the session ID from localStorage when form is complete
      localStorage.removeItem(`form_session_${formId}`);
      alert("Form submitted successfully!");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit the form");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const RatingInput = () => (
    <div className={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={`${styles.ratingItem} ${
            selectedRating === rating ? styles.selectedRating : ""
          }`}
          onClick={() => handleRatingClick(rating)}
        >
          {rating}
        </button>
      ))}
    </div>
  );
    useEffect(() => {
        const fetchPublicForm = async () => {
            try {
                setIsLoading(true);
                // Use the public endpoint that doesn't require authentication
                const response = await api.get(`/forms/public/${shareToken}`);

                if (response.data.success) {
                    setForm(response.data.form);
                } else {
                    setError('Form not found');
                }
            } catch (err) {
                console.error('Error fetching form:', err);
                setError('Failed to load form');
            } finally {
                setIsLoading(false);
            }
        };

        if (shareToken) {
            fetchPublicForm();
        }
    }, [shareToken]);

  if (isLoading && !form) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div className={styles.maincontainer}>
          <div className={styles.themeToggle}>
              <span className={styles.colname}>Light</span>
              <label className={styles.change}>
                  <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className={styles.slider}></span>
              </label>
              <span className={styles.colname}>Dark</span>
          </div>
      <div className={styles.container}>
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputContainer}>
          {!isFormCompleted && inputVisible && (
            <>
              {form.elements[currentElement]?.type === "input-rating" ? (
                <RatingInput />
              ) : form.elements[currentElement]?.type === "input-date" ? (
                <DateInput />
              ) : (
                <div className={styles.inputWrapper}>
                  <input
                    type={
                      form.elements[currentElement]?.type === "input-number"
                        ? "number"
                        : "text"
                    }
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Enter ${form?.elements[
                      currentElement
                    ]?.label.toLowerCase()}`}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className={styles.sendButton}
                  >
                    <img src={sent} alt="" className={styles.sentbutton} />
                  </button>
                </div>
              )}
            </>
          )}
          {isFormCompleted && (
            <div className={styles.submitButtonContainer}>
              <button
                className={styles.finalSubmitButton}
                onClick={handleFormSubmit}
              >
                Submit Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
