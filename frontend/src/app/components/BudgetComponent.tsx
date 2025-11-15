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

  const handleEdit = async (e: React.MouseEventHandler<HTMLButtonElement>) => {
    return;
  };

  const handleDelete = async (
    e: React.MouseEventHandler<HTMLButtonElement>
  ) => {
    return;
  };

  return (
    <div className="container">
      <div className="title">Budgets</div>
      {budgets.map((budget, index) => (
        <div key={budget.id ?? index}>
          <p>{budget.title}</p>
          <p>{budget.description}</p>
          <p>{budget.income}</p>
          <p>{budget.balance}</p>
        </div>
      ))}
      <button type="submit">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
}
