import { FC, useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSave, BiTrash } from "react-icons/bi";
import { RequestsContext } from "./App";
import { getPairValues } from "./utils";
export const Body: FC = () => {
  const { requests, setRequests, selectedRequest } = useContext(RequestsContext);
  const [body, setBody] = useState(selectedRequest!.body);
  return (
    <>
      <textarea
        value={body}
        onChange={e => {
          setBody(e.target.value);
        }}
        rows={10}
        style={{
          height: "95%",
          width: "98%",
          resize: "none",
          padding: "0 5px",
          letterSpacing: "1px",
        }}
      ></textarea>
      <button
        className='add-header'
        onClick={() => {
          const existingReqs = [...requests];
          const particularRequest = existingReqs.find(r => r === selectedRequest);
          particularRequest!.body = body;
          setRequests(existingReqs);
        }}
      >
        Save <BiSave />
      </button>
    </>
  );
};

export const Headers: FC = () => {
  const { requests, setRequests, selectedRequest } = useContext(RequestsContext);
  const addHeader = () => {
    try {
      const [key, value] = getPairValues();
      const existingReqs = [...requests];
      const particularRequest = existingReqs.find(r => r === selectedRequest);
      particularRequest!.headers[key] = value;
      setRequests(existingReqs);
    } catch (e) {}
  };
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      {Object.entries(selectedRequest!.headers).map(([key, value]) => {
        return (
          <div
            className='section-wrapper'
            key={key}
            style={{
              display: "flex",
            }}
          >
            <div
              className='section-title'
              style={{
                height: "30px",
                width: "20%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <BiTrash
                style={{ fontSize: "1.5em", cursor: "pointer" }}
                onClick={() => {
                  const existingReqs = [...requests];
                  const particularRequest = existingReqs.find(r => r === selectedRequest);
                  delete particularRequest!.headers[key];
                  setRequests(existingReqs);
                }}
              />
              {key}
            </div>
            <div
              className='section-content'
              style={{
                height: "30px",
                width: "80%",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {value}
            </div>
          </div>
        );
      })}
      <button className='add-header' onClick={addHeader}>
        Add <AiOutlinePlus />
      </button>
    </div>
  );
};
export const QueryParams: FC = () => {
  const { selectedRequest, requests, setRequests } = useContext(RequestsContext)!;
  const { queryParams } = selectedRequest!;

  return (
    <>
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
        {queryParams.map(param => {
          const [key, value] = Object.entries(param)[0];
          return (
            <div
              className='section-wrapper'
              key={`${key}${value}`}
              style={{
                display: "flex",
              }}
            >
              <div
                className='section-title'
                style={{
                  height: "30px",
                  width: "20%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <BiTrash
                  style={{ fontSize: "1.5em", cursor: "pointer" }}
                  onClick={() => {
                    const existingReqs = [...requests];
                    const particularRequest = existingReqs.find(r => r === selectedRequest);

                    const newQueryParams = [...particularRequest!.queryParams];
                    newQueryParams.splice(newQueryParams.indexOf(param), 1);
                    particularRequest!.queryParams = newQueryParams;
                    setRequests(existingReqs);
                  }}
                />
                {key}
              </div>
              <div
                className='section-content'
                style={{
                  height: "30px",
                  width: "80%",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
        <button
          className='add-header'
          onClick={() => {
            try {
              const [key, value] = getPairValues();
              const existingReqs = [...requests];
              const particularRequest = existingReqs.find(r => r === selectedRequest);
              particularRequest!.queryParams.push({ [key]: value });
              setRequests(existingReqs);
            } catch (e) {}
          }}
        >
          Add <AiOutlinePlus />
        </button>
      </div>
    </>
  );
};
