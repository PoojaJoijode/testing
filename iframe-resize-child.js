(function () {
  function pageHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
  }

  function sendHeight() {
    parent.postMessage(
      { type: "IFRAME_HEIGHT", height: pageHeight() },
      "*"
    );
  }

  window.addEventListener("load", sendHeight);
  window.addEventListener("resize", sendHeight);

  // TeX4ht pages can grow after CSS/fonts load; update height for a few seconds
  let count = 0;
  const timer = setInterval(() => {
    sendHeight();
    if (++count > 20) clearInterval(timer); // ~10 seconds
  }, 500);
})();
