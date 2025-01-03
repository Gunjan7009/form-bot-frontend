import React, { useMemo } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import styles from "./TypebotList.module.css";
import { useSelector } from "react-redux";
import { selectWorkspaceLoading } from "../redux/workspaceSlice";

const TypebotList = ({ forms, folders, openModal, selectedFolderId, onTypebotClick }) => {
  const loading = useSelector(selectWorkspaceLoading);
  

  const displayedForms = useMemo(() => {
    if (!forms) return [];
    
    if (selectedFolderId) {
      // Show folder-specific forms
      const selectedFolder = folders?.find(f => f._id === selectedFolderId);
      if (!selectedFolder) return [];
      return forms.filter(form => selectedFolder.forms.includes(form._id));
    } else {
      // Show independent forms (not in any folder)
      return forms.filter(form => 
        !folders?.some(folder => 
          folder.forms.includes(form._id)
        )
      );
    }
  }, [selectedFolderId, folders, forms]);

  const handleTypebotClick = (formId) => {
    localStorage.setItem('currentFolderId', selectedFolderId);
    console.log(formId)
    onTypebotClick(formId);
  };

  const handleDeleteClick = (e, form) => {
    e.stopPropagation(); // Prevent opening the form when clicking delete
    openModal("deleteItem", { 
      _id: form._id,
      type: "typebot",
      folderId: selectedFolderId || null,  // This will be null for independent typebots
      title: form.title,
      isIndependent: !selectedFolderId
    });
  };

  return (
    <div className={styles.itemsContainer}>
      {loading ? (
        <div className={styles.skeleton}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className={styles.skeletonTypebot}></div>
          ))}
        </div>
      ) : (
        <>
          <div 
            className={styles.typebotCard} 
            onClick={() => openModal(selectedFolderId ? "createTypebot" : "createIndependentTypebot")}
          >
            <div className={styles.plusIcon}>+</div>
            <div>Create a typebot</div>
          </div>
          {displayedForms.map((form) => (
            <div 
              key={form._id} 
              className={styles.typebot}
              onClick={() => handleTypebotClick(form._id)}
            >
              <div className={styles.typebotName}>{form.title}</div>
              <button
                className={styles.typebotDeleteButton}
                onClick={(e) => handleDeleteClick(e, form)}
              >
                <DeleteForeverOutlinedIcon />
              </button>
            </div>
          ))}
          {!selectedFolderId && displayedForms.length === 0 && (
            <div className={styles.noTypebots}>
              No independent typebots created yet
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default TypebotList;