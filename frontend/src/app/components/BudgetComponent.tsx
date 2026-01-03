"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function BudgetComponent() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

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

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editing) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/budgets/budget/${editing.id}`,

        editing
      );

      setBudgets((prev) =>
        prev.map((b) => (b.id === editing.id ? response.data : b))
      );

      setEditing(null);
    } catch (error) {
      console.error("Error updating budget:", error);
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
      {budgets.map((budget, index) => (
        <div key={budget.id ?? index}>
          <p>{budget.title}</p>
          <p>{budget.description}</p>
          <p>{budget.income}</p>
          <p>{budget.balance}</p>
          <button type="submit" onClick={() => setEditing(budget)}>
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

          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}
