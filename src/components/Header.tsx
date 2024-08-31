interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <h1 className="text-4xl font-bold text-center mb-10 bg-blue-500 text-white p-6 rounded-lg">
    {title}
  </h1>
);

export default Header;
