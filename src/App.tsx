import "./index.css";
import { AiOutlinePlus } from "react-icons/ai";
import { createContext, FormEvent, useEffect, useRef, useState } from "react";
import {
  FetchyRequest,
  getRandomKey,
  RequestsContextType,
  withStorage,
} from "./utils";
import Tabs from "./Tabs";
import { setDefaultResultOrder } from "dns";
import RequestArea from "./RequestArea";
// @ts-ignore
export const RequestsContext = createContext<RequestsContextType>();
function App(): JSX.Element {
  const [requests, setRequests] = useState<FetchyRequest[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inpRef = useRef<HTMLInputElement>();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const selectedRequest = requests.find((req, index) => index === currentIndex);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const title = inpRef.current!.value;

    const newRequest: FetchyRequest = {
      body: {
        content: "",
        contentType: "text/plain",
      },
      headers: {},
      id: getRandomKey(),
      title: title.trimStart().trimEnd(),
      url: "",
      method: "GET",
    };
    if (
      !title ||
      !title.trim() ||
      title.length >= 20 ||
      withStorage({ type: "exists", title: newRequest.title })
    ) {
      alert("Invalid Title!");
    } else {
      setRequests((prev) => [...prev, newRequest]);
      setIsEditing(false);
      withStorage({
        type: "set",
        request: newRequest,
      });
    }
  };
  useEffect(() => {
    if (isEditing) {
      inpRef.current!.focus();
      document.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          setIsEditing(false);
        }
      });
    }
    return () => {
      document.removeEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          setIsEditing(false);
        }
      });
    };
  }, [isEditing]);

  useEffect(() => {
    const existingRequests = withStorage({ type: "get" }) as FetchyRequest[];
    setRequests(existingRequests);
  }, []);

  return (
    <div className="page">
      <div className="main-area">
        <RequestsContext.Provider
          value={{
            requests,
            setRequests,
            currentIndex,
            setCurrentIndex,
            selectedRequest,
          }}
        >
          <div className="tabs-wrapper">
            <div className="add-fetch">
              <span>Add A Request</span>{" "}
              <AiOutlinePlus
                style={{
                  marginLeft: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (isEditing) {
                    return inpRef.current!.focus();
                  } else {
                    setIsEditing(true);
                  }
                }}
              />
            </div>
            <div className="tabs">
              {requests.length === 0 && !isEditing ? (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "20px",
                  }}
                >
                  No Requests Available
                </div>
              ) : (
                <>
                  <Tabs />
                  {isEditing && (
                    <div className="tab">
                      <form onSubmit={(e) => onSubmit(e)}>
                        {/* @ts-ignore */}
                        <input ref={inpRef} />
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="main-action">
            <RequestArea />
          </div>
        </RequestsContext.Provider>
      </div>
    </div>
  );
}

export default App;
