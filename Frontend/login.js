const submitBtn = document.querySelector("#submit");
const signUpBtn = document.querySelector("#signUp");

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "http://127.0.0.1:5500/Frontend/sign-up.html";
});

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
        sessionStorage.setItem("email", `${email}`);
        sessionStorage.setItem("password", `${password}`);
        window.location.href = "http://127.0.0.1:5500/Frontend/expense.html";
      }, 500);
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
    } else if (error.response.status == 404) {
      const notify = document.createElement("div");
      const body = document.querySelector("body");
      notify.className =
        "container d-flex justify-content-center align-content-center failure-notify";
      notify.innerText = "User not registered!";

      body.appendChild(notify);
      setTimeout(() => {
        body.removeChild(notify);
      }, 2500);
    } else if (error.response.status == 500) {
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
