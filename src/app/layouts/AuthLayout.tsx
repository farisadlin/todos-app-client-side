import { Toaster } from "react-hot-toast";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center max-md:mx-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      {children}
    </main>
  );
};

export default AuthLayout;
