"use client";

import { Budget } from "../objects/BudgetObject";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  budgetObject: Budget;
}

export default function BudgetComponent({ budgetObject }: Props) {
  const { id, title, description, income, balance } = budgetObject;
  const [budget, setBudget] = useState<Budget | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  });

  useEffect(() => {
    api
      .get(`/budgets/budget/${id}`)
      .then((response) => {
        setBudget(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Cannot fetch item", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!budget) return;

    try {
      const response = await api.put(`/budgets/budget/${id}`, {
        title: budget.title,
        description: budget.description,
        income: budget.income,
      });

      setBudget(response.data);

      setEditing(false);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`http://localhost:8000/budgets/budget/${id}`);
      setBudget(null);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="container">
      {editing === true ? (
        <div key={id}>
          <p>{title}</p>
          <p>{description}</p>
          <p>{income}</p>
          <p>{balance}</p>
          {!editing && (
            <div>
              (
              <button type="button" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button type="button" onClick={() => handleDelete()}>
                Delete
              </button>
              )
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleEdit}>
          <input
            value={budget?.title ?? ""}
            placeholder="Title"
            onChange={(e) =>
              setBudget((prev) =>
                prev ? { ...prev, title: e.target.value } : prev
              )
            }
          />

          <input
            value={budget?.description ?? ""}
            placeholder="Description"
            onChange={(e) =>
              setBudget((prev) =>
                prev ? { ...prev, description: e.target.value } : prev
              )
            }
          />

          <input
            type="number"
            value={budget?.income ?? ""}
            placeholder="Income"
            onChange={(e) =>
              setBudget((prev) =>
                prev ? { ...prev, income: Number(e.target.value) } : prev
              )
            }
          />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
