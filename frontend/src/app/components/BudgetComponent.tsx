"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function BudgetComponent() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("http://localhost:8000/budgets")
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
        <p key={budget.id}>{budget.description}</p>
      ))}
    </div>
  );
}
