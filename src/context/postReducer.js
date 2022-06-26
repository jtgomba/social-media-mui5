import {
  FETCH_ALL,
  FETCH_POST,
  UPDATE,
  DELETE,
  LIKE,
  CREATE,
  FETCH_BY_SEARCH,
  START_LOADING,
  END_LOADING,
  COMMENT,
  FETCH_BY_CREATOR,
} from "./actionTypes";

export const initialState = {
  isLoading: true,
  posts: [],
  post: { email: "" },
};
const postReducer = (state, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload,
      };
    case FETCH_BY_SEARCH:
    case FETCH_BY_CREATOR:
      return { ...state, posts: action.payload };
    case FETCH_POST:
      return { ...state, post: action.payload };
    case UPDATE:
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload._id),
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        }),
      };
    default:
      return state;
  }
};

export default postReducer;
