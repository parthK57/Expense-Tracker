const submitBtn = document.querySelector("#submit__signUp");

// POST USER
submitBtn.addEventListener("click", postUser);
async function postUser(e) {
  e.preventDefault();
  const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  if (password.length < 8) {
    return alert("Length of password should be greater than 8!");
  }

  try {
    const res = await axios.post("http://localhost:5000/postuser", {
      username: username,
      email: email,
      password: password,
    });
    if (res.status == 201) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center success-notify";
      notify.innerText = "ID created!";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    }
  } catch (error) {
    if (error.response.status == 400) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center failure-notify";
      notify.innerText = "User already exists!";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    }
    else if (error.response.status == 500) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center failure-notify";
      notify.innerText = "Internal Server Error!";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    }
  }
}
