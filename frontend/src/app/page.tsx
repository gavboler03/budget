import ClientSideDisplay from "./ClientSideDisplay";
import ProtectedRoute from "./components/ProtectedRoute";

type HelloResponse = {
  message: string;
};

export default async function Page() {
  const res = await fetch("http://localhost:8000/", {
    cache: "no-store",
  });
  const data: HelloResponse = await res.json();

  return (
    <ProtectedRoute>
      <ClientSideDisplay initialMessage={data.message} />
    </ProtectedRoute>
  );
}
