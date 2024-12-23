// Sélection des éléments du DOM
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const closeBtn = document.querySelector(".close-btn");

const authButtons = document.querySelector(".auth-buttons");
const authPopup = document.getElementById("authPopup");
const authTitle = document.getElementById("authTitle");
const authForm = document.getElementById("authForm");

const accountMenu = document.getElementById("accountMenu");
const userProfil = document.getElementById("userProfil");
const switchAuth = document.getElementById("switchAuth");

const accLogout = document.getElementById("accLogout");

const fields = {
  usernameField: document.getElementById("username"),
  displaynameField: document.getElementById("displayname"),
  passwordField: document.getElementById("password"),
  confirmpwdField: document.getElementById("confirmpwd"),
};

const sid = getCookie("sid") || null;
if (sid) {
  fetchData("/api/auth/preload", undefined, undefined, { Cookie: sid })
    .then((name) => {
      toggleUserProfil(name);
    })
    .catch((err) => {});
} else {
  toggleAuthButtons();
}

function clearFields(array) {
  array.forEach((element) => {
    element.value = "";
  });
}

function switchFields(array, hide = true) {
  array.forEach((element) => {
    element.required = !hide;
    element.hidden = hide;
  });
}

function toggleUserProfil(name) {
  authButtons.hidden = true;
  accountMenu.hidden = false;

  userProfil.textContent = name;
}

function toggleAuthButtons() {
  authButtons.hidden = false;
  accountMenu.hidden = true;
}

// Fonction pour ouvrir le popup
function openPopup(type) {
  if (type == "register") {
    switchFields([fields.displaynameField, fields.confirmpwdField], false);

    switchAuth.innerHTML = `Already have an account ?</br>
  > Log in here instead <`;
    switchAuth.addEventListener("click", () => openPopup("login"));
  } else {
    switchFields([fields.displaynameField, fields.confirmpwdField], true);

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

accLogout.addEventListener("click", () => {
  fetchData("/api/auth/logout").then(() => {
    window.location.reload();
  });
});

// Fermer le popup si on clique en dehors du contenu
window.addEventListener("click", (event) => {
  if (event.target === authPopup) {
    closePopup();
  }
});

// Soumission du formulaire d'authentification
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Ajouter la logique de connexion/inscription ici
  const action = authTitle.textContent == "Login" ? "login" : "register";
  try {
    let headers = {};
    if (action == "register") {
      if (fields.passwordField.value != fields.confirmpwdField.value) {
        throw new Error(
          "Passwords must be the same (password confirmation is different)"
        );
      }

      headers["Login"] = fields.usernameField.value;
      headers["Password"] = fields.passwordField.value;
      headers["DisplayName"] = fields.displaynameField.value;
    } else {
      headers["Login"] = fields.usernameField.value;
      headers["Password"] = fields.passwordField.value;
    }

    const data = await fetchData(
      `api/auth/${action}`,
      undefined,
      undefined,
      headers
    );
    if (data?.message == "Response status: 401") {
      throw new Error("Invalid credentials !");
    }
    if (data?.userInfo) {
      toggleUserProfil(data.userInfo.displayName);
    }

    // Clear fields and classes when all cases are verified
    clearFields(Object.values(fields));
    switchFields([fields.displaynameField, fields.confirmpwdField], true);
    fields.usernameField.classList.remove("wrong");
    fields.passwordField.classList.remove("wrong");
    fields.confirmpwdField.classList.remove("wrong");

    closePopup();
  } catch (error) {
    if (error.message.startsWith("Passwords")) {
      fields.confirmpwdField.className = "wrong";
    }
    if (error.message.startsWith("Invalid")) {
      fields.usernameField.className = "wrong";
      fields.passwordField.className = "wrong";
    }
    //myRedirect("/");
  }
});
