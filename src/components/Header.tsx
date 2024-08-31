interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <h1 className="text-4xl font-bold text-center mb-10 bg-blue-500 text-white max-md:p-2 p-6 rounded-lg max-md:text-2xl">
    {title}
  </h1>
);

export default Header;
