// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import SolcaeLogo from "../assets/solace-logo.svg";
// import avatar from "../assets/Avatar_img.avif";
// import "./Layout.css";

// const Layout = ({ children }) => {
//   const location = useLocation();
//   const { user, logout } = useAuth();
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const showSearchPages = ["/dashboard"];

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   const isActive = (path) => location.pathname === path;

//   const navItems = [
//     { to: "/dashboard",   icon: "bi-speedometer2", label: "Dashboard"  },
//     { to: "/agents",      icon: "bi-person",        label: "Agents"     },
//     // { to: "/inspectors",  icon: "bi-person-badge",  label: "Inspectors" },
//     // { to: "/properties",  icon: "bi-building",      label: "Properties" },
//     // { to: "/inspections", icon: "bi-people",        label: "Inspections"},
//     // { to: "/reports",     icon: "bi-file-text",     label: "Reports"    },
//     // { to: "/audit-logs",  icon: "bi-calendar2-check",label: "Audit Logs"},
//     // { to: "/settings",    icon: "bi-gear",          label: "Settings"   },
//   ];

//   return (
//     <div className="layout-wrapper">
//       <aside className="sidebar">
//         {/* Logo */}
//         <div className="sidebar-logo">
//           <img src={SolcaeLogo} alt="Solcae" />
//           <span className="sidebar-brand">Alphagnito</span>
//         </div>

//         {/* Nav — flat list, no section labels */}
//         <nav className="sidebar-nav">
//           {navItems.map(({ to, icon, label }) => (
//             <Link
//               key={to}
//               to={to}
//               className={isActive(to) ? "nav-item active" : "nav-item"}
//             >
//               <i className={`bi ${icon}`}></i>
//               {label}
//             </Link>
//           ))}
//         </nav>
//       </aside>

//       <div className="main-content">
//         <header className="topbar">
//           {showSearchPages.includes(location.pathname) && (
//             <div className="search-container">
//               <input
//                 type="text"
//                 className="top-search"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <i className="bi bi-search search-icon"></i>
//             </div>
//           )}
//           <div className="topbar-right">
//             <button className="btn btn-link text-secondary me-3">
//               <i className="bi bi-bell"></i>
//             </button>
//             <div className="user-info">
//               <img src={avatar} alt="profile" className="user-avatar" />
//               <span className="user-name">{user?.email || "User"}</span>
//             </div>
//             <button
//               className="btn btn-outline-secondary btn-sm ms-3"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         <div className="page-content">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default Layout;



import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SolcaeLogo from "../assets/solace-logo.svg";
import avatar from "../assets/Avatar_img.avif";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const showSearchPages = ["/dashboard"];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/agents",    icon: "bi-people",        label: "Agents"    },
    // { to: "/inspectors",  icon: "bi-person-badge",  label: "Inspectors" },
    // { to: "/properties",  icon: "bi-building",      label: "Properties" },
    // { to: "/inspections", icon: "bi-people",        label: "Inspections"},
    // { to: "/reports",     icon: "bi-file-text",     label: "Reports"    },
    // { to: "/audit-logs",  icon: "bi-calendar2-check",label: "Audit Logs"},
    // { to: "/settings",    icon: "bi-gear",          label: "Settings"   },
  ];

  return (
    <div className="layout-wrapper">

      {/* ── Sidebar / Mobile Bottom Tab Bar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={SolcaeLogo} alt="Solcae" />
          <span className="sidebar-brand">Alphagnito</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? "nav-item active" : "nav-item"}
            >
              <i className={`bi ${icon}`}></i>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">
        <header className="topbar">
          {showSearchPages.includes(location.pathname) && (
            <div className="search-container">
              <input
                type="text"
                className="top-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search search-icon"></i>
            </div>
          )}
          <div className="topbar-right">
            <button className="btn btn-link text-secondary">
              <i className="bi bi-bell"></i>
            </button>
            <div className="user-info">
              <img src={avatar} alt="profile" className="user-avatar" />
              <span className="user-name">{user?.email || "User"}</span>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm ms-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </div>

    </div>
  );
};

export default Layout;