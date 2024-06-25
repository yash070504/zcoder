import React from "react";
import { useParams } from "react-router-dom";
import { useGetPromblemQuery } from "./promblemApiSlice";
import ViewPro from "./VIewPro";

function ViewPromblem() {
  const { username } = useParams();

  const {
    data: promblems,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPromblemQuery("User", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let Lpromblems = [];

  if (isSuccess) {
    let { ids, entities } = promblems;
    ids.map((id) => {
      if (entities[id].user === username) {
        Lpromblems = [entities[id], ...Lpromblems];
      }
    });
  }
  return (
    <>
      <ViewPro promblems={Lpromblems}></ViewPro>
    </>
  );
}

export default ViewPromblem;
