// "Copy my email" button on the home page
const copyButton = document.getElementById("copy-email");
const email = copyButton.dataset.email;
const label = copyButton.textContent;

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = "Copied";
    setTimeout(() => (copyButton.textContent = label), 2000);
  } catch (e) {
    // clipboard not available: open the mail app instead
    location.href = "mailto:" + email;
  }
});
