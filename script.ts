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
interface showModalParameters {
  message: string;
  onModalOpen?: () => void;

  onModalClose?: () => void;
}
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
function showModal({
  message,
  onModalClose,
  onModalOpen,
}: showModalParameters) {
  const modalBG = document.querySelector(".modal-backdrop") as HTMLDivElement;
  const modal = document.querySelector(".modal") as HTMLDivElement;
  onModalOpen?.();
  modalBG.style.display = "flex";
  // modal.style.height = "50vh";
  // modal.style.width = "35vw";
  modal.style.display = "block";
  modal.animate(
    [
      { height: 0, width: 0, opacity: 0 },
      { height: "50vh", width: "35vw", opacity: 1 },
    ],
    {
      easing: "ease-in-out",
      duration: 500,
      fill: "forwards",
    }
  );
  modal.innerHTML = '<span class="modal-message">' + message + "</span>";

  modalBG.onclick = () => {
    modalBG.style.display = "none";
    // modal.style.height = "0vh";
    // modal.style.width = "0vw";
    modal.animate(
      [
        { height: "50vh", width: "35vw", opacity: 1 },
        { height: 0, width: 0, opacity: 0, display: "none" },
      ],
      {
        easing: "ease-in-out",
        duration: 500,
        fill: "forwards",
      }
    );

    onModalClose?.();
  };
}
const addTabBtn = document.querySelector(".fas.fa-plus")!;
const tabsWrapper = document.querySelector(".tabs-wrapper") as HTMLDivElement;
function addTaskTab(): void {
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
        showModal({
          message: "Invalid Request Title",
          onModalOpen: () => input.blur(),
          onModalClose: () => input.focus(),
        });
      } else {
        if (isItemThere(value)) {
          showModal({
            message: "An Item with the same name already exists",
            onModalOpen: () => input.blur(),
            onModalClose: () => input.focus(),
          });
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
          showModal({
            message: "Your Request was created successfully!",
          });
          renderTasks();
        }
      }
    };
  }
}
function deleteRequest(requestId: FetchyRequest["id"]) {
  const tabs: FetchyRequest[] = JSON.parse(localStorage.getItem("tabs")!);
  const tab = tabs.find((tab) => tab.id === requestId);
  const index = tabs.indexOf(tab!);
  tabs.splice(index, 1);
  localStorage.setItem("tabs", JSON.stringify(tabs));
  renderTasks();
}
function renderTasks(): void {
  tabsWrapper.innerHTML = "";
  const tabs: FetchyRequest[] = JSON.parse(
    localStorage.getItem("tabs") || "[]"
  );
  if (tabs.length === 0) {
    tabsWrapper.innerHTML = `<span>No Requests Available !</span>`;
  } else {
    tabs.forEach((tab) => {
      const newTab = document.createElement("div");
      newTab.classList.add("tab");
      newTab.style.cursor = "pointer";
      newTab.onclick = () => {};
      newTab.innerHTML += `
      <span>
      ${tab.title}
      </span>
      <i class="far fa-trash-alt" style="margin-left:30px  ;  font-size:20px" onclick="deleteRequest('${tab.id}')"></i>
      
      `;
      tabsWrapper.appendChild(newTab);
    });
  }
}

function isItemThere(requestName: FetchyRequest["title"]): boolean {
  const tabs: FetchyRequest[] = JSON.parse(
    localStorage.getItem("tabs") || "[]"
  );
  return Boolean(tabs.find((tab) => tab.title === requestName));
}
window.onload = () => {
  addTabBtn.addEventListener("click", addTaskTab);
  renderTasks();
};
