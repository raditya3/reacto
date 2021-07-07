export const listingLayout = {
  name: "div",
  props: {
    className: "list-item",
  },
  children: [
    {
      name: "img",
      props: {
        "[src]": "$(this.img)",
        className: "item-img",
      },
    },
    {
      name: "div",
      props: {
        className: "info-container",
      },
      children: [
        {
          name: "h1",
          props: {
            "[innerHTML]": "$(this.model)",
          },
        },
        {
          name: "ul",
          children: [
            {
              name: "li",
              props: {
                "[isVisible]": "$(this.spec.manufacturer)",
                "[innerHTML]": "Manufacturer : $(this.spec.manufacturer)",
              },
            },
          ],
        },
      ],
    },
  ],
  loop: "itemList",
};
