import React, { useState } from 'react';


const CreateTypebotModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  darkMode,
  folders,
  currentWorkspace 
}) => {
  const [typebotName, setTypebotName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(
    currentWorkspace?.folders[0]?._id || ''
  );

  const handleSubmit = () => {
    if (typebotName.trim() === '') return;
    onSubmit({
      title: typebotName,
      folderId: selectedFolderId,
      fields: []
    });
    setTypebotName('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContainer} ${darkMode ? styles.darkMode : styles.lightMode}`}>
        <h2>Create New Typebot</h2>
        <input
          type="text"
          placeholder="Enter typebot name"
          value={typebotName}
          onChange={(e) => setTypebotName(e.target.value)}
          className={styles.modalInput}
        />
        <select
          value={selectedFolderId}
          onChange={(e) => setSelectedFolderId(e.target.value)}
          className={styles.modalInput}
        >
          {folders?.map(folder => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>
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

export default CreateTypebotModal;