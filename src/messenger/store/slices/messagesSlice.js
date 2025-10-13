// store/slices/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  fetchSelectedInboxMessagesService,
  createMessageService,
} from '../../data/service';

// Async Thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ pageNumber, username }, { rejectWithValue }) => {
    try {
      const data = await fetchSelectedInboxMessagesService(pageNumber, username);
      return { data, pageNumber };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async ({ receiver, message }, { rejectWithValue }) => {
    try {
      const createdMessage = await createMessageService({ receiver, message });
      return createdMessage;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
    loading: false,
    hasMore: false,
    pageNumber: 1,
    error: null,
    isReplying: false,
    currentMessage: '',
  },
  reducers: {
    incrementPageNumber: (state) => {
      state.pageNumber += 1;
    },
    resetMessages: (state) => {
      state.list = [];
      state.pageNumber = 1;
      state.hasMore = false;
      state.isReplying = false;
      state.currentMessage = '';
    },
    setIsReplying: (state, action) => {
      state.isReplying = action.payload;
    },
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    addMessageToList: (state, action) => {
      state.list = [action.payload, ...state.list];
    },
    clearCurrentMessage: (state) => {
      state.currentMessage = '';
      state.isReplying = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { data, pageNumber } = action.payload;

        if (pageNumber === 1) {
          state.list = data.results;
        } else {
          state.list = [...state.list, ...data.results];
        }

        state.hasMore = pageNumber < (data.numPages || data.num_pages);
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to load conversation');
      })

      // Create Message
      .addCase(createMessage.fulfilled, (state, action) => {
        state.list = [action.payload, ...state.list];
        state.currentMessage = '';
        state.isReplying = false;
        toast.success('Message sent successfully');
      })
      .addCase(createMessage.rejected, (state) => {
        toast.error('Failed to send message');
      });
  },
});

export const {
  incrementPageNumber,
  resetMessages,
  setIsReplying,
  setCurrentMessage,
  addMessageToList,
  clearCurrentMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
