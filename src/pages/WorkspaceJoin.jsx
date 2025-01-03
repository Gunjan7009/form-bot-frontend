import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../data/api';
import styles from './WorkspaceJoin.module.css';
const WorkspaceJoin = () => {
  const { sharetoken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const joinWorkspace = async () => {
      try {
        // Verify token exists
        if (!sharetoken) {
          throw new Error('Invalid share link');
        }

        // Verify user is authenticated
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          navigate('/login', { state: { returnUrl: `/workspaces/join/${sharetoken}` } });
          return;
        }

        // Make the API call using the api instance
        const response = await api.post('/api/workspaces/join-via-link', {
          shareToken: sharetoken
        });

        // Handle successful join
        if (response.data.success) {
            setWorkspace(response.data.workspace);
            // Show success state briefly before redirecting
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            throw new Error(response.data.message || 'Failed to join workspace');
          }
      } catch (err) {
        console.error('Error joining workspace:', err);
        setError(err.response?.data?.message || err.message || 'Failed to join workspace');
      } finally {
        setLoading(false);
      }
    };

    joinWorkspace();
  }, [sharetoken, navigate]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.contentContainer}>
          <div className={styles.spinner}></div>
          <h2 className={styles.title}>Joining Workspace</h2>
          <p className={styles.message}>Please wait while we process your request...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.contentContainer}>
          <div className={styles.errorIcon}>!</div>
          <h2 className={styles.title}>Unable to Join Workspace</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className={styles.button}
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    if (workspace) {
      return (
        <div className={styles.contentContainer}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>Successfully Joined Workspace</h2>
          <p className={styles.message}>
            You have joined "{workspace.name}". Redirecting to dashboard...
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {renderContent()}
      </div>
    </div>
  );
};

export default WorkspaceJoin;