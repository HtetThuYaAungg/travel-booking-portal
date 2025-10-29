import {
  LayoutDashboard,
  LucideProps,
  Replace,
  UserRoundCog,
  Gem,
  Logs,
  Building,
  Plane,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type Action = {
  create: boolean;
  delete: boolean;
  edit: boolean;
  list: boolean;
  reject?: boolean;
  read: boolean;
  approve?: boolean;
  [key: string]: boolean | undefined;
};

export type SubMenu = {
  menuName: string;
  actions: Action;
};

export type Menu = {
  menuName: string;
  subMenus?: SubMenu[];
  actions?: Action;
};

export type Permissions = Menu[];

export type static_route_type = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export const defaultPageSize = 25;
export const defaultPageNo = 1;

export const UserTypeOptions = [
  { value: "MAKER", label: "Maker" },
  { value: "CHECKER", label: "Checker" },
];

export const static_routes: static_route_type[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
];

export const permission_routes = [
  {
    title: "Travel",
    url: "#",
    icon: Building,
    items: [
      {
        title: "Hotels",
        url: "/travel/hotels",
      },
      {
        title: "Hotel Bookings",
        url: "/travel/hotel-bookings",
      },
      {
        title: "Flights",
        url: "/travel/flights",
      },
      {
        title: "Flight Bookings",
        url: "/travel/flight-bookings",
      },
    ]
  },
  {
    title: "Setting",
    url: "#",
    icon: UserRoundCog,
    items: [
      {
        title: "Roles",
        url: "/setting/roles",
      },
      {
        title: "Departments",
        url: "/setting/departments",
      },
      {
        title: "Users",
        url: "/setting/users",
      },
    ],
  },
];

export const initialPermissions: Permissions = [
  {
    menuName: "Setting",
    subMenus: [
      {
        menuName: "Users",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
        },
      },
      {
        menuName: "Roles",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
        },
      },
      {
        menuName: "Departments",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
        },
      },
      {
        menuName: "Permissions",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
        },
      },
    ],
  },
  {
    menuName: "Travel",
    subMenus: [
      {
        menuName: "Hotels",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
        },
      },
      {
        menuName: "Hotel Bookings",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
          approve: false,
          reject: false,
        },
      },
      {
        menuName: "Flights",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
        },
      },
      {
        menuName: "Flight Bookings",
        actions: {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
          approve: false,
          reject: false,
        },
      },
    ],
 }
];

export const permission_actions = ["create", "edit", "delete", "list", "read", "approve", "reject"];

export const action = [
  {
    value: "create",
    label: "Create",
  },
  {
    value: "edit",
    label: "Edit",
  },
  {
    value: "delete",
    label: "Delete",
  },
  {
    value: "list",
    label: "List",
  },
  {
    value: "read",
    label: "Read",
  },
];
