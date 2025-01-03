import React, { useEffect } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import styles from "./FolderList.module.css";
import { fetchWorkspaces} from "../redux/workspaceSlice";
import { useDispatch, useSelector } from "react-redux";


const FolderItem = ({ 
  folder, 
  isProcessing, 
  isSelected, 
  onDelete, 
  onClick 
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (folder && folder._id) {
      onDelete(folder);
    }
  };

  return (
    <div 
      className={`${styles.folderItem} 
        ${isProcessing ? styles.itemLoading : ''} 
        ${isSelected ? styles.folderItemSelected : ''}`}
      onClick={() => onClick(folder._id)}
    >
      <span className={styles.folderName}>
        {folder.name}
      </span>
      <button
        className={styles.folderDeleteButton}
        onClick={handleDeleteClick}
        disabled={isProcessing}
        aria-label={`Delete folder ${folder.name}`}
      >
        <DeleteForeverOutlinedIcon />
      </button>
    </div>
  );
};


const FolderList = ({ folders, openModal, selectedFolderId, setSelectedFolderId }) => {
  
  const operationInProgress = useSelector(state => state.workspaces.operationInProgress);
  
  
  const handleFolderClick = (folderId) => {
    if (operationInProgress) return;
    // If clicking the same folder, deselect it
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
      localStorage.removeItem('currentFolderId');
    } else {
      // Otherwise, select the clicked folder
      setSelectedFolderId(folderId);
      localStorage.setItem('currentFolderId', folderId);
    }
  };
  const handleDeleteClick = (folder) => {
    if (!folder?._id || operationInProgress) return;
    
    openModal("deleteItem", {
      _id: folder._id,
      name: folder.name,
      type: "folder"
    });
  };

  // if (loading) {
  //   return (
  //     <div className={styles.skeleton}>
  //       {Array.from({ length: 5 }).map((_, idx) => (
  //         <div key={idx} className={styles.skeletonFolder}></div>
  //       ))}
  //     </div>
  //   );
  // }

  
  return (
    <div className={styles.itemsContainer}>
    {Array.isArray(folders) && folders.length > 0 ? (
      folders.map((folder) => (
        folder && folder._id ? (
          <FolderItem
            key={folder._id}
            folder={folder}
            isProcessing={operationInProgress}
            isSelected={selectedFolderId === folder._id}
            onDelete={handleDeleteClick}
            onClick={handleFolderClick}
          />
        ) : null
      ))
    ) : (
      <div className={styles.noFolders}>No folders available.</div>
    )}
  </div>
  );
};

export default FolderList;