import { useParams } from "react-router-dom";
import { useGetUserQuery } from "./userApiSlice";
import Edit from "./Edit";

function EditUserForm() {
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
  return (
    <div>
      <center style={{ fontWeight: "800", fontSize: "31px" }}>Edit</center>
      <Edit id={id}></Edit>
    </div>
  );
}

export default EditUserForm;
