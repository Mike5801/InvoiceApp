const navbarHome = document.getElementById("navbarHome");
const navbarConfiguration = document.getElementById("navbarConfiguration");

const navbarActiveClass = "flex justify-center items-center text-white text-lg rounded-full w-9 h-9 bg-sky-800 cursor-default";

if (currentLink === navbarHome.getAttribute("href")) {
  navbarHome.className = navbarActiveClass;
} else if (currentLink === navbarConfiguration.getAttribute("href")) {
  navbarConfiguration.className = navbarActiveClass;
}