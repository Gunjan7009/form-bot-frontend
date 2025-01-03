import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import {
  selectWorkspaces,
  selectCurrentWorkspace,
  setCurrentWorkspace
} from '../redux/workspaceSlice';
import styles from './WorkspaceSwitcher.module.css';


const groupWorkspaces = (workspaces, user) => {
    const ownedWorkspaces = workspaces.filter(w => w.owner === user.id);
    const sharedWorkspaces = workspaces.filter(w =>
      w.sharedWith?.some(share => share.user === user.id)
    );
  
    return [
      { id: 'owned', label: 'Your Workspaces', items: ownedWorkspaces },
      { id: 'shared', label: 'Shared With You', items: sharedWorkspaces }
    ].filter(group => group.items.length > 0);
  };

  const WorkspaceSwitcher = ({ onWorkspaceChange, currentWorkspace }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [workspaceGroups, setWorkspaceGroups] = useState([]);
    const dispatch = useDispatch();
    const workspaces = useSelector(selectWorkspaces);
    // const currentWorkspace = useSelector(selectCurrentWorkspace);
    const { user, isAuthenticated } = useSelector(state => state.auth);
  
    useEffect(() => {
      if (workspaces && isAuthenticated && user) {
        setWorkspaceGroups(groupWorkspaces(workspaces, user));
      }
    }, [workspaces, user, isAuthenticated]);
  
    const handleWorkspaceSelect = async workspace => {
        try {
          await dispatch(setCurrentWorkspace(workspace)).unwrap();
          localStorage.setItem('currentWorkspaceId', workspace._id);
          setIsOpen(false);
          onWorkspaceChange?.(workspace); // Call the callback with the selected workspace
        } catch (error) {
          console.error('Error switching workspace:', error);
          alert('Failed to switch workspace. Please try again.');
        }
      };
  
    const getPermissionLabel = workspace => {
      if (!isAuthenticated || !user) return '';
      if (workspace.owner === user.id) return '';
      const share = workspace.sharedWith?.find(s => s.user === user.id);
      return share ? ` (${share.permission})` : '';
    };
  
    if (!isAuthenticated || !user) return null;
  
    return (
      <div className={styles.workspaceSwitcher}>
  
        {isOpen && (
          <div className={styles.dropdownContainer} role="menu">
            {workspaceGroups.map(group => (
              <div key={group.id} className={styles.workspaceGroup}>
                <div className={styles.groupLabel}>{group.label}</div>
                {group.items.map(workspace => (
                  <button
                    key={workspace._id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className={styles.workspaceItem}
                    role="menuitem"
                    data-testid={`workspace-item-${workspace._id}`}
                  >
                    <span>{workspace.name}</span>
                    <span className={styles.permissionLabel}>
                      {getPermissionLabel(workspace)}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default WorkspaceSwitcher;