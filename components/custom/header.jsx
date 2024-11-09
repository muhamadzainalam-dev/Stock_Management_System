"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, label: <a href="/">Home</a> },
    { id: 2, label: <a href="/pages/totalstock">Store Stock</a> },
    { id: 3, label: <a href="/pages/totalinvestment">Total Valuation</a> },
    { id: 4, label: <a href="/pages/lastmonthsales">Last Month Sell</a> },
    {
      id: 5,
      label: (
        <a href="https://forms.gle/5akxy75GAFRS847s7" target="blank">
          Rate This Website
        </a>
      ),
    },
    { id: 6, label: <a href="/pages/auth">Login/Signup</a> },
  ];

  return (
    <div className="h-10 text-white">
      <header className="fixed top-0 left-1 right-0 z-50 flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href={"/"}>
            <div className="flex title-font font-medium items-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-8 h-8 sm:w-10 sm:h-10 text-white p-2 bg-indigo-500 rounded-full"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl">
                MERCHANDISE INVENTORY
              </span>
            </div>
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="p-5 bg-gray-800 rounded-[20px] shadow-x1 lg:w-[300px]"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="block px-4 py-2 text-lg font-medium text-center rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
                      {item.label}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
