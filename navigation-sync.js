// navigation-sync.js
(function () {
  function getFileName() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function notifyParent() {
    if (window.top !== window.self) {
      var file = getFileName();

      try {
        if (window.top.location.hash !== "#" + file) {
          window.top.history.pushState(null, "", "#" + file);
        }
      } catch (e) {
        // ignore cross-frame/history issues
      }

      try {
        window.top.postMessage(
          { type: "inner-page-changed", page: file },
          "*"
        );
      } catch (e) {
        // ignore message errors
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", notifyParent);
  } else {
    notifyParent();
  }
})();
