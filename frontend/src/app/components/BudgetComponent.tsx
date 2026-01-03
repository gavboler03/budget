"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Budget = {
  id: number;
  title: string;
  description: string;
  income: number;
  balance: number;
};

export default function BudgetComponent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Budget | null>(null);
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  });
  if (loading) {
    return <p>Loading budgets...</p>;
  }

  if (!budgets.length) {
    return <p>No budgets yet.</p>;
  }

  const isUnchanged = Boolean(
    editing &&
      budgets.find((b) => b.id === editing.id)?.title === editing.title &&
      budgets.find((b) => b.id === editing.id)?.description ===
        editing.description &&
      budgets.find((b) => b.id === editing.id)?.income === editing.income
  );

  useEffect(() => {
    api
      .get("/budgets")
      .then((response) => {
        setBudgets(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const { data: updatedBudget } = await api.put(
        `/budgets/${editing.id}`,
        editing
      );

      setBudgets((prev) =>
        prev.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
      );

      setEditing(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="container">
      <div className="title">Budgets</div>
      {budgets.map((budget) => (
        <div key={budget.id}>
          <p>{budget.title}</p>
          <p>{budget.description}</p>
          <p>{budget.income}</p>
          <p>{budget.balance}</p>
          <button type="button" onClick={() => setEditing(budget)}>
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(budget.id)}>
            Delete
          </button>
        </div>
      ))}
      {editing && (
        <form onSubmit={handleEdit}>
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />

          <input
            value={editing.description}
            onChange={(e) =>
              setEditing({ ...editing, description: e.target.value })
            }
          />

          <input
            type="number"
            value={editing.income}
            onChange={(e) =>
              setEditing({ ...editing, income: Number(e.target.value) })
            }
          />

          <button type="submit" disabled={isUnchanged}>
            Save
          </button>
          <button type="button" onClick={() => setEditing(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
