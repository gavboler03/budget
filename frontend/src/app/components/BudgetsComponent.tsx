"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Budget } from "../objects/BudgetObject";
import BudgetComponent from "./BudgetComponent";

export const BudgetsListComponent = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  });

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/budgets")
      .then((response) => {
        setBudgets(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Cannot fetch budgets.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading budgets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (budgets.length === 0) {
    return <p>No budgets found.</p>;
  }

  return (
    <div className="container">
      {budgets.map((budget) => (
        <BudgetComponent
          key={budget.id}
          budgetObject={budget}
        ></BudgetComponent>
      ))}
    </div>
  );
};
