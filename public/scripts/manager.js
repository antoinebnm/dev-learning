// Sélection des éléments du DOM
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const authPopup = document.getElementById("authPopup");
const closeBtn = document.querySelector(".close-btn");
const authTitle = document.getElementById("authTitle");
const authForm = document.getElementById("authForm");
const accountMenu = document.getElementById("accountMenu");
const userProfil = document.getElementById("userProfil");

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
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Ajouter la logique de connexion/inscription ici
  const action = authTitle.textContent == "Login" ? "login" : "register";
  try {
    let body = {
      username: username,
      password: password,
    };
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
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  closePopup();
});
