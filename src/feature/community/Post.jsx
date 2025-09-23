import { useCreateCommentMutation } from "./commentApiSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "../user/userApiSlice";

function Post({ postId }) {
  const { id } = useSelector((store) => store.idUsername);

  const user = useSelector((state) => selectUserById(state, id));
  // console.log(user);
  const navigate = useNavigate();
  const [createComment, { isSuccess }] = useCreateCommentMutation();
  const [com, setCom] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setCom("");

      navigate(`/community/${id}`);
    }
  }, [isSuccess, navigate]);

  const onComment = (e) => {
    setCom(e.target.value);
  };

  const onSubmitBtn = async () => {
    const message = com;
    const userId = id;
    console.log(message, userId, postId);
    const comment = await createComment({
      message,
      userId,
      postId,
    });
  };

  return (
    <div>
      <div className="form-group " style={{ display: "inline" }}>
        <label className="sr-only "></label>
        <input
          type="text"
          className="form-control"
          id="inputPassword2"
          placeholder="Add ur Comment .."
          style={{ width: "50vw", marginTop: "8px", height: "40px" }}
          onChange={(e) => onComment(e)}
        />
        <button
          type="submit"
          className="btn btn-success mb-2"
          style={{ height: "38px", width: "60px", marginLeft: "8px" }}
          onClick={() => {
            onSubmitBtn();
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default Post;
