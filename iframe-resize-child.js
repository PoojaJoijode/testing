<script>
(function () {
  function sendHeight() {
    var h = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    parent.postMessage({ type: "IFRAME_HEIGHT", height: h }, "*");
  }

  window.addEventListener("load", sendHeight);
  window.addEventListener("resize", sendHeight);

  new MutationObserver(sendHeight).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  setInterval(sendHeight, 800);
})();
</script>
