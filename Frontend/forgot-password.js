const recoverBtn = document.querySelector("#recover-btn");

recoverBtn.addEventListener("click", recoverAccount);
function recoverAccount(e) {
  e.preventDefault();

  const recover = () => {
    const email = document.querySelector("#email").value;
    const username = document.querySelector("#username").value;
    console.log(username, email);
    try {
      const res = axios.post("http://localhost:5000/resetpasswordrequsthandler", {
        username: username,
        email: email,
      });
      console.log(res );
      if (res != null) {
        const notify = document.createElement("div");
        const body = document.querySelector("body");
        notify.className =
          "container d-flex justify-content-center align-content-center success-notify";
        notify.innerText = "Check your email!";
        body.appendChild(notify);
      }
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status == 500) {
        const notify = document.createElement("div");
        const body = document.querySelector("body");
        notify.className =
          "container d-flex justify-content-center align-content-center failure-notify";
        notify.innerText = "Error has occured!";
        body.appendChild(notify);
      }
    }
  };
  recover();
}
