// src/components/Feed.jsx
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>Nenhum post ainda.</p>
      ) : (
        posts.map(post => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}