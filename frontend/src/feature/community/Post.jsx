import React, { useEffect, useState } from "react";
import { useCreateCommentMutation } from "./commentApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiSend } from "react-icons/fi";

function Post({ postId }) {
  const idFromStore = useSelector((store) => store.idUsername?.id);
  const userId = idFromStore || localStorage.getItem("zcoder_id");

  const [createComment, { isLoading, isSuccess }] = useCreateCommentMutation();
  const [com, setCom] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setCom("");
    }
  }, [isSuccess]);

  const onSubmitBtn = async (e) => {
    if (e) e.preventDefault();
    if (!com.trim()) return;

    if (!userId) {
      toast.info(
        "🔒 You need to log in to post a comment! If you are a new user, please create an account.",
        { 
          theme: "dark", 
          position: "top-center",
          autoClose: 4000 
        }
      );
      return;
    }

    try {
      const res = await createComment({
        message: com.trim(),
        userId,
        postId,
      }).unwrap();

      const author = res?.authorUsername || "Author";
      const title = res?.postTitle || "discussion";
      toast.success(`💬 Comment posted! Notified @${author} on "${title}"`, {
        theme: "dark",
        autoClose: 3500,
        position: "top-center"
      });
      setCom("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err?.data?.message || "Failed to post comment", { theme: "dark" });
    }
  };

  return (
    <form onSubmit={onSubmitBtn} className="d-flex align-items-center gap-2 mt-3">
      <input
        type="text"
        className="glass-input py-2 px-3 flex-grow-1"
        style={{ 
          fontSize: "0.9rem",
          background: "rgba(10, 15, 29, 0.8)",
          borderRadius: "12px"
        }}
        placeholder={userId ? "Write a comment or response..." : "Log in or create an account to reply..."}
        value={com}
        onChange={(e) => setCom(e.target.value)}
      />
      <button
        type="submit"
        className="btn-premium py-2 px-3 flex-shrink-0"
        style={{ fontSize: "0.88rem", borderRadius: "12px" }}
        disabled={isLoading || !com.trim()}
      >
        <FiSend size={15} />
        <span>{isLoading ? "Posting..." : "Reply"}</span>
      </button>
    </form>
  );
}

export default Post;
