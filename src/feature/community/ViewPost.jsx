import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeletePostMutation, useGetAllPostQuery } from "./communityApiSlice";
import Comment from "./Comment";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import Post from "./Post";
import Calender from "../Calender/Calender";
import NavbarG from "../../components/NavbarG";
import { useDispatch, useSelector } from "react-redux";
import { idUsernameActions } from "../../app/id";

function ViewPost() {
  const dispatch = useDispatch();

  const [deletePost, { isSuccess: isDelSuccess, isError, error }] =
    useDeletePostMutation();

  const { id, username } = useSelector((store) => store.idUsername);
  useEffect(() => {
    dispatch(idUsernameActions.id(id));
  }, [id]);

  let ID = id;
  const url = `community/new/${id}`;
  const navigate = useNavigate();
  const {
    data: posts,
    isLoading,
    isSuccess,
  } = useGetAllPostQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isDelSuccess) {
      navigate(`/dash/${username}`);
    }
    if (isError) {
      console.log(error);
    }
  }, [isDelSuccess, isError]);

  let content;

  if (isSuccess) {
    const { ids, entities } = posts;

    content = ids.map((i) => {
      return (
        <div
          className={`card community-card ${
            username == entities[i].username && "extra-card"
          }`}
          key={i}
        >
          <div className="community-card-head">
            <span className="community-span">{entities[i].username}</span>
            {username == entities[i].username && (
              <button
                className="btn btn-danger"
                style={{ width: "71px", height: "39px", marginTop: "7px" }}
                onClick={async () => {
                  await deletePost({ id: entities[i]._id });
                }}
              >
                Delete
              </button>
            )}
          </div>

          <div className="card-body">
            <h5 className="card-title">{entities[i].title}</h5>

            <p className="card-text">{entities[i].body}</p>
            <p></p>
            {entities[i].tags.map((tag) => {
              return (
                <span className="badge text-bg-primary hashtag community-tag">
                  {tag}
                </span>
              );
            })}
            <div>
              <Post postId={i}></Post>
              <Comment id={i}></Comment>
            </div>
          </div>
        </div>
      );
    });
  }
  //console.(posts);
  return (
    <>
      <header className="communities-header">
        <NavbarG>
          <button
            className="community-header btn btn-success "
            onClick={() => {
              navigate(`/community/new/${id}`);
            }}
          >
            Add Post
          </button>
        </NavbarG>
      </header>

      <main>
        <div className="community-content">{content}</div>
      </main>
    </>
  );
}

export default ViewPost;
