document.addEventListener("DOMContentLoaded", () => {
 // Verifica el login apenas cargue
 verificarlogeo();
console.log(sessionStorage.getItem("nombreUsuario"))
  // Seleccionar las cartas del menú
  const cards = document.querySelectorAll(".menu-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
});

function verificarlogeo() {
  const logueado = sessionStorage.getItem("usuarioLogueado");

  const btn_login = document.querySelector(".btn-acceso");
  const btn_carrito = document.querySelector(".btn-carrito");
  const btn_pedido = document.querySelector(".btn-pedido");

  // ⚠️ Verifica si los elementos existen antes de agregar listeners
  if (btn_carrito) {
    btn_carrito.addEventListener("click", (e) => {
      e.preventDefault();
      if (logueado ) {
        window.location.href = "../carrito/carrito.html";
      } else {
        alert("Debes iniciar sesión para acceder al carrito.");
        window.location.href = "../login/login.html";
      }
    });
  }

  if (btn_pedido) {
    btn_pedido.addEventListener("click", (e) => {
      e.preventDefault();
      if (logueado) {
        window.location.href = "../dashbar/index.html";
      } else {
        alert("Debes iniciar sesión para hacer un pedido.");
        window.location.href = "../login/login.html";
      }
    });
  }

  if (btn_login) {
    // Limpia eventos anteriores si los hay
    const nuevoBtnLogin = btn_login.cloneNode(true);
    btn_login.parentNode.replaceChild(nuevoBtnLogin, btn_login);

    if (logueado ) {
      nuevoBtnLogin.innerHTML = `<i class="fas fa-user"></i> Cerrar sesión`;
      nuevoBtnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("usuarioLogueado");
        alert("Sesión cerrada.");
        window.location.href='../dashbar/index.html';
      });
    } else {
      nuevoBtnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../login/login.html";
      });
    }
  }
}
