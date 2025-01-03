import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../data/api';

// Utility to handle errors
const handleApiError = (error) => error.response?.data || error.message || 'An error occurred';

// Reusable loading state helper
const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const setErrorState = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Fetch user's workspaces
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/workspaces/get');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Share workspace
export const shareWorkspace = createAsyncThunk(
  'workspaces/share',
  async ({ workspaceId, email, permission }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/workspaces/share', {
        workspaceId,
        email,
        permission,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create folder
export const createFolder = createAsyncThunk(
  'workspaces/createFolder',
  async ({ workspaceId, name }, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(`/api/workspaces/${workspaceId}/folders`, { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete folder
export const deleteFolder = createAsyncThunk(
  'workspaces/deleteFolder',
  async ({ workspaceId, folderId }, { rejectWithValue, getState }) => {
    try {
      const response = await api.delete(`/api/workspaces/${workspaceId}/folders/${folderId}`);
      return { workspaceId, folderId, ...response.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create typebot
export const createTypebot = createAsyncThunk(
  'workspaces/createTypebot',
  async ({ workspaceId, folderId, title, fields }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/folders/${folderId}/typebots`,
        { title, fields }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete typebot
export const deleteTypebot = createAsyncThunk(
  'workspaces/deleteTypebot',
  async ({ workspaceId, folderId, formId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/workspaces/${workspaceId}/folders/${folderId}/typebots/${formId}`
      );
      return { workspaceId, folderId, formId, ...response.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteIndependentTypebot = createAsyncThunk(
  'workspaces/deleteIndependentTypebot',
  async ({ workspaceId, formId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/workspaces/${workspaceId}/typebots/${formId}`
      );
      return { 
        workspaceId, 
        formId,
        ...response.data 
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Update form content
export const updateFormContent = createAsyncThunk(
  'workspaces/updateFormContent',
  async ({ workspaceId, folderId, formId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/forms/form/${formId}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createIndependentTypebot = createAsyncThunk(
  'workspace/createIndependentTypebot',
  async ({ workspaceId, title }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/typebots/independent`,
        { title }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    items: [],
    userWorkspaces: [], // Workspaces created by the logged-in user
    sharedWorkspaces: [], // Workspaces shared with the user
    loading: false,
    operationInProgress: false,
    error: null,
    currentWorkspace: JSON.parse(localStorage.getItem('currentWorkspace')) || null,
  },
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
      if (action.payload) {
        localStorage.setItem('currentWorkspace', JSON.stringify(action.payload));
        localStorage.setItem('currentWorkspaceId', action.payload._id);
      } else {
        localStorage.removeItem('currentWorkspace');
        localStorage.removeItem('currentWorkspaceId');
      }
    },
    clearWorkspaces: (state) => {
      state.items = [];
      state.userWorkspaces = [];
      state.sharedWorkspaces = [];
      state.currentWorkspace = null;
      localStorage.removeItem('currentWorkspace');
      localStorage.removeItem('currentWorkspaceId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, setLoadingState)
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        const workspaces = action.payload;
        state.items = workspaces;
        state.userWorkspaces = workspaces.filter(
          workspace => workspace.owner._id === localStorage.getItem('userId')
        );
        state.sharedWorkspaces = workspaces.filter(
          workspace => workspace.sharedWith.some(
            share => share.user._id === localStorage.getItem('userId')
          )
        );
        if (!state.currentWorkspace) {
          const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
          if (savedWorkspaceId) {
            state.currentWorkspace = workspaces.find(w => w._id === savedWorkspaceId);
          }
          // If no saved workspace or saved workspace not found, default to first user workspace
          if (!state.currentWorkspace && state.userWorkspaces.length > 0) {
            state.currentWorkspace = state.userWorkspaces[0];
            localStorage.setItem('currentWorkspace', JSON.stringify(state.userWorkspaces[0]));
            localStorage.setItem('currentWorkspaceId', state.userWorkspaces[0]._id);
          }
          // If no user workspaces, try shared workspaces
          else if (!state.currentWorkspace && state.sharedWorkspaces.length > 0) {
            state.currentWorkspace = state.sharedWorkspaces[0];
            localStorage.setItem('currentWorkspace', JSON.stringify(state.sharedWorkspaces[0]));
            localStorage.setItem('currentWorkspaceId', state.sharedWorkspaces[0]._id);
          }
  }})
      .addCase(fetchWorkspaces.rejected, setErrorState)
      .addCase(shareWorkspace.pending, setLoadingState)
      .addCase(shareWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWorkspace = action.payload.workspace;
        const index = state.items.findIndex((w) => w._id === updatedWorkspace._id);
        if (index !== -1) state.items[index] = updatedWorkspace;
      })
      .addCase(shareWorkspace.rejected, setErrorState)
      .addCase(createFolder.pending,  (state, action) => {
         state.operationInProgress = true;
        // Optimistically add the folder
        const { workspaceId, name } = action.meta.arg;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          const tempId = `temp-${Date.now()}`;
          const newFolder = { _id: tempId, name, forms: [] };
          workspace.folders.push(newFolder);
          if (state.currentWorkspace?._id === workspaceId) {
            state.currentWorkspace = { ...workspace };
          }
        }
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.operationInProgress = false;
        const updatedWorkspace = action.payload;
        const index = state.items.findIndex(w => w._id === updatedWorkspace._id);
        if (index !== -1) {
          state.items[index] = updatedWorkspace;
          if (state.currentWorkspace?._id === updatedWorkspace._id) {
            state.currentWorkspace = updatedWorkspace;
          }
        }
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.operationInProgress = false;
        state.error = action.payload;
        // Revert the optimistic update
        const { workspaceId } = action.meta.arg;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          workspace.folders = workspace.folders.filter(f => !f._id.startsWith('temp-'));
          if (state.currentWorkspace?._id === workspaceId) {
            state.currentWorkspace = { ...workspace };
          }
        }
      })
      .addCase(deleteFolder.pending, (state, action) => {
        state.operationInProgress = true;
        // Optimistically remove the folder
        const { workspaceId, folderId } = action.meta.arg;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          workspace.folders = workspace.folders.filter(f => f._id !== folderId);
          if (state.currentWorkspace?._id === workspaceId) {
            state.currentWorkspace = { ...workspace };
          }
        }
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.operationInProgress = false;
        state.loading = false;
        const { workspaceId, folderId } = action.payload;
        const workspace = state.items.find((w) => w._id === workspaceId);
        if (workspace) workspace.folders = workspace.folders.filter((f) => f._id !== folderId);
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.operationInProgress = false;
        state.error = action.payload;
        // Revert the optimistic delete by refetching the workspace
        // dispatch(fetchWorkspaces());
      })
      // Create typebot cases
      .addCase(createTypebot.pending, setLoadingState)
      .addCase(createTypebot.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWorkspace = action.payload;
        const index = state.items.findIndex(w => w._id === updatedWorkspace._id);
        if (index !== -1) {
          state.items[index] = updatedWorkspace;
          if (state.currentWorkspace?._id === updatedWorkspace._id) {
            state.currentWorkspace = updatedWorkspace;
          }
        }
      })
      .addCase(createTypebot.rejected, setErrorState)
      .addCase(createIndependentTypebot.pending, setLoadingState)
      .addCase(createIndependentTypebot.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentWorkspace) {
          state.currentWorkspace.forms.push(action.payload.form);
        }
      })
      .addCase(createIndependentTypebot.rejected, setErrorState)
      // Delete typebot cases
      .addCase(deleteTypebot.pending, setLoadingState)
      .addCase(deleteTypebot.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, folderId, formId } = action.payload;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          const folder = workspace.folders.find(f => f._id === folderId);
          if (folder) {
            folder.forms = folder.forms.filter(f => f !== formId);
            workspace.forms = workspace.forms.filter(f => f._id !== formId);
            if (state.currentWorkspace?._id === workspaceId) {
              state.currentWorkspace = { ...workspace };
            }
          }
        }
      })
      .addCase(deleteTypebot.rejected, setErrorState)
      .addCase(deleteIndependentTypebot.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, formId } = action.payload;
        const workspace = state.items.find(w => w._id === workspaceId);
        
        if (workspace) {
          // Remove the form from workspace forms array
          workspace.forms = workspace.forms.filter(f => f._id !== formId);
      
          // Update currentWorkspace if it's the active workspace
          if (state.currentWorkspace?._id === workspaceId) {
            state.currentWorkspace = { ...workspace };
          }
        }
      })
      
      builder.addCase(deleteIndependentTypebot.rejected, setErrorState)
      
      builder.addCase(deleteIndependentTypebot.pending, setLoadingState)
      .addCase(updateFormContent.pending, setLoadingState)
      .addCase(updateFormContent.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, folderId, formId } = action.payload;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          const folder = workspace.folders.find(f => f._id === folderId);
          if (folder) {
            const formIndex = workspace.forms.findIndex(f => f._id === formId);
            if (formIndex !== -1) {
              workspace.forms[formIndex] = action.payload.form;
              if (state.currentWorkspace?._id === workspaceId) {
                state.currentWorkspace = { ...workspace };
              }
            }
          }
        }
      })
      .addCase(updateFormContent.rejected, setErrorState);

  },
});

export const { setCurrentWorkspace, clearWorkspaces } = workspaceSlice.actions;
export const selectWorkspaces = (state) => state.workspaces.items;
export const selectUserWorkspaces = (state) => state.workspaces.userWorkspaces;
export const selectSharedWorkspaces = (state) => state.workspaces.sharedWorkspaces;
export const selectCurrentWorkspace = (state) => state.workspaces.currentWorkspace;
export const selectWorkspaceLoading = (state) => state.workspaces.loading;
export const selectWorkspaceError = (state) => state.workspaces.error;
export default workspaceSlice.reducer;
