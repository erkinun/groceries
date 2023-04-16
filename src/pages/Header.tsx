// TODO we need to somehow feed this into react router dom at some point
export function Header() {
  return (
    <nav className="min-w-min m-0 flex flex-col bg-primary text-secondary shadow-lg">
      <ul>
        <NavLink to="/" text="Home" />
        <NavLink to="/dashboard" text="Dashboard" />
        <NavLink to="/profile" text="Profile" />
        <NavLink to="/share" text="Share" />
      </ul>
    </nav>
  );
}

const NavLink = ({ to, text }: { to: string; text: string }) => {
  return (
    <li className="nav-link">
      <a href={to}>{text}</a>
    </li>
  );
};
