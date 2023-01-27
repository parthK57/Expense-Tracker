const recoverBtn = document.querySelector("#recover-btn");
const username = document.querySelector("#username").value;
const email = document.querySelector("#email").value;

recoverBtn.addEventListener("click", recoverAccount);
function recoverAccount(e) {
  console.log(username, email);

  const recover = async () => {
    try {
      const res = await axios.post("http://localhost:5000/resetPassword", {
        username: username,
        email: email,
      });
      if (res.status == 200) {
        const notify = document.createElement("div");
        const body = document.querySelector("body");
        notify.className =
          "container d-flex justify-content-center align-content-center success-notify";
        notify.innerText = "Check your email!";
        body.appendChild(notify);
      }
    } catch (error) {
      console.log(error);
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center failure-notify";
      notify.innerText = "Error has occured!";
      body.appendChild(notify);
    }
    recover();
  };
}
