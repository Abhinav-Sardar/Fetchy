type FetchyRequest = {
  requestUrl: string;
  id: string;
  requestHeaders: {
    [key: string]: string;
  };
  title: string;
  body: {
    contentType: "text/html" | "text/plain" | "application/json";
    content: string;
  };
};
function getRequestId(): FetchyRequest["id"] {
  const alphas = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const symbols = '!@#$%^&*()-_=+[]{}|;:",.<>/?';
  let str: string = "";
  const fields = [alphas, nums, symbols];
  for (let i = 0; i < 15; i++) {
    const randomField = fields[Math.floor(Math.random() * fields.length)];
    const randomString =
      randomField[Math.floor(Math.random() * randomField.length)];
    str += randomString;
  }
  return str;
}

function isItemThere(requestName: FetchyRequest["title"]): boolean {
  const tabs: FetchyRequest[] = JSON.parse(
    localStorage.getItem("tabs") || "[]"
  );
  return Boolean(tabs.find((tab) => tab.title === requestName));
}
const addTabBtn = document.querySelector(".fas.fa-plus")!;
const tabsWrapper = document.querySelector(".tabs-wrapper") as HTMLDivElement;
addTabBtn.addEventListener("click", () => {
  const input = document.querySelector(".tab-input") as HTMLInputElement;
  if (input) {
    input.focus();
  } else {
    const div = document.createElement("div");
    div.classList.add("tab");
    div.innerHTML = "<form class='tab-form'><input class='tab-input'/></form>";
    tabsWrapper.appendChild(div);
    const input = document.querySelector(".tab-input") as HTMLInputElement;
    input.focus();
    const form = document.querySelector(".tab-form") as HTMLFormElement;
    form.onsubmit = (ev) => {
      ev.preventDefault();
      const { value } = input;
      if (!value || !value.trim() || value.length > 30) {
        alert("Invalid Request Title");
      } else {
        if (isItemThere(value)) {
          alert("An Item with the same name already exists");
        } else {
          const tabs: FetchyRequest[] = JSON.parse(
            localStorage.getItem("tabs") || "[]"
          );

          tabs.push({
            body: {
              content: "",
              contentType: "text/plain",
            },
            requestHeaders: {},
            requestUrl: "",
            id: getRequestId(),
            title: value,
          });
          localStorage.setItem("tabs", JSON.stringify(tabs));
          tabsWrapper.removeChild(div);
          alert("Sucess!");
        }
      }
    };
  }
});
