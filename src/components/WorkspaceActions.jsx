import React from "react";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import styles from "./WorkspaceActions.module.css";

const WorkspaceActions = ({ openModal }) => (
    <div className={styles.addFolder}>
        <button
            className={styles.createFolderButton}
            onClick={() => openModal("createFolder")}
        >
            <span>
                <CreateNewFolderOutlinedIcon />
            </span>
            Create a folder
        </button>
    </div>
);

export default WorkspaceActions;
