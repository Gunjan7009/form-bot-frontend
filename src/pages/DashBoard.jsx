import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./DashBoard.module.css";
import {
  fetchWorkspaces,
  createFolder,
  deleteFolder,
  createTypebot,
  deleteTypebot,
  shareWorkspace,
  selectWorkspaces,
  selectCurrentWorkspace,
  selectWorkspaceLoading,
  selectWorkspaceError,
  createIndependentTypebot,
  setCurrentWorkspace,
  deleteIndependentTypebot
} from "../redux/workspaceSlice";
import Header from "../components/Header";
import WorkspaceActions from "../components/WorkspaceActions";
import FolderList from "../components/FolderList";
import TypebotList from "../components/TypebotList";
import LoadingOverlay from "./LoadingOverlay";

const Modals = React.lazy(() => import("../components/Modals"));

const DashBoard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("edit");
  // const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [workspaceError, setWorkspaceError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workspaces = useSelector(selectWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const loading = useSelector(selectWorkspaceLoading);
  const error = useSelector(selectWorkspaceError);
  const { name } = useSelector((state) => state.auth);

  const workspaceName = currentWorkspace?.name || `${name}'s workspace`;

  useEffect(() => {
    const initializeWorkspace = async () => {
      setLoadingInitial(true);
      try {
        // Get workspaces from localStorage first
        const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
        
        // Fetch workspaces from the server
        const workspacesResult = await dispatch(fetchWorkspaces()).unwrap();
        
        if (workspacesResult?.length > 0) {
          let workspaceToSet;
          
          if (savedWorkspaceId) {
            // If we have a saved workspace ID, try to find it in the results
            workspaceToSet = workspacesResult.find(w => w._id === savedWorkspaceId);
          }
          
          // If we couldn't find the saved workspace or didn't have one, use the first workspace
          if (!workspaceToSet) {
            workspaceToSet = workspacesResult[0];
          }
          
          dispatch(setCurrentWorkspace(workspaceToSet));
          localStorage.setItem('currentWorkspaceId', workspaceToSet._id);
        }
      } catch (err) {
        setWorkspaceError("Failed to load workspace. Please try again.");
        console.error("Workspace initialization error:", err);
      } finally {
        setLoadingInitial(false);
      }
    };

    initializeWorkspace();
  }, [dispatch]);

  useEffect(() => {
    if (currentWorkspace?._id) {
      localStorage.setItem('currentWorkspaceId', currentWorkspace._id);
    }
  }, [currentWorkspace]);
  

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleCreateItem = async () => {
    if (!inputValue.trim()) {
      setWorkspaceError("Please enter a name");
      return;
    }

    if (!currentWorkspace?._id) {
      setWorkspaceError("No workspace selected. Please refresh the page.");
      return;
    }
    setIsProcessing(true); 
    // setLoadingWorkspace(true);
    try {
      if (action === "createFolder") {
        await dispatch(
          createFolder({
            workspaceId: currentWorkspace._id,
            name: inputValue,
          })
        ).unwrap();
      } else if (action === "createTypebot") {
        if (!selectedFolderId) {
          setWorkspaceError("Please select a folder first");
          return;
        }
        await dispatch(
          createTypebot({
            workspaceId: currentWorkspace._id,
            folderId: selectedFolderId,
            title: inputValue,
          })
        ).unwrap();
      } else if (action === "createIndependentTypebot") {
        await dispatch(
          createIndependentTypebot({
            workspaceId: currentWorkspace._id,
            title: inputValue,
          })
        ).unwrap();
      }
      setIsModalOpen(false);
      setInputValue("");
      setWorkspaceError(null);
    } catch (error) {
      setWorkspaceError(error.message || "Failed to create item");
      console.error("Error creating item:", error);
    } finally {
      // setLoadingWorkspace(false);
      setIsProcessing(false); 
    }
  };

  const handleFolderDeselect = () => {
    setSelectedFolderId(null);
    localStorage.removeItem('currentFolderId');
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !currentWorkspace) return;

    setIsProcessing(true);
    // setLoadingWorkspace(true);
    try {
      if (itemToDelete.type === "folder") {
       await dispatch(
          deleteFolder({
            workspaceId: currentWorkspace._id,
            folderId: itemToDelete._id,
          })
        ).unwrap();
      } else if (itemToDelete.type === "typebot") {
        if (itemToDelete.folderId) {
          // Delete folder-based typebot
          await dispatch(
            deleteTypebot({
              workspaceId: currentWorkspace._id,
              folderId: itemToDelete.folderId,
              formId: itemToDelete._id,
            })
          ).unwrap();
        } else {
          // Delete independent typebot
          await dispatch(
            deleteIndependentTypebot({
              workspaceId: currentWorkspace._id,
              formId: itemToDelete._id,
            })
          ).unwrap();
        }
      }
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      setWorkspaceError(error.message || "Failed to delete item");
      console.error("Error deleting item:", error);
    } finally {
      // setLoadingWorkspace(false);
      setIsProcessing(false);
    }
  };

  const handleShareInvite = async () => {
    try {
     dispatch(
        shareWorkspace({
          workspaceId: currentWorkspace._id,
          email: shareEmail,
          permission: sharePermission,
        })
      );
      setIsShareModalOpen(false);
      setShareEmail("");
    } catch (error) {
      console.error("Error sharing workspace:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
    setItemToDelete(null);
  };

  const openModal = (actionType, item = null) => {
    setAction(actionType);
    setItemToDelete(item);
    setIsModalOpen(true);
  };
  
  if (loadingInitial) {
    return <div className={styles.loading}>Loading workspace...</div>;
  }

  if (workspaceError) {
    return <div className={styles.error}>{workspaceError}</div>;
  }

  if (!currentWorkspace) {
    return <div className={styles.error}>No workspace found. Please refresh the page.</div>;
  }

  // const handleCreateIndependentTypebot = async () => {
  //   if (!inputValue.trim()) {
  //     setWorkspaceError("Please enter a name");
  //     return;
  //   }
  
  //   if (!currentWorkspace?._id) {
  //     setWorkspaceError("No workspace selected. Please refresh the page.");
  //     return;
  //   }
  
  //   setLoadingWorkspace(true);
  //   try {
  //     await dispatch(
  //       createTypebot({
  //         workspaceId: currentWorkspace._id,
  //         title: inputValue,
  //       })
  //     ).unwrap();
      
  //     setIsModalOpen(false);
  //     setInputValue("");
  //     setWorkspaceError(null);
  //   } catch (error) {
  //     setWorkspaceError(error.message || "Failed to create typebot");
  //     console.error("Error creating typebot:", error);
  //   } finally {
  //     setLoadingWorkspace(false);
  //   }
  // };

  return (
    <div className={styles.dashboardContainer}>
      {isProcessing && <LoadingOverlay />}
      <Header
        workspaceName={workspaceName}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setIsShareModalOpen={setIsShareModalOpen}
        navigate={navigate}
        shareEmail={shareEmail}
        setShareEmail={setShareEmail}
        sharePermission={sharePermission}
        setSharePermission={setSharePermission}
        handleShareInvite={handleShareInvite}
        isShareModalOpen={isShareModalOpen}
      />
      <main className={styles.dashboardContent}>
        <div className={styles.foldercontent}>
        <WorkspaceActions openModal={openModal} />
        <FolderList
          folders={currentWorkspace?.folders}
          openModal={openModal}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
        />
        </div>
        <div className={styles.typebotcontent}>
        <TypebotList
          forms={currentWorkspace?.forms}
          folders={currentWorkspace?.folders}
          openModal={openModal}
          selectedFolderId={selectedFolderId}
          onTypebotClick={(formId) => navigate(`/formbuilding/${formId}`)}
        />
        </div>
      </main>
      <Suspense fallback={<div>Loading...</div>}>
      <Modals
        isModalOpen={isModalOpen}
        action={action}
        darkMode={darkMode}
        inputValue={inputValue}
        setInputValue={setInputValue}
        itemToDelete={itemToDelete}
        handleCreateItem={handleCreateItem}
        handleDeleteConfirm={handleDeleteConfirm}
        closeModal={closeModal}
        currentWorkspace={currentWorkspace}
        // createIndependentTypebot={handleCreateIndependentTypebot}
      />
      </Suspense>
    </div>
  );
};

export default DashBoard;