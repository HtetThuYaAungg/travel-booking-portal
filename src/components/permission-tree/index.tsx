"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Archive, UserRoundCog } from "lucide-react";
import { useController, type Control } from "react-hook-form";
import {
  permission_actions,
  type Action,
  type Menu,
  type Permissions,
  type SubMenu,
} from "@/lib/constants";

// Define the state for checked items
type CheckedState = {
  [menuName: string]: {
    [subMenu: string]: {
      [action: string]: boolean;
    };
  };
};

interface PermissionTreeProps {
  defaultPermissions?: Permissions;
  name: string;
  disabled?: boolean;
  control?: Control<any>;
  onPermissionsChange?: (permissions: Permissions) => void;
}

export default function PermissionTree({
  defaultPermissions = [],
  name,
  control,
  disabled = false,
  onPermissionsChange,
}: PermissionTreeProps) {
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>(
    {}
  );
  const [indeterminateState, setIndeterminateState] = useState<
    Record<string, boolean>
  >({});

  // Use React Hook Form controller
  const { field } =
    control && name
      ? useController({
          name,
          control,
          defaultValue: defaultPermissions,
        })
      : { field: null };

  // Convert field.value (Permissions) to CheckedState for internal use
  const [checkedState, setCheckedState] = useState<CheckedState>({});

  // Initialize expanded state
  useEffect(() => {
    if (Object.keys(expandedState).length === 0) {
      const initialExpandedState: Record<string, boolean> = {};
      defaultPermissions.forEach((menu) => {
        initialExpandedState[menu.menuName] = true;
      });
      setExpandedState(initialExpandedState);
    }
  }, [defaultPermissions, expandedState]);

  // Convert Permissions to CheckedState
  useEffect(() => {
    const initialCheckedState: CheckedState = {};

    // If field.value is available, use it, otherwise use defaultPermissions
    const permissions = Array.isArray(field?.value)
      ? field?.value
      : defaultPermissions;

    permissions.forEach((menu) => {
      initialCheckedState[menu.menuName] = {};

      if (menu.subMenus) {
        menu.subMenus.forEach((subMenu: any) => {
          initialCheckedState[menu.menuName][subMenu.menuName] = {
            create: subMenu.actions.create,
            delete: subMenu.actions.delete,
            edit: subMenu.actions.edit,
            list: subMenu.actions.list,
            read: subMenu.actions.read,
            // Include other actions if needed
          };
        });
      } else if (menu.actions) {
        initialCheckedState[menu.menuName]["_self"] = {
          create: menu.actions.create,
          delete: menu.actions.delete,
          edit: menu.actions.edit,
          list: menu.actions.list,
          read: menu.actions.read,
          // Include other actions if needed
        };
      }
    });

    setCheckedState(initialCheckedState);
    updateIndeterminateState(initialCheckedState);
  }, [field?.value, defaultPermissions]);

  // Update indeterminate state based on checked state
  const updateIndeterminateState = (state: CheckedState) => {
    const newIndeterminateState: Record<string, boolean> = {};

    // For each menu, check if some (but not all) of its submenus or actions are checked
    Object.entries(state).forEach(([menuName, subMenusOrActions]) => {
      if ("_self" in subMenusOrActions) {
        // This is a menu with direct actions, no indeterminate state needed
        newIndeterminateState[menuName] = false;
      } else {
        // This is a menu with submenus
        const subMenus = Object.keys(subMenusOrActions);

        // Check if any submenu has any action checked
        let anyChecked = false;
        let allChecked = true;

        for (const subMenuName of subMenus) {
          const actions = subMenusOrActions[subMenuName];
          const subMenuChecked =
            actions.create ||
            actions.delete ||
            actions.edit ||
            actions.list ||
            actions.read;
          // Include other actions if needed

          if (subMenuChecked) {
            anyChecked = true;
          } else {
            allChecked = false;
          }
        }

        // Set indeterminate state if some but not all submenus are checked
        newIndeterminateState[menuName] = anyChecked && !allChecked;
      }
    });

    setIndeterminateState(newIndeterminateState);
  };

  // Generate permissions array from checked state
  const generatePermissions = (state: CheckedState): Permissions => {
    const permissions: Permissions = [];

    Object.entries(state).forEach(([menuName, subMenusOrActions]) => {
      const menuItem: Menu = { menuName };

      // Check if this menu has submenus or direct actions
      if ("_self" in subMenusOrActions) {
        // This menu has direct actions
        menuItem.actions = {
          create: subMenusOrActions._self.create,
          delete: subMenusOrActions._self.delete,
          edit: subMenusOrActions._self.edit,
          list: subMenusOrActions._self.list,
          read: subMenusOrActions._self.read,
          // Include other actions if needed
        };
      } else {
        // This menu has submenus
        menuItem.subMenus = [];
        Object.entries(subMenusOrActions).forEach(([subMenuName, actions]) => {
          menuItem.subMenus!.push({
            menuName: subMenuName,
            actions: {
              create: actions.create,
              delete: actions.delete,
              edit: actions.edit,
              list: actions.list,
              read: actions.read,
              // Include other actions if needed
            },
          });
        });
      }

      permissions.push(menuItem);
    });

    return permissions;
  };

  // Update form value and call onPermissionsChange
  const updateFormValue = (newCheckedState: CheckedState) => {
    const permissions = generatePermissions(newCheckedState);

    // Update React Hook Form
    if (control && name) {
      field?.onChange(permissions);
    }
    // Call onPermissionsChange callback if provided
    if (onPermissionsChange) {
      onPermissionsChange(permissions);
    }
  };

  // Handle checkbox change for an action
  const handleActionChange = (
    menuName: string,
    subMenuName: string | null,
    action: keyof Action,
    checked: boolean
  ) => {
    setCheckedState((prevState) => {
      const newState = { ...prevState };

      if (!newState[menuName]) {
        newState[menuName] = {};
      }

      const targetSubMenu = subMenuName || "_self";

      if (!newState[menuName][targetSubMenu]) {
        newState[menuName][targetSubMenu] = {
          create: false,
          delete: false,
          edit: false,
          list: false,
          read: false,
          // Include other actions if needed
        };
      }

      newState[menuName][targetSubMenu][action] = checked;

      // Update indeterminate state
      updateIndeterminateState(newState);

      // Update form value
      updateFormValue(newState);

      return newState;
    });
  };

  // Handle "select all" for a submenu
  const handleSelectAllSubMenu = (
    menuName: string,
    subMenuName: string,
    checked: boolean
  ) => {
    setCheckedState((prevState) => {
      const newState = { ...prevState };

      if (!newState[menuName]) {
        newState[menuName] = {};
      }

      newState[menuName][subMenuName] = {
        create: checked,
        delete: checked,
        edit: checked,
        list: checked,
        read: checked,
        // Include other actions if needed
      };

      // Update indeterminate state
      updateIndeterminateState(newState);

      // Update form value
      updateFormValue(newState);

      return newState;
    });
  };

  // Handle "select all" for a menu
  const handleSelectAllMenu = (menuName: string, checked: boolean) => {
    setCheckedState((prevState) => {
      const newState = { ...prevState };

      if (!newState[menuName]) {
        newState[menuName] = {};
      }

      // Find the menu in default permissions
      const menu = defaultPermissions.find((m) => m.menuName === menuName);

      if (menu?.subMenus) {
        // This menu has submenus
        menu.subMenus.forEach((subMenu) => {
          newState[menuName][subMenu.menuName] = {
            create: checked,
            delete: checked,
            edit: checked,
            list: checked,
            read: checked,
            // Include other actions if needed
          };
        });
      } else {
        // This menu has direct actions
        newState[menuName]["_self"] = {
          create: checked,
          delete: checked,
          edit: checked,
          list: checked,
          read: checked,
          // Include other actions if needed
        };
      }

      // Update indeterminate state
      updateIndeterminateState(newState);

      // Update form value
      updateFormValue(newState);

      return newState;
    });
  };

  // Toggle expanded state
  const toggleExpanded = (menuName: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Check if all actions in a submenu are checked
  const isAllSubMenuChecked = (
    menuName: string,
    subMenuName: string
  ): boolean => {
    const subMenu = checkedState[menuName]?.[subMenuName];
    if (!subMenu) return false;

    return (
      subMenu.create &&
      subMenu.delete &&
      subMenu.edit &&
      subMenu.list &&
      subMenu.read
      // Include other actions if needed
    );
  };

  // Check if any actions in a submenu are checked
  const isAnySubMenuActionChecked = (
    menuName: string,
    subMenuName: string
  ): boolean => {
    const subMenu = checkedState[menuName]?.[subMenuName];
    if (!subMenu) return false;

    return (
      subMenu.create ||
      subMenu.delete ||
      subMenu.edit ||
      subMenu.list ||
      subMenu.read
      // Include other actions if needed
    );
  };

  // Check if all submenus in a menu are checked
  const isAllMenuChecked = (menuName: string): boolean => {
    const menu = checkedState[menuName];
    if (!menu) return false;

    // If this menu has direct actions
    if (menu._self) {
      return (
        menu._self.create &&
        menu._self.delete &&
        menu._self.edit &&
        menu._self.list &&
        menu._self.read
        // Include other actions if needed
      );
    }

    // If this menu has submenus
    return Object.keys(menu).every((subMenuName) =>
      isAllSubMenuChecked(menuName, subMenuName)
    );
  };

  // Check if any submenu in a menu has any action checked
  const isAnyMenuActionChecked = (menuName: string): boolean => {
    const menu = checkedState[menuName];
    if (!menu) return false;

    // If this menu has direct actions
    if (menu._self) {
      return (
        menu._self.create ||
        menu._self.delete ||
        menu._self.edit ||
        menu._self.list ||
        menu._self.read
        // Include other actions if needed
      );
    }

    // If this menu has submenus
    return Object.keys(menu).some((subMenuName) =>
      isAnySubMenuActionChecked(menuName, subMenuName)
    );
  };

  // Get icon for menu
  const getMenuIcon = (menuName: string) => {
    switch (menuName.toLowerCase()) {
      case "setting":
        return <UserRoundCog className="h-4 w-4" />;
      default:
        return <Archive className="h-4 w-4" />;
    }
  };

  // Render a menu with submenus
  const renderMenuWithSubMenus = (menu: Menu) => {
    const isExpanded = expandedState[menu.menuName] || false;
    const menuIcon = getMenuIcon(menu.menuName);
    const isChecked = isAllMenuChecked(menu.menuName);
    const isIndeterminate = !isChecked && isAnyMenuActionChecked(menu.menuName);

    return (
      <div key={menu.menuName} className="select-none min-w-[200px]">
        <div className="flex items-center py-2 px-1 rounded-md hover:bg-muted/50 transition-colors">
          <button
            type="button"
            onClick={() => toggleExpanded(menu.menuName)}
            className="mr-1 p-1 rounded-sm hover:bg-muted"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <div className="flex items-center gap-2 flex-1">
            <Checkbox
              id={`menu-${menu.menuName}`}
              checked={isChecked}
              disabled={disabled}
              data-state={
                isIndeterminate
                  ? "indeterminate"
                  : isChecked
                  ? "checked"
                  : "unchecked"
              }
              onCheckedChange={(checked) =>
                handleSelectAllMenu(menu.menuName, checked === true)
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary/50 data-[state=indeterminate]:text-primary-foreground"
            />

            {menuIcon && (
              <span className="text-muted-foreground">{menuIcon}</span>
            )}

            <label
              htmlFor={`menu-${menu.menuName}`}
              className="text-sm font-medium cursor-pointer flex-1 capitalize"
            >
              {menu.menuName.replace(/_/g, " ")}
            </label>

            <Badge variant="outline" className="ml-auto text-xs">
              {menu.subMenus?.length || 0}
            </Badge>
          </div>
        </div>

        {isExpanded && menu.subMenus && (
          <div className="ml-5 pl-2 border-l border-muted">
            {menu.subMenus.map((subMenu) =>
              renderSubMenu(menu.menuName, subMenu)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render a submenu with actions
  const renderSubMenu = (menuName: string, subMenu: SubMenu) => {
    const isChecked = isAllSubMenuChecked(menuName, subMenu.menuName);
    const isIndeterminate =
      !isChecked && isAnySubMenuActionChecked(menuName, subMenu.menuName);

    return (
      <div key={subMenu.menuName} className="pb-3">
        <div className="flex items-center py-2 px-1 rounded-md hover:bg-muted/50 transition-colors">
          <div className="flex items-center pl-6 gap-2 flex-1">
            <Checkbox
              id={`submenu-${menuName}-${subMenu.menuName}`}
              checked={isChecked}
              disabled={disabled}
              data-state={
                isIndeterminate
                  ? "indeterminate"
                  : isChecked
                  ? "checked"
                  : "unchecked"
              }
              onCheckedChange={(checked) =>
                handleSelectAllSubMenu(
                  menuName,
                  subMenu.menuName,
                  checked === true
                )
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary/50 data-[state=indeterminate]:text-primary-foreground"
            />

            <label
              htmlFor={`submenu-${menuName}-${subMenu.menuName}`}
              className="text-sm font-medium cursor-pointer flex-1 capitalize"
            >
              {subMenu.menuName.replace(/_/g, " ")}
            </label>
          </div>
        </div>

        <div className="ml-14 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-1">
          {permission_actions.map((action) => (
            <div key={action as keyof Action} className="flex items-center">
              <Checkbox
                id={`action-${menuName}-${subMenu.menuName}-${action}`}
                disabled={disabled}
                checked={
                  checkedState[menuName]?.[subMenu.menuName]?.[
                    action as keyof Action
                  ] || false
                }
                onCheckedChange={(checked) =>
                  handleActionChange(
                    menuName,
                    subMenu.menuName,
                    action as keyof Action,
                    checked === true
                  )
                }
                className="h-3.5 w-3.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label
                htmlFor={`action-${menuName}-${subMenu.menuName}-${action}`}
                className="ml-2 text-xs font-medium cursor-pointer capitalize"
              >
                {action}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render a menu with direct actions (no submenus)
  const renderMenuWithActions = (menu: Menu) => {
    const menuIcon = getMenuIcon(menu.menuName);
    const isChecked = isAllMenuChecked(menu.menuName);
    const isIndeterminate = !isChecked && isAnyMenuActionChecked(menu.menuName);

    return (
      <div key={menu.menuName} className="select-none">
        <div className="flex items-center py-2 px-1 rounded-md hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 pl-6 flex-1">
            <Checkbox
              id={`menu-${menu.menuName}`}
              checked={isChecked}
              disabled={disabled}
              data-state={
                isIndeterminate
                  ? "indeterminate"
                  : isChecked
                  ? "checked"
                  : "unchecked"
              }
              onCheckedChange={(checked) =>
                handleSelectAllMenu(menu.menuName, checked === true)
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary/50 data-[state=indeterminate]:text-primary-foreground"
            />

            {menuIcon && (
              <span className="text-muted-foreground">{menuIcon}</span>
            )}

            <label
              htmlFor={`menu-${menu.menuName}`}
              className="text-sm font-medium cursor-pointer flex-1 capitalize"
            >
              {menu.menuName.replace(/_/g, " ")}
            </label>
          </div>
        </div>

        <div className="ml-14 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-1">
          {permission_actions.map((action) => (
            <div key={action as keyof Action} className="flex items-center">
              <Checkbox
                id={`action-${menu.menuName}-${action}`}
                disabled={disabled}
                checked={
                  checkedState[menu.menuName]?.["_self"]?.[
                    action as keyof Action
                  ] || false
                }
                onCheckedChange={(checked) =>
                  handleActionChange(
                    menu.menuName,
                    null,
                    action as keyof Action,
                    checked === true
                  )
                }
                className="h-3.5 w-3.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label
                htmlFor={`action-${menu.menuName}-${action}`}
                className="ml-2 text-xs font-medium cursor-pointer capitalize"
              >
                {action}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="permission-tree border rounded-md px-4 pt-2 pb-3 max-h-[300px] overflow-auto bg-card">
      <div className="mb-2 pb-2 border-b">
        <h3 className="font-medium text-sm">Permission Settings</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Configure access permissions for each module
        </p>
      </div>

      {defaultPermissions.map((menu) =>
        menu.subMenus
          ? renderMenuWithSubMenus(menu)
          : renderMenuWithActions(menu)
      )}
    </div>
  );
}
