import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeletePromblemMutation } from "./promblemApiSlice";
import { useEffect, useState } from "react";
import NavbarG from "../../components/NavbarG";
import { useSelector } from "react-redux";

function ViewPro({ promblems }) {
  const { id } = useSelector((store) => store.idUsername);
  const [deletePromblem, { isSuccess, isError, error: delerror }] =
    useDeletePromblemMutation();
  const navigate = useNavigate();

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

  let cont;
  let tableContent = promblems.map((promblem) => {
    console.log(promblem.testcase);
    return (
      <tr className="table__row">
        <td className="table__cell note__status">{promblem.title}</td>
        <td className="table__cell note__created">{promblem.description}</td>
        <td className="table__cell note__updated">{promblem.difficult}</td>
        <td className="table__cell note__title">
          <Link to={promblem.testcase} className="card-link" target="_blank">
            Promblem link
          </Link>
        </td>
        <td className="table__cell note__username">
          <div className="dropdown">
            <span>Solution</span>
            <div className="dropdown-content">
              <p>{promblem.solution}</p>
            </div>
          </div>
        </td>

        <td className="table__cell">
          <button
            className="btn btn-danger"
            onClick={async () => {
              await deletePromblem({ id: promblem.id });
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });
  cont = (
    <table className="table table--notes">
      <thead className="">
        <tr>
          <th scope="col" className="">
            Title
          </th>
          <th scope="col" className="">
            Description
          </th>
          <th scope="col" className="t">
            Difficulty
          </th>
          <th scope="col" className="t">
            Promblem link
          </th>
          <th scope="col" className="">
            Solution
          </th>
          <th
            scope="col"
            className="table__button"
            style={{ paddingLeft: "30px" }}
          >
            Delete
          </th>
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );

  return (
    <div>
      <NavbarG>
        <button
          className="btn btn-success"
          style={{ fontSize: "14px" }}
          onClick={() => {
            navigate(`/promblem/new/${id}`);
          }}
        >
          Add Promblem
        </button>
      </NavbarG>
      ;<div>{cont}</div>
    </div>
  );
}

export default ViewPro;
