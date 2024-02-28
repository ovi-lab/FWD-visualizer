import Link from "next/link";
export default function SideBar() {
  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-40 w-52 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white font-extrabold"><h1>Haru Chat Visualizer</h1></li>
          <li>
            <a
              href="/dashboard"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
              <span className="ms-3">Home</span>
            </a>
          </li>
          <li>
            <Link
              href="/dashboard/chat"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Chat View</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/diagrams/arc"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Arc Diagram</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/diagrams/sankey"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Sankey Diagram</span>
            </Link>
          </li>
          {/* <li>
            <Link
              href="/dashboard/diagrams/tree"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Tree View</span>
            </Link>
          </li> */}
          <li className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700"></li>
          <li>
            <Link
              href="/dashboard/upload"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Upload JSON</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
