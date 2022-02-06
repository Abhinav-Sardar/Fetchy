import { FC } from "react";
import { FetchyRequest } from "./utils";
import { FaBan } from "react-icons/fa";
const RequestArea: FC<{ request: FetchyRequest | null }> = ({ request }) => {
  if (request === null) {
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
    return <h1>OONON</h1>;
  }
};
export default RequestArea;
