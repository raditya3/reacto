export const listingLayout = {
  name: "div",
  props: {
    className: "list-item",
    "[innerHTML]": "this.model",
  },
  loop: "itemList",
};
