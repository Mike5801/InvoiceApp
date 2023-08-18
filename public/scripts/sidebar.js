const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const closeSideBarButton = document.getElementById("closeSideBarButton");

let sidebarActive = false;

const showSideBarClass = "h-full w-56 absolute self-end bg-gray-100 shadow-md rounded-tl-md rounded-bl-md transition-all duration-300";
const hideSideBarClass = "h-full w-56 absolute self-end bg-gray-100 shadow-md rounded-tl-md rounded-bl-md translate-x-96 transition-all duration-300";

menuButton.addEventListener("click", () => {
  sidebar.className = showSideBarClass;
});

closeSideBarButton.addEventListener("click", () => {
  sidebar.className = hideSideBarClass;
});