import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAnswersMap, setHasAnswersMap] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const navigate = useNavigate();

  // ---------------- USER ----------------

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    
    console.error("Invalid user data in localStorage");
  }

  const API_URL = `http://${window.location.hostname}:5000`;

  // ---------------- FETCH POSTS ----------------

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);

      const postData = Array.isArray(res.data) ? res.data : [];

      setPosts(postData);

      // Check which posts have answers
      postData.forEach(async (post) => {
        try {
          const ansReq = await axios.get(
            `${API_URL}/answers/${post._id}`
          );

          if (Array.isArray(ansReq.data) && ansReq.data.length > 0) {
            setHasAnswersMap((prev) => ({
              ...prev,
              [post._id]: true,
            }));
          }
        } catch (error) {
          console.error(
            `Failed to fetch answers for post ${post._id}:`,
            error
          );
        }
      });
    } catch (err) {
      console.error("Failed to fetch community posts:", err);
      setPosts([]);
    }
  };

  // ---------------- FETCH FARMING NEWS ----------------

  const fetchNews = async () => {
    setNewsLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/agri-news`, {
        timeout: 10000,
      });

      if (Array.isArray(res.data)) {
        setNews(res.data);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error(
        "Failed to fetch farming news:",
        err.response?.data || err.message
      );

      // Keep the Community page working even if Reddit/news API fails
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    fetchPosts();
    fetchNews();
  }, []);

  // ---------------- CREATE POST ----------------

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!user?._id) {
      alert("Please login again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("farmer_id", user._id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        `${API_URL}/api/community/posts`,
        formData
      );

      setTitle("");
      setDescription("");
      setCategory("General");
      setImage(null);
      setIsFormOpen(false);

      await fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Error sharing post");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOAD ANSWERS ----------------

  const loadAnswers = async (postId) => {
    if (activePost === postId) {
      setActivePost(null);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/answers/${postId}`
      );

      setAnswers(Array.isArray(res.data) ? res.data : []);
      setActivePost(postId);
    } catch (err) {
      console.error("Failed to load answers:", err);
      setAnswers([]);
    }
  };

  // ---------------- ADD ANSWER ----------------

  const handleAddAnswer = async (postId) => {
    if (!newAnswer.trim()) return;

    if (!user?._id) {
      alert("Please login again.");
      return;
    }

    try {
      await axios.post(`${API_URL}/add-answer`, {
        post_id: postId,
        expert_id: user._id,
        answer_text: newAnswer,
      });

      setNewAnswer("");

      // Reload comments
      const res = await axios.get(
        `${API_URL}/answers/${postId}`
      );

      setAnswers(Array.isArray(res.data) ? res.data : []);

      setHasAnswersMap((prev) => ({
        ...prev,
        [postId]: true,
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error adding comment");
    }
  };

  // ---------------- PRIVATE REPLY ----------------

  const handleReplyPrivately = (farmerId) => {
    if (!user?._id) {
      alert("Please login again.");
      return;
    }

    if (user.role === "farmer") {
      alert(
        "Only an expert can initiate a private reply from the forum."
      );
      return;
    }

    navigate(
      `/chat?farmer=${farmerId}&expert=${user._id}`
    );
  };

  // ---------------- LIKE ----------------

  const handleLike = async (postId) => {
    if (!user?._id) {
      alert("Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {
          userId: user._id,
        }
      );

      setPosts((current) =>
        current.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: Array.from({
                  length: Number(res.data.likes) || 0,
                }),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      alert("Could not update reaction");
    }
  };

  // ---------------- AI SUMMARY ----------------

  const handleSummary = async (postId) => {
    if (summaries[postId]) {
      setSummaries((current) => ({
        ...current,
        [postId]: null,
      }));
      return;
    }

    setSummaryLoading((current) => ({
      ...current,
      [postId]: true,
    }));

    try {
      const res = await axios.get(
        `${API_URL}/api/community/post/${postId}/summary`
      );

      setSummaries((current) => ({
        ...current,
        [postId]: res.data?.summary || "No summary available.",
      }));
    } catch (err) {
      console.error("Summary error:", err);
      alert("Could not generate a summary");
    } finally {
      setSummaryLoading((current) => ({
        ...current,
        [postId]: false,
      }));
    }
  };

  // ---------------- RENDER ----------------

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "7fr 3fr",
        gap: "20px",
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      {/* ================= LEFT SIDE ================= */}

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "var(--accent-color)",
              margin: 0,
            }}
          >
            🌍 Community Forum
          </h2>

          {user?.role === "farmer" && (
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              {isFormOpen ? "Cancel" : "✏️ Ask Question"}
            </button>
          )}
        </div>

        {/* CREATE POST */}

        {user?.role === "farmer" && isFormOpen && (
          <form
            className="glass-panel"
            onSubmit={handleCreatePost}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "30px",
              padding: "20px",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>
              Create a New Post
            </h4>

            <input
              required
              placeholder="Question Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>General</option>
              <option>Pest & Disease</option>
              <option>Soil & Fertilizer</option>
              <option>Irrigation</option>
              <option>Market</option>
            </select>

            <textarea
              required
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                minHeight: "80px",
                resize: "vertical",
              }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
              aria-label="Attach a crop image"
            />

            <button
              type="submit"
              style={{
                marginTop: "10px",
                alignSelf: "flex-end",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
          </form>
        )}

        {/* POSTS */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {posts.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              No community posts yet.
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="glass-panel"
                style={{ padding: "20px" }}
              >
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    color: "var(--text-primary)",
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    margin: "0 0 15px 0",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {post.description}
                </p>

                {post.image && (
                  <img
                    src={`${API_URL}${post.image}`}
                    alt="Attachment to forum post"
                    style={{
                      width: "100%",
                      maxHeight: "260px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  />
                )}

                <div
                  style={{
                    fontSize: "0.85em",
                    color: "var(--accent-color)",
                    marginBottom: "15px",
                  }}
                >
                  {post.category && (
                    <span style={{ marginRight: "8px" }}>
                      {post.category} ·
                    </span>
                  )}

                  Posted by:{" "}
                  {post.farmer_id?.name || "Unknown"}{" "}
                  on{" "}
                  {post.createdAt
                    ? new Date(
                        post.createdAt
                      ).toLocaleDateString()
                    : "Unknown date"}
                </div>

                {/* ACTION BUTTONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => loadAnswers(post._id)}
                    style={{
                      background: "transparent",
                      border:
                        "1px solid var(--accent-color)",
                      color: "var(--accent-color)",
                    }}
                  >
                    {hasAnswersMap[post._id] &&
                      activePost !== post._id && (
                        <span
                          style={{
                            marginRight: "6px",
                          }}
                        >
                          🔴
                        </span>
                      )}

                    {activePost === post._id
                      ? "Hide Comments"
                      : "View Comments"}
                  </button>

                  <button
                    onClick={() => handleLike(post._id)}
                    className="secondary"
                  >
                    Like ({post.likes?.length || 0})
                  </button>

                  <button
                    onClick={() => handleSummary(post._id)}
                    className="secondary"
                    disabled={summaryLoading[post._id]}
                  >
                    {summaryLoading[post._id]
                      ? "Summarizing..."
                      : summaries[post._id]
                      ? "Hide AI Summary"
                      : "AI Summary"}
                  </button>

                  {user?.role === "expert" && (
                    <button
                      onClick={() =>
                        handleReplyPrivately(
                          post.farmer_id?._id ||
                            post.farmer_id
                        )
                      }
                    >
                      Reply Privately
                    </button>
                  )}
                </div>

                {/* AI SUMMARY */}

                {summaries[post._id] && (
                  <p
                    style={{
                      margin: "14px 0 0",
                      padding: "12px",
                      borderRadius: "8px",
                      background: "var(--accent-soft)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                    }}
                  >
                    <strong
                      style={{
                        color: "var(--accent)",
                      }}
                    >
                      AI summary:{" "}
                    </strong>

                    {summaries[post._id]}
                  </p>
                )}

                {/* COMMENTS */}

                {activePost === post._id && (
                  <div
                    style={{
                      marginTop: "15px",
                      padding: "15px",
                      background:
                        "rgba(0,0,0,0.2)",
                      borderRadius: "8px",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 10px 0",
                      }}
                    >
                      Comments
                    </h4>

                    {answers.length === 0 ? (
                      <p
                        style={{
                          color:
                            "var(--text-secondary)",
                        }}
                      >
                        No comments yet.
                      </p>
                    ) : (
                      <ul
                        style={{
                          paddingLeft: "0",
                          listStyle: "none",
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {answers.map((ans) => (
                          <li
                            key={ans._id}
                            style={{
                              background:
                                "var(--bg-secondary)",
                              padding: "10px 15px",
                              borderRadius: "6px",
                            }}
                          >
                            <strong
                              style={{
                                color:
                                  "var(--accent-color)",
                              }}
                            >
                              {ans.expert_id?.name ||
                                "Expert"}
                              :
                            </strong>

                            <span
                              style={{
                                marginLeft: "8px",
                              }}
                            >
                              {ans.answer_text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* ADD COMMENT */}

                    {user?.role === "expert" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >
                        <input
                          style={{ flex: 1 }}
                          placeholder="Write a comment..."
                          value={newAnswer}
                          onChange={(e) =>
                            setNewAnswer(
                              e.target.value
                            )
                          }
                        />

                        <button
                          onClick={() =>
                            handleAddAnswer(post._id)
                          }
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div>
        <h3
          style={{
            color: "var(--accent-color)",
            marginBottom: "20px",
          }}
        >
          📰 Live Farming News
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {/* NEWS LOADING */}

          {newsLoading ? (
            <p
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Loading farming news...
            </p>
          ) : news.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: "15px",
                color: "var(--text-secondary)",
              }}
            >
              No farming news available right now.
            </div>
          ) : (
            news.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel"
                style={{
                  padding: "15px",
                  display: "block",
                  textDecoration: "none",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                  }}
                >
                  {item.title}
                </h4>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85em",
                    color: "var(--text-secondary)",
                  }}
                >
                  👍 {item.score || 0} • by u/
                  {item.author || "Unknown"}
                </p>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}