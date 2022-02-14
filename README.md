## Intro

Convert an HTML string into a document fragment.

## Usage

```js
import html from "./html.js"

class MyButton extends HTMLElement {
  #root;
  #props = { text: "", onClick: () => {} };
  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#update();
  }

  set props(props) {
    this.#props = props;
    this.#update();
  }

  #update() {
    this.#root.replaceChildren(html`
      <div>
        <button onclick=${() => this.#props.onClick()}>
          ${this.#props.text}
        </button>
      </div>
    `);
  }
}

customElements.define("my-button", MyButton);

function createButton(props) {
  return html`<button onclick=${() => props.onClick()}>Button</button>`;
}

class MyComponent extends HTMLElement {
  #root;
  #input;
  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.replaceChildren(html`
      <div>
        <button onclick=${() => this.#handleClick()}>Button</button>
        ${[...Array(3)].map(() =>
          createButton({ onClick: () => this.#handleClick() })
        )}
        ${createButton({ onClick: () => this.#handleClick() })}
        <input ref=${(el) => (this.#input = el)} />
      </div>
    `);
  }

  connectedCallback() {
    this.#input.focus();
  }

  #handleClick() {
    alert("Click");
  }
}

customElements.define("my-component", MyComponent);
```

