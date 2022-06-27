import { createContext, useReducer, useContext } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
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
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const createPost = async (post) => {
    const { title, message, tags, creatorId, imageFile } = post;
    const imageLocation = `${creatorId}/${imageFile.name}`;

    const storageSpace = ref(storage, imageLocation);

    await uploadBytes(storageSpace, imageFile);

    const imageUrl = await getImageUrl(imageLocation);

    await addDoc(collection(db, "posts"), {
      title: title,
      message: message,
      tags: tags,
      creatorId: creatorId,
      imageLocation: imageUrl,
      createdAt: serverTimestamp(),
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    await getPosts();
  };

  const updatePost = async (post) => {
    const { title, message, tags, postId } = post;

    await setDoc(
      collection(db, "posts", postId),
      {
        title: title,
        message: message,
        tags: tags,
      },
      { merge: true }
    )
      .then(
        dispatch({
          type: UPDATE,
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
      dispatch({ type: FETCH_POST, payload: docSnap.data() });
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
