const navbarOptions = [
  {
    label: "Home",
    value: "home",
  },
  {
    label: "Mobile Phones",
    value: "mobile_phones",
  },
  {
    label: "Laptops",
    value: "laptops",
  },
];

export const headerLayout = {
  name: "div",
  props: {
    className: "header",
  },
  children: [
    {
      name: "div",
      props: {
        innerHTML: "Shop Away!",
        className: "logo-text",
      },
    },
    {
      name: "div",
      props: {
        className: "navbar-container",
      },
      children: [
        {
          name: "navbar",
          props: {
            items: navbarOptions,
            labelClass: "navbar-item",
            activeTab: 0,
            activeClass: "navbar-item-active",
          },
          events: [
            [
              "selectedNavItem",
              function (data: any) {
                return data;
              },
            ],
          ],
        },
      ],
    },
  ],
};
