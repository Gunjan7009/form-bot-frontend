import React, { useState, useCallback } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectUserWorkspaces,
    selectSharedWorkspaces,
    selectCurrentWorkspace,
    setCurrentWorkspace,
  } from '../redux/workspaceSlice';
  import styles from "./Dropdown.module.css";

const Dropdown = ({ handleOptionChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();

    const userWorkspaces = useSelector(selectUserWorkspaces);
    const sharedWorkspaces = useSelector(selectSharedWorkspaces);
    const currentWorkspace = useSelector(selectCurrentWorkspace);
    // Toggles the dropdown visibility
    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen((prev) => !prev);
    }, []);

    // Handles option selection and notifies parent
    // const handleOptionClick = useCallback((value) => {
    //     handleOptionChange(value);
    //     setIsDropdownOpen(false); // Close dropdown after selection
    // }, [handleOptionChange]);

    const handleWorkspaceChange = (workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        setIsDropdownOpen(false);
      };

    //   const allWorkspaces = [
    //     ...userWorkspaces.map(workspace => ({ ...workspace, type: "Your Workspace" })),
    //     ...sharedWorkspaces.map(workspace => ({ ...workspace, type: "Shared Workspace" }))
    //   ];
  
    const filteredUserWorkspaces = userWorkspaces.filter(
      (workspace) => workspace._id !== currentWorkspace?._id
    );
    const filteredSharedWorkspaces = sharedWorkspaces.filter(
      (workspace) => workspace._id !== currentWorkspace?._id
    );

    return (
        <div className={styles.dropdownContainer}>
            <button
                onClick={toggleDropdown}
                className={styles.dropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
            >
               <span>{currentWorkspace?.name || "Select Workspace"}</span>
        <KeyboardArrowDownOutlinedIcon
          className={`${styles.arrowIcon} ${isDropdownOpen ? styles.arrowIconOpen : ""}`}
        />
      </button>

      {isDropdownOpen && (
 <ul className={styles.dropdownMenu} role="menu">
         {filteredUserWorkspaces.length > 0 && (
          <>
            {filteredUserWorkspaces.map((workspace) => (
              <li
                key={workspace._id}
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => handleWorkspaceChange(workspace)}
              >
                {workspace.name}
              </li>
            ))}
          </>
        )}
        {filteredSharedWorkspaces.length > 0 && (
          <>
            {filteredSharedWorkspaces.map((workspace) => (
              <li
                key={workspace._id}
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => handleWorkspaceChange(workspace)}
              >
                {workspace.name}
              </li>
            ))}
          </>
        )}
        <li className={styles.dropdownDivider} />
        <li
          className={styles.dropdownItem}
          role="menuitem"
          onClick={() => handleOptionChange("settings")}
        >
          Settings
        </li>
        <li
          className={`${styles.dropdownItem} ${styles.logoutItem}`}
          role="menuitem"
          onClick={() => handleOptionChange("logout")}
        >
          Log Out
        </li>
      </ul>
    )}
  </div>
);
};
export default Dropdown;
