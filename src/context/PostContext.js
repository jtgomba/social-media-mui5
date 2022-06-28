import { createContext, useReducer, useContext, useState } from "react";
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
  query,
  where,
  orderBy,
  limit,
  startAfter,
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
  CREATE,
  FETCH_BY_SEARCH,
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
  const [lastVisible, setLastVisible] = useState();

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

  const getPosts = async (start) => {
    setLoading(true);

    const posts = [];
    if (!start) {
      const first = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(100)
      );
      const documentSnapshots = await getDocs(first);

      documentSnapshots.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });

      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } else {
      const documentSnapshots = await getDocs(start);

      documentSnapshots.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });

      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    }

    dispatch({
      type: FETCH_ALL,
      payload: [...posts],
    });
    setLoading(false);
  };

  const paginate = async () => {
    const next = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(8)
    );
    getPost(next);
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

  const searchPosts = async (queryObject) => {
    setLoading(true);

    const { queryType, q } = queryObject;
    const postsRef = collection(db, "posts");

    const posts = [];
    let querySnapshot = "";

    switch (queryType) {
      case "author":
        const authorSearch = query(postsRef, where("author", "==", q));
        querySnapshot = await getDocs(authorSearch);
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });
        dispatch({ type: FETCH_BY_CREATOR, payload: posts });
        break;
      case "tags":
        const tagsSearch = query(
          postsRef,
          where("tags", "array-contains-any", q)
        );
        querySnapshot = await getDocs(tagsSearch);
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });
        dispatch({ type: FETCH_BY_SEARCH, payload: posts });
        break;
      case "oneTag":
        const singleTagSearch = query(
          postsRef,
          where("tags", "array-contains", q)
        );

        querySnapshot = await getDocs(singleTagSearch);
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });
        dispatch({ type: FETCH_BY_SEARCH, payload: posts });
        break;
      default:
        return "invalid query type";
    }
    setLoading(false);
  };

  const value = {
    getPosts,
    getPost,
    getImageUrl,
    createPost,
    deletePost,
    postToEdit,
    setPostToEdit,
    searchPosts,
    updatePost,
    paginate,
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
