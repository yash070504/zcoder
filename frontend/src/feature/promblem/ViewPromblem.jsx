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
  } = useGetPromblemQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let Lpromblems = [];
  let i;

  if (isSuccess) {
    let { ids, entities } = promblems;

    ids.map((id) => {
      if (entities[id].user === username) {
        i = entities[id]._id;
        Lpromblems = [entities[id], ...Lpromblems];
      }
    });
  }
  return (
    <>
      <ViewPro promblems={Lpromblems} id={i}></ViewPro>
    </>
  );
}

export default ViewPromblem;
