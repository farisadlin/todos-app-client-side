interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <h1 className="text-4xl font-bold text-center text-white rounded-lg max-md:text-2xl">
    {title}
  </h1>
);

export default Header;
