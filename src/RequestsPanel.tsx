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
  useLayoutEffect,
} from "react";
import { BiSad, BiSend } from "react-icons/bi";

import { FetchyResponse, getRandomKey, VerbsFunction, getPairValues } from "./utils";
import { RequestsContext } from "./App";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Body, Headers, QueryParams } from "./RequestSubComponents";
import { resolveSrv } from "dns/promises";
import { Axios } from "axios";

// @ts-ignore
const ResponseContext = createContext<[FetchyResponse, Dispatch<SetStateAction<FetchyResponse>>]>([{}, () => {}]);
const Tabs: FC<{
  tabs: string[];
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}> = ({ tabs, currentTab, setCurrentTab }) => {
  return (
    <>
      <div className='tabs-selector-wrapper'>
        {tabs.map(tab => {
          return (
            <div
              className={`tab-selector ${currentTab === tab ? "active" : "inactive"}`}
              onClick={() => setCurrentTab(tab)}
              key={tab}
            >
              {tab}
            </div>
          );
        })}
      </div>
    </>
  );
};
const SearchBar: FC = () => {
  const { selectedRequest, setRequests, requests } = useContext(RequestsContext);
  const [text, setText] = useState(selectedRequest!.url);
  const [response, setResponse] = useContext(ResponseContext);
  useEffect(() => {
    setText(selectedRequest!.url);
  }, [selectedRequest]);
  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponse({ ...response, isLoading: true });
    const existingReqs = [...requests];
    const particularRequest = existingReqs.find(r => r === selectedRequest);
    particularRequest!.url = text;
    setRequests(existingReqs);
    const { headers, body, method } = selectedRequest!;

    const params = new URLSearchParams();

    selectedRequest!.queryParams.forEach(param => {
      const [key, value] = Object.entries(param)[0];
      params.append(key, value);
    });
    if (!text || !text.trim()) return;
    const newUrl = params.toString() === "" ? text : `${text}?${params.toString()}`;
    if (method === "GET" || method === "DELETE") {
      try {
        const response = await VerbsFunction[method](newUrl, {
          headers,
        });

        setResponse({
          url: newUrl,
          body: response.data,
          headers: response.headers,
          statusCode: response.status,
          statusText: response.statusText,
          isLoading: false,
          isError: false,
        });
      } catch (e) {
        // @ts-ignore
        setResponse({ ...response, isError: true, error: e });
      }
    } else {
      try {
        const response = await VerbsFunction[method](newUrl, body, {
          headers: selectedRequest!.headers,
        });
        setResponse({
          url: newUrl,
          body: response.data,

          headers: response.headers,
          statusCode: response.status,
          statusText: response.statusText,
          isLoading: false,

          isError: false,
        });
      } catch (e) {
        // @ts-ignore
        setResponse({ ...response, isError: true, error: e });
      }
    }
  };
  return (
    <div className='searchbar'>
      <form onSubmit={e => onFormSubmit(e)}>
        <select
          onChange={e => {
            const existingReqs = [...requests];
            const particularRequest = existingReqs.find(r => r === selectedRequest);
            // @ts-ignore
            particularRequest!.method = e.target.value;
            setRequests(existingReqs);
          }}
          value={selectedRequest?.method}
        >
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input type='text' value={text} onChange={e => setText(e.target.value)} />

        <button type='submit'>
          Send <BiSend />
        </button>
      </form>
    </div>
  );
};
const RequestArea: FC = memo(() => {
  const { selectedRequest, requests, setRequests } = useContext(RequestsContext);
  const [queryParams, setQueryParams] = useState<{ [key: string]: string }[]>([]);
  const tabs = ["Headers", "Body", "Query Params"];
  const [currentTab, setCurrentTab] = useState<string>("Body");
  const [body, setBody] = useState<string>(selectedRequest!.body);

  return (
    <div className='request'>
      <h2 className='section__title'>Request</h2>
      <div className='content'>
        <Tabs currentTab={currentTab} tabs={tabs} setCurrentTab={setCurrentTab} />
        <div className='info'>
          {currentTab === "Headers" ? (
            <>
              <Headers />
            </>
          ) : currentTab === "Body" ? (
            <Body />
          ) : (
            <>
              <QueryParams />
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const ResponseArea: FC = memo(() => {
  const [response, setResponse] = useContext(ResponseContext);
  const tabs = ["Headers", "Body"];
  const [currentTab, setCurrentTab] = useState("Body");
  console.log(response.headers);
  return (
    <div className='response'>
      <div className='header'>
        <h2 className='section__title'>Response</h2>
        {!response.isError && !response.isLoading && (
          <span>
            Status {response.statusCode} {response.statusText}
          </span>
        )}
      </div>
      <div className='content'>
        {response.isError ? (
          <div
            className='sinban'
            style={{
              color: "red",
            }}
          >
            <BiSad />
            <p>{String(response.error)}</p>
          </div>
        ) : response.isLoading ? (
          <div className='sinban' style={{ color: "var(--accent-color)" }}>
            <AiOutlineLoading3Quarters
              style={{
                animation: "spin 1s linear infinite",
              }}
            />
            <p>Fetching...</p>
          </div>
        ) : !response.body && !response.statusCode && !response.statusText ? (
          ""
        ) : (
          <>
            <div
              className='response-cont'
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className='tabs-selector-wrapper'>
                {tabs.map(tab => (
                  <div
                    key={tab}
                    className={`tab-selector ${currentTab === tab ? "active" : "inactive"}`}
                    onClick={() => {
                      setCurrentTab(tab);
                    }}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className='content'>
                {currentTab === "Headers" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {Object.entries(response.headers || []).map(([key, value]) => (
                      <div
                        className='section-wrapper'
                        style={{
                          width: "100%",
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
                    ))}
                  </div>
                ) : typeof response.body === "object" ? (
                  <div
                    className='response-body'
                    style={{
                      height: "100%",
                      width: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {JSON.stringify(response.body, null, " ")}
                  </div>
                ) : (
                  <div
                    className='response-body'
                    style={{
                      height: "100%",
                      width: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {response.body}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
const RequestPanel: FC = () => {
  // @ts-ignore
  const responseState = useState<FetchyResponse>({});

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
