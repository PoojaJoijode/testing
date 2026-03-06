(function () {
  function updateParentHash() {
    if (window.top !== window.self) {
      var file = location.pathname.split("/").pop();

      try {
        if (window.top.location.hash !== "#" + file) {
          window.top.history.pushState(null, "", "#" + file);
        }
      } catch (e) {
        // fallback
        try {
          window.top.location.hash = file;
        } catch (err) {}
      }

      try {
        window.top.postMessage(
          { type: "inner-page-changed", page: file },
          "*"
        );
      } catch (e) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateParentHash);
  } else {
    updateParentHash();
  }
})();
