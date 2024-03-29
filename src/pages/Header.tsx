// TODO we need to somehow feed this into react router dom at some point

import classNames from 'classnames';

export function Header({
  onThemeChange,
  theme,
}: {
  onThemeChange: () => void;
  theme: string;
}) {
  const switcher = `${theme === 'base' ? 'fa-moon' : 'fa-sun'} fa-regular`;
  return (
    <nav className="sticky top-0 left-0 w-12 h-screen md:min-w-min m-0 flex flex-col bg-sec-background text-white shadow-lg">
      <ul>
        <NavLink to="/" text="Home" icon="fa-solid fa-house-user" />
        <NavLink
          to="/dashboard"
          text="Dashboard"
          icon="fa-solid fa-table-list"
        />
        <NavLink
          to="/templates"
          text="Templates"
          icon="fa-regular fa-floppy-disk"
        />
        <NavLink to="/collections" text="Collections" icon="fa-solid fa-tags" />
        <NavLink to="/profile" text="Profile" icon="fa-user" />
        <NavLink to="/share" text="Share" icon="fa-solid fa-share" />
        <NavLink
          key={theme}
          onClick={() => onThemeChange()}
          text="Dark Mode"
          icon={switcher}
        />
        <NavLink
          to="/logout"
          text="Log out"
          icon="fa-solid fa-arrow-right-from-bracket"
        />
      </ul>
    </nav>
  );
}

const NavLink = ({
  to,
  text,
  icon,
  onClick,
}: {
  to?: string;
  text: string;
  icon: string;
  onClick?: () => void;
}) => {
  return (
    <li className="nav-link" onClick={onClick}>
      <a href={to} className="flex items-center gap-2">
        <i className={classNames('fa-regular', icon)}></i>
        <span className="hidden md:block">{text}</span>
      </a>
    </li>
  );
};
