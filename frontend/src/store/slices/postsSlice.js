import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { getApiError } from '../../api';

const toFormData = (post) => {
  const formData = new FormData();
  formData.append('title', post.title);
  formData.append('body', post.body);
  if (post.imageFile) formData.append('image', post.imageFile);
  if (post.removeImage) formData.append('removeImage', 'true');
  return formData;
};

export const fetchPosts = createAsyncThunk('posts/fetch', async (_, { rejectWithValue }) => {
  try { return (await api.get('/posts')).data; }
  catch (error) { return rejectWithValue(getApiError(error)); }
});
export const addPost = createAsyncThunk('posts/add', async (post, { rejectWithValue }) => {
  try { return (await api.post('/posts', toFormData(post))).data; }
  catch (error) { return rejectWithValue(getApiError(error)); }
});
export const updatePost = createAsyncThunk('posts/update', async ({ id, postData }, { rejectWithValue }) => {
  try { return (await api.put(`/posts/${id}`, toFormData(postData))).data; }
  catch (error) { return rejectWithValue(getApiError(error)); }
});
export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/posts/${id}`); return id; }
  catch (error) { return rejectWithValue(getApiError(error)); }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], status: 'idle', mutationStatus: 'idle', error: null },
  reducers: { clearPostError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.status = 'succeeded'; state.posts = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(addPost.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.posts.unshift(action.payload); })
      .addCase(updatePost.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; const i = state.posts.findIndex((p) => p._id === action.payload._id); if (i >= 0) state.posts[i] = action.payload; })
      .addCase(deletePost.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.posts = state.posts.filter((p) => p._id !== action.payload); })
      .addMatcher((a) => [addPost.pending.type, updatePost.pending.type, deletePost.pending.type].includes(a.type), (state) => { state.mutationStatus = 'loading'; state.error = null; })
      .addMatcher((a) => [addPost.rejected.type, updatePost.rejected.type, deletePost.rejected.type].includes(a.type), (state, action) => { state.mutationStatus = 'failed'; state.error = action.payload; });
  },
});

export const { clearPostError } = postsSlice.actions;
export default postsSlice.reducer;
