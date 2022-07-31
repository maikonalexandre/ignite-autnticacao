import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
    </>
  );
}
