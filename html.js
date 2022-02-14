export default function html(strs, ...vals) {
  const attrs = [];
  const frags = [];
  const preserveFrag = (frag) => {
    frags.push(frag);
    const tagName = frag.firstElementChild.tagName;
    return `<${tagName} id="_${frags.length - 1}"></${tagName}>`;
  };
  const text =
    vals
      .map((v, i) => {
        const s = strs[i];
        if (s.endsWith("=") && typeof v !== "string") {
          const name = s.match(/ (\w+)=$/)[1];
          attrs.push({ name, value: v });
          return (
            s.slice(0, -`${name}=`.length) +
            `data-${name}="${attrs.length - 1}"`
          );
        }
        if (v instanceof DocumentFragment) {
          return s + preserveFrag(v);
        }
        if (Array.isArray(v)) {
          const frag = html(Array(v.length + 1).fill(""), ...v);
          return s + preserveFrag(frag);
        }
        if (v === undefined) {
          return s;
        }
        return s + v;
      })
      .join("") + strs.at(-1);
  const template = document.createElement("template");
  template.innerHTML = text;
  const fragment = document.importNode(template.content, true);
  attrs.forEach((attr, i) => {
    const el = fragment.querySelector(`[data-${attr.name}="${i}"]`);
    if (attr.name === "ref" && typeof attr.value === "function") {
      attr.value(el);
    } else {
      el[attr.name] = attr.value;
    }
    el.removeAttribute(`data-${attr.name}`);
  });
  frags.forEach((frag, i) => {
    const el = fragment.querySelector(`#_${i}`);
    el.replaceWith(frag);
  });
  return fragment;
}

