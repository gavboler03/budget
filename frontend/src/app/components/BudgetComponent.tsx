"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const [budgets, setBudgets] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

export default function BudgetComponent() {
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/budgets")
      .then((response) => {
        setBudgets(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="title">Budgets</div>
      {budgets.map((budget) => (
        <p>{budget}</p>
      ))}
    </div>
  );
}
