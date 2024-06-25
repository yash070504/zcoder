import { Link, useParams } from "react-router-dom";
import {
  useGetUserQuery,
  selectAllUsers,
  selectUserIds,
  selectEntities,
} from "../feature/user/userApiSlice";

function Dash() {
  const { username } = useParams();
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let id = "";
  if (isSuccess) {
    const { ids, entities } = users;
    ids.map((ids) => {
      if (entities[ids].username == username) {
        id = ids;
      }
    });
  }

  console.log(id);
  const url = `/user/edit/${username}`;
  const url2 = `/promblem/view/${id}`;
  const url3 = `/promblem/new/${id}`;
  return (
    <div>
      <p></p>
      <Link to={url}>User-Edit</Link>
      <br />
      <Link to={url2}>Promblem-View</Link>
      <br />
      <Link to={url3}>New-Promblem</Link>
      <br />
      <Link to="/calender">Contest Calender</Link>
    </div>
  );
}

export default Dash;
