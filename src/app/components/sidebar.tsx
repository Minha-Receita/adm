"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BarChart2, Package, Album, MapPin, Grid, ChevronDown, ChevronUp } from "lucide-react";

const menuItems = [
  { 
    icon: Users, 
    name: "Users", 
    subMenu: [
      { label: "User List", path: "/users/list" },
      { label: "User Roles", path: "/users/roles" }
    ]
  },
  { 
    icon: BarChart2, 
    name: "Analytics", 
    subMenu: [
      { label: "Usage Analytics", path: "/analytics/usage" },
      { label: "Overall Analytics", path: "/analytics/overall" }
    ]
  },
  { 
    icon: Package, 
    name: "Receitas", 
    subMenu: [
      { label: "Criar uma receita", path: "/receitas/criar/0" },
      { label: "Listar receitas", path: "/receitas/listar" }
    ]
  },
  { 
    icon: Album, 
    name: "Sessões", 
    subMenu: [
      { label: "listar", path: "/collections/new-releases" },
      { label: "criar", path: "/collections/top-charts" }
    ]
  },
  { 
    icon: MapPin, 
    name: "Locations", 
    subMenu: [
      { label: "Nearby Places", path: "/locations/nearby" },
      { label: "Saved Locations", path: "/locations/saved" }
    ]
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      {/* Menu principal */}
      {menuItems.map((item, index) => (
        <div key={index} className="mb-2">
          {/* Item principal */}
          <div 
            className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-gray-700 transition"
            onClick={() => toggleMenu(item.name)}
          >
            <div className="flex items-center space-x-2">
              <item.icon size={20} />
              <span>{item.name}</span>
            </div>
            {openMenu === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Submenu com transição suave */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenu === item.name ? "max-h-[200px]" : "max-h-0"}`}>
            <div className="ml-6 mt-2 space-y-1">
              {item.subMenu.map((subItem, subIndex) => (
                <div 
                  key={subIndex} 
                  className="p-2 text-sm rounded hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => handleNavigation(subItem.path)}
                >
                  {subItem.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Ícone de configurações no final */}
      <div className="absolute bottom-4 left-4">
        <Grid size={24} className="hover:text-gray-400 cursor-pointer" />
      </div>
    </div>
  );
}
