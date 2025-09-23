import React, { useState } from "react";
import { selectPostById } from "./communityApiSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUserById } from "../user/userApiSlice";
function Comment({ id }) {
  const post = useSelector((state) => selectPostById(state, id));
  const [c, setC] = useState(false);
  const onHandle = () => {
    setC(!c);
  };
  let content;
  if (c) {
    if (!post.comments.length) {
      content = (
        <>
          <p>No comment</p>
        </>
      );
    } else {
      content = post.comments.map((comment) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center community-comment"
            key={Math.floor(Math.random() * 1000000000 + 1)}
          >
            <div className="user d-flex flex-row align-items-center">
              <span>
                <small
                  className="font-weight-bold text-primary"
                  style={{ marginRight: "2px" }}
                >
                  {comment.createdBy}
                </small>
                <small className="font-weight-bold " style={{ color: "white" }}>
                  : {comment.message}
                </small>
              </span>
            </div>
          </div>
        );
      });
    }
  } else {
    content = (
      <div className="badge " style={{ color: "black" }}>
        View Comment
      </div>
    );
  }
  return <div onClick={() => onHandle()}>{content}</div>;
}

export default Comment;
