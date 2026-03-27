/**
 * UserSwitcher component
 * Shows current user in title bar with dropdown to switch users
 */

import * as React from "react";
import {
  Stethoscope,
  DollarSign,
  Briefcase,
  Shield,
  ChevronDown,
  Check,
  Settings,
} from "lucide-react";
import {
  useUserProfileStore,
  type UserRole,
} from "../stores/user-profile-store";

interface UserSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserSwitcher = React.forwardRef<HTMLDivElement, UserSwitcherProps>(
  ({ className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const { users, currentUserId, switchUser, getCurrentUser } =
      useUserProfileStore();
    const currentUser = getCurrentUser();

    const handleUserClick = (userId: string) => {
      switchUser(userId);
      setIsOpen(false);
    };

    const handleManageUsers = () => {
      console.log("Manage Users clicked");
      setIsOpen(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = () => {
        if (isOpen) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }
    }, [isOpen]);

    if (!currentUser) {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
        {...props}
      >
        {/* Trigger button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            height: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 8px",
            border: "none",
            borderRadius: 3,
            background: isOpen
              ? "#e5e5e5"
              : isHovered
                ? "#e5e5e5"
                : "transparent",
            cursor: "pointer",
            fontSize: 12,
            color: "#333",
            transition: "background .1s",
          }}
        >
          <RoleIcon role={currentUser.role} size={12} />
          <span>{currentUser.name}</span>
          <ChevronDown
            className="w-[10px] h-[10px]"
            style={{
              color: "#555",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .15s",
            }}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              width: 240,
              background: "#ffffff",
              border: "1px solid #d1d1d1",
              boxShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
              borderRadius: 6,
              overflow: "hidden",
              fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
              zIndex: 30,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #ebebeb",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#919191",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontWeight: 600,
                }}
              >
                Switch User
              </span>
            </div>

            {/* User list */}
            <div style={{ padding: "4px 0" }}>
              {users.map((user) => (
                <UserMenuItem
                  key={user.id}
                  name={user.name}
                  role={user.role}
                  isActive={user.id === currentUserId}
                  onClick={() => handleUserClick(user.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: "1px solid #ebebeb",
                padding: "4px 0",
              }}
            >
              <ManageUsersItem onClick={handleManageUsers} />
            </div>
          </div>
        )}
      </div>
    );
  },
);
UserSwitcher.displayName = "UserSwitcher";

// User menu item component
interface UserMenuItemProps {
  name: string;
  role: UserRole;
  isActive: boolean;
  onClick: () => void;
}

const UserMenuItem = React.forwardRef<HTMLDivElement, UserMenuItemProps>(
  ({ name, role, isActive, onClick }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 12px",
          cursor: "pointer",
          background: isHovered ? "#f0f0f0" : "transparent",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RoleIcon role={role} size={14} />
        </div>
        <span
          style={{
            flex: 1,
            fontSize: 12,
            color: "#1a1a1a",
            fontWeight: isActive ? 500 : 400,
          }}
        >
          {name}
        </span>
        <RoleBadge role={role} />
        {isActive && (
          <Check
            className="w-[14px] h-[14px]"
            style={{ color: "#0078d4", flexShrink: 0 }}
          />
        )}
      </div>
    );
  },
);
UserMenuItem.displayName = "UserMenuItem";

// Manage users menu item
interface ManageUsersItemProps {
  onClick: () => void;
}

const ManageUsersItem = React.forwardRef<HTMLDivElement, ManageUsersItemProps>(
  ({ onClick }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 12px",
          cursor: "pointer",
          background: isHovered ? "#f0f0f0" : "transparent",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Settings
            style={{
              width: 14,
              height: 14,
              color: "#616161",
            }}
          />
        </div>
        <span
          style={{
            flex: 1,
            fontSize: 12,
            color: "#1a1a1a",
          }}
        >
          Manage Users
        </span>
      </div>
    );
  },
);
ManageUsersItem.displayName = "ManageUsersItem";

// Role icon component
interface RoleIconProps {
  role: UserRole;
  size?: number;
}

function RoleIcon({ role, size = 14 }: RoleIconProps) {
  const iconStyle = {
    width: size,
    height: size,
    color: getRoleColor(role),
  };

  switch (role) {
    case "pharmacist":
      return <Stethoscope style={iconStyle} />;
    case "cashier":
      return <DollarSign style={iconStyle} />;
    case "manager":
      return <Briefcase style={iconStyle} />;
    case "admin":
      return <Shield style={iconStyle} />;
    default:
      return null;
  }
}

// Role badge component
interface RoleBadgeProps {
  role: UserRole;
}

function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      style={{
        fontSize: 10,
        color: getRoleColor(role),
        background: getRoleBackgroundColor(role),
        padding: "2px 6px",
        borderRadius: 3,
        fontWeight: 500,
        textTransform: "capitalize",
      }}
    >
      {role}
    </span>
  );
}

// Helper functions
function getRoleColor(role: UserRole): string {
  switch (role) {
    case "pharmacist":
      return "#0078d4";
    case "cashier":
      return "#107c10";
    case "manager":
      return "#8764b8";
    case "admin":
      return "#d13438";
    default:
      return "#616161";
  }
}

function getRoleBackgroundColor(role: UserRole): string {
  switch (role) {
    case "pharmacist":
      return "#e6f2fa";
    case "cashier":
      return "#e6f4e6";
    case "manager":
      return "#f3eef8";
    case "admin":
      return "#fde7e9";
    default:
      return "#f0f0f0";
  }
}

export { UserSwitcher };
