function initializeNavigation() {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navegacao");

  if (
    !(header instanceof HTMLElement) ||
    !(menuButton instanceof HTMLButtonElement) ||
    !(navigation instanceof HTMLElement)
  ) {
    return;
  }

  function setMenuOpen(isOpen, { returnFocus = false } = {}) {
    header.dataset.menuOpen = String(isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Fechar navegação" : "Abrir navegação",
    );

    if (returnFocus) {
      menuButton.focus();
    }
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    const menuIsOpen = header.dataset.menuOpen === "true";

    if (event.key === "Escape" && menuIsOpen) {
      setMenuOpen(false, { returnFocus: true });
    }
  });
}

initializeNavigation();
