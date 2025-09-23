import axios from "axios";
import { LANGUAGE_VERSIONS } from "../../constants";
import { version } from "react";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const excuteCode = async (language, souceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: souceCode,
      },
    ],
  });
  return response.data;
};
