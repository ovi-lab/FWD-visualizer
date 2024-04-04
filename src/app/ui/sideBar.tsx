import Link from "next/link";
import { SelectionForm } from "./dataSourceSelect/selectionForm";

interface NavItemProps {
  href: string;
  title: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, title }) => (
  <li>
    <Link
      href={href}
      className="flex items-center p-2 rounded-lg text-white text-[1rem] hover:bg-gray-700 group"
    >
      <span className="ms-3">{title}</span>
    </Link>
  </li>
);

export default function SideBar() {
  return (
    <aside
      id="sidebar"
      className="top-0 left-0 z-40 h-screen "
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li className="flex items-center p-2 rounded-lg text-white font-extrabold">
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
            <h1 className="h3, ml-5">Haru Chat Visualizer</h1>
          </li>
          <NavItem href="/dashboard/chat" title="Chat View" />
          <NavItem href="/dashboard/diagrams/arc" title="Arc Diagram" />
          <NavItem href="/dashboard/diagrams/sankey" title="Sankey Diagram" />
          <NavItem href="/dashboard/diagrams/ToF" title="Tiers of Friendship" />
          <li className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700"></li>
          <SelectionForm/>
        </ul>
      </div>
    </aside>
  );
}
