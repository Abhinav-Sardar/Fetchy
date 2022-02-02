"use strict";
function getRequestId() {
    const alphas = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const symbols = '!@#$%^&*()-_=+[]{}|;:",.<>/?';
    let str = "";
    const fields = [alphas, nums, symbols];
    for (let i = 0; i < 15; i++) {
        const randomField = fields[Math.floor(Math.random() * fields.length)];
        const randomString = randomField[Math.floor(Math.random() * randomField.length)];
        str += randomString;
    }
    return str;
}
function isItemThere(requestName) {
    const tabs = JSON.parse(localStorage.getItem("tabs") || "[]");
    return Boolean(tabs.find((tab) => tab.title === requestName));
}
const addTabBtn = document.querySelector(".fas.fa-plus");
const tabsWrapper = document.querySelector(".tabs-wrapper");
addTabBtn.addEventListener("click", () => {
    const input = document.querySelector(".tab-input");
    if (input) {
        input.focus();
    }
    else {
        const div = document.createElement("div");
        div.classList.add("tab");
        div.innerHTML = "<form class='tab-form'><input class='tab-input'/></form>";
        tabsWrapper.appendChild(div);
        const input = document.querySelector(".tab-input");
        input.focus();
        const form = document.querySelector(".tab-form");
        form.onsubmit = (ev) => {
            ev.preventDefault();
            const { value } = input;
            if (!value || !value.trim() || value.length > 30) {
                alert("Invalid Request Title");
            }
            else {
                if (isItemThere(value)) {
                    alert("An Item with the same name already exists");
                }
                else {
                    const tabs = JSON.parse(localStorage.getItem("tabs") || "[]");
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
