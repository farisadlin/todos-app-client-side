interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <h1 className="text-4xl font-bold text-center mb-10">{title}</h1>
);

export default Header;
