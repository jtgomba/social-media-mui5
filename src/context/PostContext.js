import { createContext, useReducer, useContext } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import firebaseApp from "../utils/firebaseConfig";

import postReducer, { initialState } from "./postReducer";
import {
  FETCH_ALL,
  FETCH_POST,
  UPDATE,
  DELETE,
  LIKE,
  CREATE,
  FETCH_BY_SEARCH,
  COMMENT,
  FETCH_BY_CREATOR,
} from "./actionTypes";

const PostContext = createContext(initialState);

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  const createPost = async (post) => {
    const { title, message, tags, creatorId, imageFile } = post;
    const imageLocation = `${creatorId}/${imageFile.name}`;

    const storageSpace = ref(storage, imageLocation);

    uploadBytes(storageSpace, imageFile).then((snapshot) => {
      console.log(snapshot);
    });

    await addDoc(collection(db, "posts"), {
      title: title,
      mssage: message,
      tags: tags,
      creatorId: creatorId,
      imageLocation: imageLocation,
      createdAt: serverTimestamp(),
    })
      .then(
        dispatch({
          type: CREATE,
          payload: post,
        })
      )
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const getPosts = async () => {
    const posts = [];
    const querySnapshot = await getDocs(collection(db, "posts"));

    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });

    const changedPosts = await Promise.all(
      posts.map(async (post) => {
        return {
          ...post,
          imageLocation: await getImageUrl(post.imageLocation),
        };
      })
    );
    dispatch({
      type: FETCH_ALL,
      payload: [...changedPosts],
    });
  };

  const getPost = async (id) => {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const oldPost = docSnap.data();
      const newLocation = await getImageUrl(oldPost.imageLocation);
      const newPost = { ...oldPost, imageLocation: newLocation };
      dispatch({ type: FETCH_POST, payload: newPost });
    } else {
      console.log("No such document!");
    }
  };

  const getImageUrl = async (imageLocation) => {
    const response = await getDownloadURL(ref(storage, imageLocation)).catch(
      (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    );
    return response;
  };

  const value = {
    getPosts,
    getPost,
    getImageUrl,
    createPost,
    posts: state.posts,
    post: state.post,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

const usePost = () => {
  const context = useContext(PostContext);

  if (context === undefined) {
    throw new Error("usePost must be used within PostContext");
  }
  return context;
};

export default usePost;
