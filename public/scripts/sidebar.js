const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const closeSideBarButton = document.getElementById("closeSideBarButton");

let sidebarActive = false;

const showSideBarClass = "h-full w-56 fixed self-end bg-gray-100 shadow-md rounded-tl-md rounded-bl-md transition-all duration-300 z-20";
const hideSideBarClass = "h-full w-56 fixed self-end bg-gray-100 shadow-md rounded-tl-md rounded-bl-md translate-x-96 transition-all duration-300";

const sidebarHome = document.getElementById("sidebarHome");
const sidebarConfiguration = document.getElementById("sidebarConfiguration");

const currentLink = window.location.pathname;

const activeClass = "flex items-center gap-2 w-full h-10 rounded-lg transition-all pl-3 bg-sky-200"
const inactiveClass = "flex items-center gap-2 w-full h-10 rounded-lg hover:bg-gray-200 active:bg-gray-300 cursor-pointer transition-all pl-3";

menuButton.addEventListener("click", () => {
  sidebar.className = showSideBarClass;
});

closeSideBarButton.addEventListener("click", () => {
  sidebar.className = hideSideBarClass;
});

if (currentLink === sidebarHome.getAttribute("href")) {
  sidebarHome.className = activeClass;
} else if (currentLink === sidebarConfiguration.getAttribute("href")) {
  sidebarConfiguration.className = activeClass;
}