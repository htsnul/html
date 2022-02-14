## Intro

Convert an HTML string to a `DocumentFragment`.

## Features

* Can insert inline JavaScript property.
* Can insert inline `DocumentFragment` or an array of them.
* Can reference `HTMLElement` by callback.

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
        <my-button
          props=${{ text: "Button", onClick: () => this.#handleClick() }}
        ></my-button>
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

