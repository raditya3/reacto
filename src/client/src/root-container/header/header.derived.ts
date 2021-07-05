import { IDerivedCalc } from "../../../../Types";
export const derived: IDerivedCalc[] = [
  {
    name: "activeTab",
    from: ["routeParams", "listingData"],
    spec: function (data: any) {
      if (!data.routeParams?.id) {
        return "home";
      }
      return data.routeParams.id;
    },
  },
  {
    name: "triggerRedirect",
    filterFn: function (data: any) {
      return !!data.redirectURL;
    },
    from: ["redirectURL"],
    spec: function (data: any) {
      return true;
    },
  },
  {
    name: "redirectURL",
    from: ["selectedNavItem"],
    filterFn: function (data: any, trigger: string) {
      return !!data.selectedNavItem;
    },
    spec: function (data: any) {
      return "/products/" + data.selectedNavItem;
    },
  },
];
