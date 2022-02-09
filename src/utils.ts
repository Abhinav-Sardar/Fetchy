import axios, { Method } from "axios";
import { METHODS } from "http";
import { Dispatch, SetStateAction } from "react";

export const getRandomKey: () => string = () => {
  const alphas = "abcdefghijklmnopqrstuvwxyz";
  const capitalize = alphas.toUpperCase();
  const nums = "1234567890";
  let char = "";
  const fields = [capitalize, nums, alphas];
  for (let i = 0; i < 15; i++) {
    const randomField = fields[Math.floor(Math.random() * fields.length)];
    const randomChar = randomField[Math.floor(Math.random() * randomField.length)];
    char += randomChar;
  }
  return char;
};
export interface FetchyRequest {
  url: string;
  id: string;
  headers: {
    [key: string]: string;
  };
  title: string;
  body: {
    contentType: "text/html" | "text/plain" | "application/json";
    content: string;
  };
  method: Method;
}
type useLocalStorageType =
  | { type: "get" }
  | { type: "set"; request: FetchyRequest }
  | { type: "exists"; title: FetchyRequest["title"] }
  | { type: "setAll"; requests: FetchyRequest[] };
export const withStorage: (param: useLocalStorageType) => FetchyRequest[] | boolean | void = (
  param: useLocalStorageType
) => {
  if (param.type === "get") {
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");
    return requests;
  } else if (param.type === "set") {
    const requests: FetchyRequest[] = JSON.parse(localStorage.getItem("requests") || "[]");
    const newRequests = [...requests, param.request];
    localStorage.setItem("requests", JSON.stringify(newRequests));
  } else if (param.type === "exists") {
    const requests: FetchyRequest[] = JSON.parse(localStorage.getItem("requests") || "[]");

    const exists = Boolean(requests.find((request) => request.title === param.title));
    return exists;
  } else {
    localStorage.setItem("requests", JSON.stringify(param.requests));
  }
};

export interface RequestsContextType {
  requests: FetchyRequest[];
  setRequests: Dispatch<SetStateAction<FetchyRequest[]>>;
  currentIndex: number | null;
  setCurrentIndex: Dispatch<SetStateAction<number | null>>;
  selectedRequest: undefined | FetchyRequest;
}

export interface FetchyResponse {
  url: string;
  request: FetchyRequest;
  response: {
    body: string;
    headers: {
      [key: string]: string;
    };
  };
}

export const VerbsFunction = {
  GET: axios.get,
  POST: axios.post,
  PUT: axios.put,
  PATCH: axios.patch,
  DELETE: axios.delete,
};
