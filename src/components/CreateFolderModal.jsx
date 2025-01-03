import React, { useState } from 'react';


const CreateFolderModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  darkMode 
}) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = () => {
    if (folderName.trim() === '') return;
    onSubmit(folderName);
    setFolderName('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContainer} ${darkMode ? styles.darkMode : styles.lightMode}`}>
        <h2>Create New Folder</h2>
        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className={styles.modalInput}
        />
        <div className={styles.modalActions}>
          <button onClick={handleSubmit} className={styles.modalButton}>
            Done
          </button>
          <img src="/linevert" className={styles.linevert} alt="Separator" />
          <button onClick={onClose} className={styles.modalCancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;