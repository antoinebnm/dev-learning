// Sélection des éléments du DOM
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const authPopup = document.getElementById("authPopup");
const closeBtn = document.querySelector(".close-btn");
const authTitle = document.getElementById("authTitle");
const authForm = document.getElementById("authForm");
const accountMenu = document.getElementById("accountMenu");
const userProfil = document.getElementById("userProfil");
const switchAuth = document.getElementById("switchAuth");

const usernameField = document.getElementById("username");
const displaynameField = document.getElementById("displayname");
const passwordField = document.getElementById("password");
const confirmpwdField = document.getElementById("confirmpwd");

const sid = getCookie("sid") || null;
if (sid) {
  fetchData("/api/auth/preload", {}, "POST", { Cookie: sid })
    .then((name) => {
      toggleUserProfil(name);
    })
    .catch((err) => {});
}

function toggleUserProfil(name) {
  loginButton.hidden = true;
  registerButton.hidden = true;

  userProfil.textContent = name;
}

// Fonction pour ouvrir le popup
function openPopup(type) {
  if (type == "register") {
    displaynameField.hidden = false;
    displaynameField.required = true;
    confirmpwdField.hidden = false;
    confirmpwdField.required = true;
    switchAuth.innerHTML = `Already have an account ?</br>
  > Log in here instead <`;
    switchAuth.addEventListener("click", () => openPopup("login"));
  } else {
    displaynameField.hidden = true;
    displaynameField.required = false;
    confirmpwdField.hidden = true;
    confirmpwdField.required = false;
    switchAuth.innerHTML = `First time here ?</br>
  > Register for free <`;
    switchAuth.addEventListener("click", () => openPopup("register"));
  }
  authPopup.style.display = "flex";
  authTitle.textContent = type === "login" ? "Login" : "Register";
}

// Fonction pour fermer le popup
function closePopup() {
  authPopup.style.display = "none";
}

// Événements pour ouvrir et fermer le popup
loginButton.addEventListener("click", () => openPopup("login"));
registerButton.addEventListener("click", () => openPopup("register"));
closeBtn.addEventListener("click", closePopup);

// Fermer le popup si on clique en dehors du contenu
window.addEventListener("click", (event) => {
  if (event.target === authPopup) {
    closePopup();
  }
});

// Soumission du formulaire d'authentification
authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Ajouter la logique de connexion/inscription ici
  const action = authTitle.textContent == "Login" ? "login" : "register";
  try {
    let body;
    if (action == "register") {
      body = {
        username: usernameField.value,
        displayName: displaynameField.value,
        password: passwordField.value,
        confirmpwd: confirmpwdField.value,
      };
    } else {
      body = {
        username: usernameField.value,
        password: passwordField.value,
      };
    }
    console.log(body);

    fetchData(`api/auth/${action}`, body).then((data) => {
      console.log(data);
      if (data["OAuthToken"]) {
        toggleUserProfil(data["displayName"]);
      }
    });
  } catch (error) {
    myRedirect("/", "index", "redirect");
    console.log(error + "Something went wrong!");
  }

  // clear fields
  usernameField.value = "";
  displaynameField.value = "";
  displaynameField.required = false;
  displaynameField.hidden = true;

  passwordField.value = "";
  confirmpwdField.value = "";
  confirmpwdField.required = false;
  confirmpwdField.hidden = true;

  closePopup();
});
