import dynamic from "next/dynamic";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

const DynamicHomeContent = dynamic(() => import("@/components/HomeContent"), {
  loading: () => <Spinner />,
});

export default function Home() {
  return (
    <main className="min-h-[80vh]">
      <Suspense fallback={<Spinner />}>
        <DynamicHomeContent />
      </Suspense>
    </main>
  );
}
