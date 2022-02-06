import "./index.css";
import { AiOutlinePlus } from "react-icons/ai";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FetchyRequest, getRandomKey, withStorage } from "./utils";
import Tabs from "./Tabs";
import { setDefaultResultOrder } from "dns";
import RequestArea from "./RequestArea";
function App(): JSX.Element {
  const [requests, setRequests] = useState<FetchyRequest[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inpRef = useRef<HTMLInputElement>();
  const [selectedRequest, setSelectedRequest] = useState<FetchyRequest | null>(
    null
  );
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
  }, [isEditing]);
  useEffect(() => {
    const existingRequests = withStorage({ type: "get" }) as FetchyRequest[];
    setRequests(existingRequests);
  }, []);

  return (
    <div className="page">
      <div className="main-area">
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
                <Tabs
                  requests={requests}
                  setRequests={setRequests}
                  setSelectedRequest={setSelectedRequest}
                  selectedRequest={selectedRequest}
                />
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
          <RequestArea request={selectedRequest} />
        </div>
      </div>
    </div>
  );
}

export default App;
