import { FC, useContext, useEffect } from "react";
import { withStorage } from "./utils";
import { BiTrash } from "react-icons/bi";
import { RequestsContext } from "./App";

const Tabs: FC = () => {
  const { requests, setRequests, setCurrentIndex, selectedRequest } = useContext(RequestsContext);
  useEffect(() => {
    withStorage({
      type: "setAll",
      requests,
    });
  }, [requests]);
  return (
    <>
      {requests.map((req, i) => {
        return (
          <div
            className={`tab ${selectedRequest?.id === req.id ? "active" : "inactive"}`}
            key={req.id}
            id={req.id}
            onDoubleClick={() => {
              setCurrentIndex(i);
            }}>
            <span>{req.title}</span>
            <BiTrash
              style={{
                marginLeft: "20px",
                cursor: "pointer",
                fontSize: "1.5rem",
              }}
              onClick={() => {
                setRequests((prev) => {
                  const filtered = prev.filter((p) => p.id !== req.id);
                  if (req === selectedRequest) {
                    setCurrentIndex(null);
                  }
                  return filtered;
                });
              }}
            />
          </div>
        );
      })}
    </>
  );
};
export default Tabs;
