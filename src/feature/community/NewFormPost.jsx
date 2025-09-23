import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreatePostMutation } from "./communityApiSlice";
import Navbar from "../../components/Navbar";

function NewFormPost() {
  const { id } = useParams();
  let ID = id;
  const navigate = useNavigate();
  const [createPost, { isLoading, isSuccess, isError, error }] =
    useCreatePostMutation();

  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const url = `/community/${id}`;
  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setBody("");
      setTags("");
      navigate("/");
      navigate(url);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const array = tags.split(",");
    console.log({ title, body, tags: array, user: id });
    const user = await createPost({ title, body, tags: array, user: id });
  };

  const onTitleChanged = (e) => {
    setTitle(e.target.value);
  };

  const onBodyChanged = (e) => {
    setBody(e.target.value);
  };
  const onTagsChanged = (e) => {
    setTags(e.target.value);
  };

  return (
    <>
      <Navbar id={id}></Navbar>
      <form
        className="form"
        style={{
          width: "80vw",
          padding: "15px",
          backgroundColor: "lightgoldenrodyellow",
        }}
      >
        <div className="name">
          <label className="name-label">Title :</label>
          <input type="text" onChange={(e) => onTitleChanged(e)} />
        </div>

        <div className="body">
          <label className="body-label">Body :</label>
          <input
            type="text"
            onChange={(e) => onBodyChanged(e)}
            style={{ height: "30vh" }}
          />
        </div>

        <div className="url">
          <label className="url-label" style={{ marginRight: "10px" }}>
            Tags :
          </label>
          <input
            type="url"
            onChange={(e) => onTagsChanged(e)}
            style={{ height: "27px" }}
            placeholder="use comma after each tag"
          />
        </div>
        <center>
          <button
            type="submit"
            className="btn btn-success"
            onClick={(e) => handleSubmit(e)}
            style={{
              backgroundColor: "green",
              color: "white",
              width: "fit-content",
              borderRadius: "12px",
            }}
          >
            Create
          </button>
        </center>
      </form>
    </>
  );
}

export default NewFormPost;
