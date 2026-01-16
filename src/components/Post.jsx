const feelingConfig = {
  happy: {
    dark: "#F1C40F",
    emoji: "😀",
    reactions: ["😄", "🎉", "💛"]
  },
  sad: {
    dark: "#1C7ED6",
    emoji: "😢",
    reactions: ["😢", "🤗", "💙"]
  },
  love: {
    dark: "#E03131",
    emoji: "❤️",
    reactions: ["😍", "❤️", "🥰"]
  },
  angry: {
    dark: "#E8590C",
    emoji: "😡",
    reactions: ["😡", "🔥", "💥"]
  },
  peace: {
    dark: "#2F9E44",
    emoji: "😌",
    reactions: ["🌿", "✨", "💚"]
  }
};

export default function Post({ post }) {
  const config = feelingConfig[post.feeling];
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div style={{ ...styles.post, borderColor: config.dark }}>
      <div style={styles.time}>
        {config.emoji} • {time}
      </div>

      {post.text && <div>{post.text}</div>}

      {post.image && (
        <img
          src={URL.createObjectURL(post.image)}
          alt=""
          style={styles.image}
        />
      )}

      <div style={styles.reactions}>
        {config.reactions.map((r, i) => (
          <span key={i}>{r}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  post: {
    background: "#fff",
    borderRadius: "14px",
    padding: "15px",
    marginBottom: "18px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    border: "3px solid"
  },
  time: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "6px"
  },
  image: {
    maxWidth: "100%",
    borderRadius: "10px",
    marginTop: "10px"
  },
  reactions: {
    marginTop: "10px",
    fontSize: "20px",
    cursor: "pointer"
  }
};
