import { Dispatch, FC, SetStateAction } from "react";
import { FetchyRequest, withStorage } from "./utils";
import { BiTrash } from "react-icons/bi";
import { setDefaultResultOrder } from "dns";

const Tabs: FC<{
  requests: FetchyRequest[];
  setRequests: Dispatch<SetStateAction<FetchyRequest[]>>;
  setSelectedRequest: Dispatch<SetStateAction<FetchyRequest | null>>;
  selectedRequest: FetchyRequest | null;
}> = ({ requests, setRequests, setSelectedRequest, selectedRequest }) => {
  return (
    <>
      {requests.map((req) => {
        return (
          <div
            className="tab"
            key={req.id}
            onDoubleClick={() => {
              setSelectedRequest(req);
            }}
          >
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
                  req === selectedRequest && setSelectedRequest(null);
                  withStorage({
                    type: "setAll",
                    requests: filtered,
                  });
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
