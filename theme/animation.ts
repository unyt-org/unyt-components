function querySelectorAll<T extends Element = Element>(
  selector: string,
  rootNode = document.body,
) {
  const list: T[] = [];
  const traverser = (node: T) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    if (node.matches(selector)) {
      list.push(node);
    }
    const children = node.children as unknown as T[];
    if (children.length) {
      for (const child of children) {
        traverser(child);
      }
    }
    const shadowRoot = node.shadowRoot;
    if (shadowRoot) {
      const shadowChildren = shadowRoot.children as unknown as T[];
      for (const shadowChild of shadowChildren) {
        traverser(shadowChild);
      }
    }
  };
  traverser(rootNode as any);
  return list;
}
globalThis.addEventListener("DOMContentLoaded", function () {
  const onloadElements = querySelectorAll<HTMLElement>(".onload-animate");
  globalThis.addEventListener("scroll", function () {
    onloadElements.forEach(function (element) {
      element.classList.add("build-in-animate");
      const windowBottom = globalThis.scrollY + globalThis.innerHeight;
      const elementTop = element.offsetTop;
      const elementBottom = elementTop + element.offsetHeight;
      if (windowBottom >= elementTop && globalThis.scrollY < elementBottom) {
        if (!element.classList.contains("fade-in")) {
          element.classList.add("fade-in");
        }
      } else if (element.classList.contains("fade-in")) {
        element.classList.remove("fade-in");
      }
    });
  });

  const reveals = querySelectorAll(".build-scale-up");
  const elementVisible = 150;

  function animate() {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = globalThis.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("fade-in-animate");
      } else {
        reveals[i].classList.remove("fade-in-animate");
      }
    }
  }
  globalThis.addEventListener("scroll", animate);
});
