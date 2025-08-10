import ClientSideDisplay from "./ClientSideDisplay";
// import ProtectedRoute from "./components/ProtectedRoute";
type HelloResponse = {
  message: string;
};

export default async function Page() {
  const res = await fetch("http://127.0.0.1:8000/", {
    cache: "no-store",
  });
  const data: HelloResponse = await res.json();

  return <ClientSideDisplay initialMessage={data.message} />;
}
