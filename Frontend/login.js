const submitBtn = document.querySelector("#submit");

// POST USER
submitBtn.addEventListener("click", postUser);
async function postUser(e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const res = await axios.post("http://localhost:5000/login", {
      email: email,
      password: password,
    });
    if (res.status == 200) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center success-notify";
      notify.innerText = "Logging In";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    }
  } catch (error) {
    if (error.response.status == 401) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center warn-notify";
      notify.innerText = "Invalid password!";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    }
    else if (error.response.status == 404) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center failure-notify";
      notify.innerText = "User not registered!";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    }
  }
}