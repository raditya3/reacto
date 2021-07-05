import { get, pipe } from "lodash/fp";
import { IPageConfig } from "../../../Types";
import { headerLayout } from "./header-banner.layout";
import sampleData from "../sample-data/category-data/listing.json";
import { listingLayout } from "./item-list.layout";
export const categoryPage: IPageConfig = {
  layout: {
    name: "div",
    props: {
      className: "products-listing",
    },
    children: [
      headerLayout,
      {
        name: "div",
        props: {
          className: "list-container",
        },
        children: [listingLayout],
      },
    ],
  },
  contextProp: {
    derivedSpec: [
      {
        name: "productCategory",
        from: ["routeParams"],
        spec: function (data: any) {
          return data.routeParams?.id;
        },
      },
      {
        name: "productHeader",
        from: ["listingData", "productCategory"],
        filterFn: function (data: any, trigger: string) {
          return !!data.productCategory;
        },
        spec: function (data: any) {
          return pipe(
            get("listingData"),
            get(data.productCategory),
            get("header")
          )(data);
        },
      },
      {
        name: "itemList",
        from: ["listingData", "productCategory"],
        filterFn: function (data: any) {
          return !!data.productCategory;
        },
        spec: function (data: any) {
          return pipe(
            get("listingData"),
            get(data.productCategory),
            get("data")
          )(data);
        },
      },
      {
        name: "_xxx",
        from: ["listingData"],
        spec: function (data: any) {
          return data;
        },
      },
    ],
    propConfig: [
      ["productCategory", null],
      ["listingData", sampleData],
      ["productHeader", null],
      ["itemList", null],
      ["_xxx", null],
    ],
  },
  style: require("./product-listing.module.scss"),
};
