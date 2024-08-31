import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center max-md:mx-4">
      <Header title="TODOS APP WITH NODE.JS" />
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      {children}
    </main>
  );
};

export default AuthLayout;
