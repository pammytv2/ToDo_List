

  const showHiddenPass = (loginPass, loginEye) => {
    const input = document.getElementById(loginPass),
          iconEye = document.getElementById(loginEye);

    iconEye.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        iconEye.classList.add("ri-eye-line");
        iconEye.classList.remove("ri-eye-off-line");
      } else {
        input.type = "password";
        iconEye.classList.remove("ri-eye-line");
        iconEye.classList.add("ri-eye-off-line");
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    
    showHiddenPass("login-pass", "login-eye");
    showHiddenPass("login-pass1", "login-eye1");

    const form = document.querySelector(".login__form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("username").value.trim();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-pass1").value;
      const password_confirmation = document.getElementById("login-pass").value;

      if (password !== password_confirmation) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          alert(`Registration failed: ${text}`);
          return;
        }

        const data = await response.json();

        //  เก็บ token และชื่อผู้ใช้
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", data.user.name);

        alert("Registration successful");

        
        window.location.href = "/Home";
      } catch (err) {
        console.error(err);
        alert("An error occurred while registering.");
      }
    });
  });

