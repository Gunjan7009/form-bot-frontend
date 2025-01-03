import React, { useEffect, useState, useRef, useCallback } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { X } from "lucide-react";
import {
  TextBubbleIcon,
  ImageBubbleIcon,
  VideoBubbleIcon,
  GifBubbleIcon,
  TextInputIcon,
  NumberInputIcon,
  EmailInputIcon,
  PhoneInputIcon,
  DateInputIcon,
  RatingInputIcon,
  ButtonInputIcon,
} from "./FormIcons";
import api from "../data/api";
import styles from "./FormBuilder.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { use } from "react";
import { useDispatch } from "react-redux";
import { updateFormContent } from "../redux/workspaceSlice";
import FormResponses from "./FormResponses";

const useClickOutside = (ref, callback, active) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (active && ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, active]);
};

const bubbleElements = [
  {
    id: "text",
    label: "Text",
    icon: <TextBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "image",
    label: "Image",
    icon: <ImageBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "video",
    label: "Video",
    icon: <VideoBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "gif",
    label: "GIF",
    icon: <GifBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "input-text",
    label: "Text",
    icon: <TextInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-number",
    label: "Number",
    icon: <NumberInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-email",
    label: "Email",
    icon: <EmailInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-phone",
    label: "Phone",
    icon: <PhoneInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-date",
    label: "Date",
    icon: <DateInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-rating",
    label: "Rating",
    icon: <RatingInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-button",
    label: "Button",
    icon: <ButtonInputIcon />,
    category: "Inputs",
  },
];

const FormElement = ({
  element,
  selectedElementId,
  onSelect,
  onUpdate,
  isInput,
  onDelete,
}) => {
  const elementRef = useRef(null);
  const editableRef = useRef(null);

  useClickOutside(
    elementRef,
    () => {
      onUpdate(element.id, { isEditing: false });
    },
    element.isEditing
  );

  const handleClick = (e) => {
    e.stopPropagation();
    onUpdate(element.id, { isEditing: true });
    onSelect(element.id);
    setTimeout(() => {
      editableRef.current?.focus();
    }, 0);
  };
  const handleLabelBlur = (e) => {
    const newLabel = e.target.textContent.trim();
    onUpdate(element.id, {
      label: newLabel || "Untitled Element",
      isEditing: false,
    });
  };

  const inputHints = {
    "input-text": "Hint: User will input text in this field.",
    "input-number": "Hint: User will input a number in this field.",
    "input-email": "Hint: User will input an email in this field.",
    "input-phone": "Hint: User will input a phone number in this field.",
    "input-date": "Hint: User will select a date in this field.",
    "input-rating": "Hint: User will give a rating in this field.",
    "input-button": "Hint: This will be a button for user interaction.",
  };
  const handleContentBlur = (e) => {
    const newContent = e.target.value.trim();
    const isValid =
      (element.type === "input-email" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContent)) ||
      (element.type === "input-number" && /^\d+$/.test(newContent)) ||
      (element.type !== "input-email" && element.type !== "input-number");

    onUpdate(element.id, {
      content: isValid ? newContent : element.content, // Keep original content if invalid
      isEditing: false,
    });

    if (!isValid) {
      alert("Invalid input value!"); // Replace with a better UI for errors.
    }
  };
  const elementData = bubbleElements.find((el) => el.id === element.type);
  // const containerClass = isInput ? 'input' : 'bubble';
  const isImage = element.type === "image";

  return (
    <div
      ref={elementRef}
      className={`${styles["element-container"]} ${
        element.id === selectedElementId ? styles.selected : ""
      }`}
      onClick={handleClick}
    >
      <div className={styles["element-header"]}>
        <span
          className={`${styles["element-label"]} ${styles["editable-field"]}`}
          contentEditable={!element.isEditing}
          suppressContentEditableWarning
          onClick={(e) => e.stopPropagation()}
          onBlur={handleLabelBlur}
          data-placeholder="Enter label"
        >
          {element.label || elementData.label}
        </span>
        <button
          className={styles["delete-btn"]}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(element.id);
          }}
        >
          <DeleteForeverOutlinedIcon />
        </button>
      </div>

      <div
        className={`${styles["element-details"]} ${
          element.isEditing ? styles.editing : ""
        }`}
      >
        <div className={styles["element-icon-wrapper"]}>
          {elementData?.icon}
        </div>
        {isInput ? (
          <div className={styles["element-hint"]}>
            <span className={styles["hint-text"]}>
              {inputHints[element.type]}
            </span>
          </div>
        ) : (
          <div className={styles["element-message"]}>
            {element.isEditing ? (
              <input
                ref={editableRef}
                className={styles["editable-input"]}
                type="text"
                value={element.content || ""}
                onChange={(e) =>
                  onUpdate(element.id, { content: e.target.value })
                }
                onBlur={(e) => {
                  onUpdate(element.id, {
                    content: e.target.value.trim(),
                    isEditing: false,
                  });
                }}
                placeholder={isImage ? "Enter image URL" : "Enter content"}
                autoFocus
              />
            ) : (
              <p
                ref={editableRef}
                className={styles["editable-field"]}
                contentEditable
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(element.id, { isEditing: true });
                  setTimeout(() => editableRef.current?.focus(), 0);
                }}
                onBlur={(e) => {
                  const newContent = e.target.textContent.trim();
                  onUpdate(element.id, {
                    content: newContent,
                    isEditing: false,
                  });
                }}
              >
                {element.content}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FormBuilder = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState("");
  const [activeTab, setActiveTab] = useState("flow"); // New state for Flow/Response toggle
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [formId, setFormId] = useState();  // Add this new state
  const { formId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch form data using the current formId
        const token = localStorage.getItem("token");
        const workspaceId = localStorage.getItem("currentWorkspaceId");
        const folderId = localStorage.getItem("currentFolderId");

        if (!workspaceId || !folderId) {
          throw new Error("Workspace or folder information missing");
        }

        const response = await api.get(`/forms/form/${formId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(formId);
        if (response.data) {
          const { formName, elements, responses } = response.data.form;
          console.log(response.data);
          // Update local state with fetched data
          setFormName(formName || "Untitled Form");
          setFormElements(elements || []);
          setResponses(responses || {});
        } else {
          throw new Error("No form data found");
        }
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Failed to load form data.");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch the form data on formId change
    fetchFormData();

    // Clear/reset states when the formId changes
    return () => {
      setFormName("");
      setFormElements([]);
      setResponses({});
    };
  }, [formId]); // Dependency ensures it runs when formId changes

  const saveFormToDatabase = async () => {
    try {
      setIsLoading(true);

      const workspaceId = localStorage.getItem("currentWorkspaceId");
      const folderId = localStorage.getItem("currentFolderId"); // You'll need to set this when selecting a folder

      if (!workspaceId || !folderId) {
        throw new Error("Workspace or folder information missing");
      }

      const formData = {
        formId: formId,
        formName: formName.trim() || "Untitled Form",
        elements: formElements.map((el) => ({
          ...el,
          label: el.label.trim() || "Untitled Element",
          content: el.content?.trim() || "",
        })),
        responses,
      };
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("Form dataID:", formData.formId);
      const result = await dispatch(
        updateFormContent({
          workspaceId,
          folderId,
          formId: formData.formId,
          formData,
        })
      ).unwrap();
      return result;
    } catch (error) {
      setError("Failed to save form");
      console.error("Error saving form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteElement = (id) => {
    setFormElements((prevElements) => {
      const updated = prevElements.filter((el) => el.id !== id);
      saveFormToDatabase();
      return updated;
    });
  };
  const addElement = useCallback(
    (elementType) => {
      const id = Date.now();
      const elementDefinition = bubbleElements.find(
        (el) => el.id === elementType
      );

      const newElement = {
        type: elementType,
        id,
        label: elementDefinition ? elementDefinition.label : "Add a label",
        content: elementType.startsWith("input-") ? "" : "Click to add link",
        isEditing: false,
      };
      setFormElements((prev) => {
        const updated = [...prev, newElement];
        return updated;
      });
      setSelectedElementId(id);
    },
    [formName, responses]
  );

  const updateElement = (id, updates) => {
    setFormElements((prevElements) => {
      const updated = prevElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      return updated;
    });
  };

  const handleResponseChange = (id, value) => {
    const element = formElements.find((el) => el.id === id);
    if (element && element.label) {
      const updatedResponses = {
        ...responses,
        [element.label]: value,
      };
      setResponses(updatedResponses);
    }
  };

  const handleManualSave = async () => {
    if (formElements.length === 0) {
      alert("Please add elements to your form before saving.");
      return;
    }
    await saveFormToDatabase();
    alert("Form saved successfully!");
  };

  const handleShare = async () => {
    try {
      let currentFormId = formId;

      if (!currentFormId) {
        // Save the form first if it doesn't have an ID
        const savedForm = await saveFormToDatabase();
        if (savedForm?.data?.form?._id) {
          currentFormId = savedForm.data.form._id;
        } else {
          throw new Error("Failed to retrieve form ID after saving.");
        }
      }

      // Proceed to share the form
      const response = await api.post(`/forms/share/${currentFormId}`);
      if (response.data.success) {
        alert(`Form shared! Shareable URL: ${response.data.shareableUrl}`);
        navigate(`/chatbot/${currentFormId}`);
      } else {
        throw new Error("Failed to share the form.");
      }
    } catch (error) {
      console.error("Error sharing form:", error);
      alert("Failed to share form. Please try again.");
    }
  };

  return (
    <div
      className={`${styles["app-container"]} ${
        isDarkMode ? styles["dark-mode"] : styles["light-mode"]
      }`}
      >
      {isLoading ? (
        <div className={styles["loading-container"]}>
          <p>Loading form...</p>
        </div>
      ) : error ? (
        <div className={styles["error-container"]}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <header className={styles.header}>
            <div className={styles["header-content"]}>
              <input
                type="text"
                placeholder="Enter Form Name"
                className={styles["form-name-input"]}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />

              <div className={styles["toggle-container"]}>
                <button
                  className={`${styles["toggle-btn"]} ${
                    activeTab === "flow" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("flow")}
                >
                  Flow
                </button>
                <button
                  className={`${styles["toggle-btn"]} ${
                    activeTab === "response" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("response")}
                >
                  Response
                </button>
              </div>

              <div className={styles["header-buttons"]}>
                <div className={styles.themeToggle}>
                  <span>Light</span>
                  <label className={styles.change}>
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(!isDarkMode)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <span>Dark</span>
                </div>
                <button className={styles["share-btn"]} onClick={handleShare}>
                  Share
                </button>
                <button
                  className={styles["save-btn"]}
                  onClick={handleManualSave}
                >
                  Save
                </button>
                <button className={styles["close-btn"]}>
                  <X size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className={styles["main-container"]}>
            {activeTab === "flow" && (
              <>
                <div className={styles.sidebar}>
                  {["Bubbles", "Inputs"].map((category) => (
                    <div key={category} className={styles["category-section"]}>
                      <h2 className={styles["category-title"]}>{category}</h2>
                      <div className={styles["elements-grid"]}>
                        {bubbleElements
                          .filter((element) => element.category === category)
                          .map((element) => (
                            <button
                              key={element.id}
                              onClick={() => addElement(element.id)}
                              className={styles["element-button"]}
                            >
                              <span className={styles["element-icon"]}>
                                {element.icon}
                              </span>
                              <span className={styles["element-label"]}>
                                {element.label}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles["content-area"]}>
                  <div className={styles["start-block"]}>
                    <div className={styles["start-text"]}>
                      <div className={styles["start-icon"]}>
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 0V21H2.625V0H0ZM5.25 0V10.5H10.5V13.125H21L15.75 7.95375L21 2.625H13.125V0L5.25 0Z"
                            fill={isDarkMode ? "#FFFFFF" : "#1A5fff"}
                          />
                        </svg>
                      </div>
                      <p className={styles.starttext}> Start</p>
                    </div>
                  </div>
                  <div className={styles["form-elements"]}>
                    {formElements.length === 0 ? (
                      <div>No elements found for this form.</div>
                    ) : (
                      formElements.map((element) => (
                        <FormElement
                          key={element.id}
                          element={element}
                          selectedElementId={selectedElementId}
                          onSelect={setSelectedElementId}
                          onUpdate={updateElement}
                          isInput={element.type.startsWith("input-")}
                          onInputChange={handleResponseChange}
                          onDelete={deleteElement}
                        />
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
            {/* {activeTab === "response" && (
            <div className={styles["responses-view"]}>
            <h2>Collected Responses</h2>
            {Object.entries(responses).map(([key, value]) => (
              <div key={key} className={styles["response-item"]}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
            </div>
               )} */}
            {activeTab === "response" && <FormResponses formId={formId} />}
          </div>
        </>
      )}
    </div>
  );
};

export default FormBuilder;
