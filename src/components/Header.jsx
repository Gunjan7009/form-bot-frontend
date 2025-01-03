import React, { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Dropdown from "./Dropdown";
import styles from "./Header.module.css";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentWorkspace,
  setCurrentWorkspace,
} from "../redux/workspaceSlice";

const Header = ({
  workspaceName,
  darkMode,
  setDarkMode,
  setIsShareModalOpen,
  navigate,
  shareEmail,
  setShareEmail,
  sharePermission,
  setSharePermission,
  handleShareInvite,
  isShareModalOpen,
}) => {
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const [shareLink, setShareLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/workspaces/generate-share-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workspaceId: currentWorkspace._id,
          permission: sharePermission
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate share link');
      }

      const data = await response.json();
      
      if (data && data.shareLink) {
        setShareLink(data.shareLink);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      setError(error.message || 'Failed to generate share link');
      setShareLink('');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      // Optionally show a success message
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOptionChange = (value) => {
    if (value === "settings") {
      navigate("/setting");
    } else if (value === "logout") {
      navigate("/");
    }
  };

  const handleWorkspaceChange = (workspace) => {
    dispatch(setCurrentWorkspace(workspace));
  };

  return (
    <header className={styles.dashboardHeader}>
      <WorkspaceSwitcher
        onWorkspaceChange={handleWorkspaceChange}
        currentWorkspace={currentWorkspace}
      />
      <Dropdown
        workspace={currentWorkspace?.name || "Select Workspace"}
        handleOptionChange={handleOptionChange}
      />
      <div className={styles.dashboardActions}>
        <div className={styles.themeToggle}>
          <span>Light</span>
          <label className={styles.change}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className={styles.slider}></span>
          </label>
          <span>Dark</span>
        </div>
        <button
          className={styles.shareButton}
          onClick={() => setIsShareModalOpen(true)}
        >
          Share
        </button>
        {isShareModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.sharemodalContainer}>
              <span
                className={styles.sharemodalCloseButton}
                onClick={() => {
                  setIsShareModalOpen(false);
                  setShareLink("");
                  setError(null);
                }}
              >
                <CloseOutlinedIcon />
              </span>
              <div className={styles.shareInputContainer}>
                <div className={styles.shareselectContainer}>
                  <p className={styles.sharepopupText}>Invite by Email</p>
                  <select
                    className={styles.sharedropdownSelect}
                    onChange={(e) => setSharePermission(e.target.value)}
                    value={sharePermission}
                  >
                    <option value="edit">Edit</option>
                    <option value="view">View</option>
                  </select>
                  <ArrowDropDownIcon
                    style={{
                      position: "relative",
                      left: "55%",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter email id"
                  className={styles.shareInput}
                />
                <button
                  className={styles.sharecopyButton}
                  onClick={handleShareInvite}
                >
                  Send Invite
                </button>
                <p className={styles.sharepopupText}>Invite by Link</p>
                {error && (
                  <p className={styles.errorMessage}>{error}</p>
                )}
                <div className={styles.shareLinkContainer}>
                  {shareLink ? (
                    <>
                      {/* <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className={styles.shareInput}
                      /> */}
                      <button
                        className={styles.sharecopyButton}
                        onClick={handleCopyLink}
                      >
                        Copy Link
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.sharecopyButton}
                      onClick={handleGenerateLink}
                      disabled={isGeneratingLink}
                    >
                      {isGeneratingLink ? "Generating..." : "Generate Link"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;