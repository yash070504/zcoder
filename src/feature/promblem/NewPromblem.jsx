import { useState, useEffect } from "react";
import { useAddNewPromblemMutation } from "./promblemApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

function NewPromblem() {
  const { id } = useSelector((store) => store.idUsername);
  const [addNewPromblem, { isLoading, isSuccess, isError, error }] =
    useAddNewPromblemMutation();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testCase, setTestCase] = useState("");
  const [difficult, setDifficult] = useState("");
  const [solution, setSolution] = useState("");

  function onHandleTitle(e) {
    setTitle(e.target.value);
  }
  function onHandleDescription(e) {
    setDescription(e.target.value);
  }
  function onHandleTestCase(e) {
    setTestCase(e.target.value);
  }
  function onHandleDifficult(e) {
    console.log(difficult);
    setDifficult(e.target.value);
  }
  function onHandleSolution(e) {
    console.log(solution);
    setSolution(e.target.value);
  }

  const onCreate = async (e) => {
    e.preventDefault();
    const object = {
      user: id,
      title,
      description,
      solution,
      testcase: testCase,
      difficult: difficult,
    };
    console.log(object);
    await addNewPromblem(object);
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDescription("");
      setTestCase("");
      setSolution("");
      setDifficult("");
      navigate(`/promblem/view/${id}`);
      console.log("CReated");
    }
  }, [isSuccess, navigate]);

  return (
    <>
      <Navbar id={id}></Navbar>
      <form className="row g-3">
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Title :
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            onChange={(e) => onHandleTitle(e)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Description :
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            onChange={(e) => onHandleDescription(e)}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress" className="form-label">
            Promblem Link
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="Promblem Link"
            onChange={(e) => onHandleTestCase(e)}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress2" className="form-label">
            Solution
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress2"
            placeholder="Solution"
            onChange={(e) => onHandleSolution(e)}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="inputState" className="form-label">
            Difficulty :
          </label>
          <select
            id="inputState"
            className="form-select"
            onChange={(e) => onHandleDifficult(e)}
          >
            <option defaultValue>Choose...</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="col-12">
          <div className="form-check"></div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary" onClick={onCreate}>
            Create
          </button>
        </div>
      </form>
    </>
  );
}

export default NewPromblem;
