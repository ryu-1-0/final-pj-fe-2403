import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

//============================================================================
//call api
export const getUserAll = async () => {
  try {
    const url = `http://localhost:3001/users`
    const response = await axios.get(url)
    // console.log('response', response.data)
    return response.data
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching users:', error);
  }
}

export const getUsersList = createAsyncThunk(
  "userList/getUsersList",
  async ({ page, limit, nameSearch = '' }) => {
    try {
      const url = `http://localhost:3001/users?_page=${page}&_per_page=${limit}&lastName=${nameSearch}`
      const response = await axios.get(url)
      return response.data.data
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching users:', error);
    }
  }
)
export const deleteUserByID = async (userId) => {
  try {
    await axios.delete(`http://localhost:3001/users/${userId}`);

  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
  }
}
export const deleteManyUser = (listId) => {
  try {
    listId?.forEach(async (element) => {
      await axios.delete(`http://localhost:3001/users/${element}`);
    });


  } catch (error) {
    console.error(`Error deleting user with ID ${listId}:`, error);
  }
}
export const createUser = async (user) => {
  try {
    const newUser = { ...user }
    console.log('first user created', newUser)
    await axios.post('http://localhost:3001/users/', newUser)
  } catch (error) {
    console.error(`Error creating user: `, error);

  }
}
export const editUser = async (id, user) => {
  try {
    const newUser = { ...user }
    console.log('first user created id', id)
    console.log('first user created', newUser)
    await axios.put(`http://localhost:3001/users/${id}/`, newUser)
  } catch (error) {
    console.error(`Error creating user: `, error);

  }
}
//============================================================================

const initialState = {
  status: "idle",
  userList: [],
  errors: '',
};
const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUsersList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUsersList.fulfilled, function (state, action) {
        state.status = "success";
        // console.log('action: ', action)
        // state.userList = action.payload
        state.userList = [...action.payload];
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default userSlice.reducer;