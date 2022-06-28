import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
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
  CLEAR,
} from "./actionTypes";

import useAuth from "./AuthContext";

const PostContext = createContext(initialState);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(postReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [postToEdit, setPostToEdit] = useState({});

  const createPost = async (post) => {
    setLoading(true);
    const { title, message, tags, imageFile } = post;
    const imageLocation = `postImages/${user.uid}/${imageFile.name}`;

    const storageSpace = ref(storage, imageLocation);

    await uploadBytes(storageSpace, imageFile);

    const imageUrl = await getImageUrl(imageLocation);

    const newPost = {
      title: title,
      message: message,
      tags: tags,
      author: user.displayName,
      creatorId: user.uid,
      imageUrl: imageUrl,
      imageStorageLoc: imageLocation,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "posts"), {
      ...newPost,
    })
      .then(
        dispatch({
          type: CREATE,
          payload: { ...newPost },
        })
      )
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    await getPosts();
  };

  const updatePost = async (post) => {
    setLoading(true);
    const { title, message, tags, postId } = post;

    await setDoc(
      doc(db, "posts", postId),
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
    getPosts();
  };

  const deletePost = async (post) => {
    setLoading(true);
    const deleteRef = ref(storage, post.imageStorageLoc);
    await deleteDoc(doc(db, "posts", post.id));
    await deleteObject(deleteRef).catch((error) => {
      console.log(error);
    });
    dispatch({ type: DELETE, payload: { _id: post.id } });
    getPosts();
  };

  const getPosts = async () => {
    setLoading(true);

    const posts = [];
    const querySnapshot = await getDocs(collection(db, "posts")).catch(
      (error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    );

    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });

    dispatch({
      type: FETCH_ALL,
      payload: [...posts],
    });
    setLoading(false);
  };

  const getPost = async (id) => {
    setLoading(true);
    dispatch({ type: CLEAR });
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      dispatch({ type: FETCH_POST, payload: docSnap.data() });
      setLoading(false);
    } else {
      console.log("No such document!");
      setLoading(false);
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
    deletePost,
    postToEdit,
    setPostToEdit,
    updatePost,
    loading,
    setLoading,
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
