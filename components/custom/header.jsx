"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <header className="text-gray-400 bg-black body-font">
        <div className="container mx-auto flex flex-wrap p-3 items-center justify-between lg:p-5 lg:flex-row ">
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

            <FontAwesomeIcon
              icon={faBars}
              className="text-white cursor-pointer text-xl ml-4 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

          <nav
            className={`flex flex-row ml:flex-row items-center text-base justify-center ${
              menuOpen ? "block" : "hidden"
            } lg:flex`}
          >
            <Link href={"https://docs.google.com/forms/d/e/1FAIpQLScbLh4PXTTEgEfJUs4OBj4_0cU7yMhy0gSanWSolUIfqrF-dg/viewform?usp=sf_link"} target="blank">
              <button className="inline-flex items-center bg-gray-800 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded text-sm sm:text-base mt-2 md:mt-0 mr-3">
                Rate This Website
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </Link>
            <Link href={"/pages/totalstock"}>
              <button className="inline-flex items-center bg-gray-800 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded text-sm sm:text-base mt-2 md:mt-0">
                Store Stock
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </Link>
            <Link href={"/pages/totalinvestment"}>
              <button className="inline-flex items-center bg-gray-800 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded text-sm sm:text-base mt-2 md:mt-0 ml-2">
                Total Valuation
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </Link>
            <Link href={"/pages/lastmonthsales"}>
              <button className="inline-flex items-center bg-gray-800 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded text-sm sm:text-base mt-2 md:mt-0 ml-2">
                Last Month Sell
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </Link>
          </nav>
        </div>
      </header>
      <hr />
    </div>
  );
}

export default Header;
