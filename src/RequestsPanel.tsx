import axios, { Method } from "axios";
import {
  FC,
  useContext,
  memo,
  createContext,
  FormEvent,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { BiSend } from "react-icons/bi";
import { AiOutlineSave } from "react-icons/ai";
import { FetchyRequest, FetchyResponse, VerbsFunction, withStorage } from "./utils";
import { RequestsContext } from "./App";

const ResponseContext = createContext<
  [FetchyResponse | {}, Dispatch<SetStateAction<FetchyResponse | {}>>] | null
>(null);
const Tabs: FC = () => {
  return <h1>HELLO I AM THE TAB</h1>;
};
const SearchBar: FC = () => {
  const { selectedRequest, setRequests, requests } = useContext(RequestsContext);
  const [text, setText] = useState(selectedRequest!.url);
  useEffect(() => {
    setText(selectedRequest!.url);
  }, [selectedRequest]);
  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className='searchbar'>
      <form onSubmit={(e) => onFormSubmit(e)}>
        <select
        // onChange={(e) => {
        //   setRequests(() => {
        //     const existingReqs = [...requests];
        //     const particularRequest = existingReqs.find((r) => r === selectedRequest);
        //     particularRequest!.method = e.target.value as Method;

        //     return existingReqs;
        //   });
        // }}
        >
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>
        <button
          onClick={() => {
            setRequests(() => {
              const existingReqs = [...requests];
              const particularRequest = existingReqs.find((r) => r === selectedRequest);
              particularRequest!.url = text;

              return existingReqs;
            });
          }}
          style={{
            width: "5%",
          }}
          type='button'>
          <AiOutlineSave />
        </button>
        <input type='text' value={text} onChange={(e) => setText(e.target.value)} />

        <button type='submit'>
          Send <BiSend />
        </button>
      </form>
    </div>
  );
};
const RequestArea: FC = memo(() => {
  const { selectedRequest } = useContext(RequestsContext);
  return (
    <div className='request'>
      <h2 className='section__title'>Request</h2>

      {JSON.stringify(selectedRequest)}
    </div>
  );
});
const ResponseArea: FC = memo(() => {
  return (
    <div className='response'>
      <h2 className='section__title'>Response</h2>
    </div>
  );
});
const RequestPanel: FC = () => {
  const responseState = useState<FetchyResponse | {}>({});

  return (
    <>
      <ResponseContext.Provider value={responseState}>
        <SearchBar />
        <RequestArea />
        <ResponseArea />
      </ResponseContext.Provider>
    </>
  );
};

export default RequestPanel;
