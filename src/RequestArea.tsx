import { FC, useContext, useEffect } from "react";
import { FetchyRequest } from "./utils";
import { FaBan } from "react-icons/fa";
import { RequestsContext } from "./App";
import axios from "axios";
import RequestPanel from "./RequestsPanel";
const RequestArea: FC = () => {
  const { selectedRequest } = useContext(RequestsContext);

  if (selectedRequest === undefined) {
    return (
      <div
        className="empty"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "gray",
        }}
      >
        <h1>No Current Request</h1>
        <FaBan fontSize="5rem" />
      </div>
    );
  } else {
    return <RequestPanel />;
  }
};
export default RequestArea;
