import { Action, Permissions } from "@/lib/constants";

// Check if any action in an action object is true
const hasAnyActionChecked = (actions: Action): boolean => {
  return actions.create || actions.delete || actions.edit || actions.list || actions.read;
};

// Filter permissions to only include menus and submenus with checked permissions
export const filterCheckedPermissions = (permissions: Permissions): Permissions => {
  // First, identify which menus have any checked permissions (directly or in submenus)
  const menusWithCheckedPermissions = new Set<string>();

  // First pass: identify menus with checked permissions
  permissions.forEach((menu) => {
    let hasCheckedPermission = false;

    // Check if the menu has direct actions that are checked
    if (menu.actions && hasAnyActionChecked(menu.actions)) {
      hasCheckedPermission = true;
    }

    // Check if any submenu has checked actions
    if (menu.subMenus) {
      for (const subMenu of menu.subMenus) {
        if (hasAnyActionChecked(subMenu.actions)) {
          hasCheckedPermission = true;
          break;
        }
      }
    }

    if (hasCheckedPermission) {
      menusWithCheckedPermissions.add(menu.menuName);
    }
  });

  // Second pass: filter and build the result
  return permissions
    .filter((menu) => menusWithCheckedPermissions.has(menu.menuName))
    .map((menu) => {
      // If this menu has submenus, filter them to only include those with checked permissions
      if (menu.subMenus) {
        const filteredSubMenus = menu.subMenus.filter((subMenu) =>
          hasAnyActionChecked(subMenu.actions)
        );

        if (filteredSubMenus.length > 0) {
          return {
            ...menu,
            subMenus: filteredSubMenus,
          };
        }
      }

      return menu;
    });
};
