import { Link } from "react-router-dom";
import { useDeletePromblemMutation } from "./promblemApiSlice";
import { useEffect, useState } from "react";

function ViewPro({ promblems }) {
  const [deletePromblem, { isSuccess, isError, error: delerror }] =
    useDeletePromblemMutation();

  const [id, setId] = useState("");

  useEffect(() => {
    if (isSuccess) {
      console.log("Delteed");
    }
  }, [isSuccess]);

  let content = promblems.map((promblem) => {
    console.log(promblem.testcase);
    return (
      <div className="card promblem-card" key={promblem.id}>
        <div className="card-body">
          <h5 className="card-title">{promblem.title}</h5>

          <p className="card-text">{promblem.description}</p>
          <p>
            <span>Difficulty: </span>
            {promblem.difficult}
          </p>
          <Link to={promblem.testcase} className="card-link" target="_blank">
            Promblem link
          </Link>
          <br />
          <div className="dropdown">
            <span>Solution</span>
            <div className="dropdown-content">
              <p>{promblem.solution}</p>
            </div>
          </div>
          <br />
          <button
            className="btn btn-danger"
            style={{ backgroundColor: "red", borderRadius: "12px" }}
            onClick={async () => {
              await deletePromblem({ id: promblem.id });
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });
  return <div>{content}</div>;
}

export default ViewPro;
