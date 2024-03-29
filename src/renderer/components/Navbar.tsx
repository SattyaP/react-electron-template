import { useEffect, useState } from 'react';

export default function Navbar() {
  // TODO: Handle status online
  const [isOnline, setIsOnline] = useState(true);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <a
                href="#"
                className="text-xl font-bold flex items-center lg:ml-2.5"
              >
                <img
                  src="https://demo.themesberg.com/windster/images/logo.svg"
                  className="h-6 mr-2"
                  alt="Risets Logo"
                ></img>
                <span className="self-center whitespace-nowrap">RisetApps</span>
              </a>
            </div>
            <div className="flex items-center">
              <a
                href="#"
                className="hidden sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3"
              >
                <svg
                  className="svg-inline--fa fa-gem -ml-1 mr-2 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.5em"
                  height="0.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    id="icon-status"
                    fill={isOnline ? 'green' : 'red'}
                    d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21"
                  />
                </svg>
                <span id="status-online">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
    </>
  );
}
