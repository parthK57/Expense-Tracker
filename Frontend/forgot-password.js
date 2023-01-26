const recoverBtn = document.querySelector("#recover-btn");
const username = document.querySelector("#username").value;
const email = document.querySelector("#email").value;

recoverBtn.addEventListener("click", recoverAccount);
function recoverAccount() {
  const recover = async () => {
    try {
      const res = await axios.post("http://localhost:5000/recoverAccount", {
        username: username,
        email: email,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    recover();
  };
}
