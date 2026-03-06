(function () {
  function getFileName() {
    return location.pathname.split("/").pop() || "webli1.html";
  }

  function notifyParent() {
    if (window.top !== window.self) {
      window.top.postMessage(
        { type: "inner-page-changed", page: getFileName() },
        "*"
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", notifyParent);
  } else {
    notifyParent();
  }
})();
