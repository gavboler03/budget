"use client";

import { Budget } from "../objects/BudgetObject";
import { LineItem } from "../objects/LineItemObject";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  budgetObject: Budget;
  lineItemObject: LineItem;
}

export default function BudgetComponent({
  budgetObject,
  lineItemObject,
}: Props) {
  const { id, title, description, income, balance } = budgetObject;
  const { item_id, item_title, amount } = lineItemObject;
  const [budget, setBudget] = useState<Budget | null>(null);
  const [lineItem, setLineItem] = useState<LineItem | null>(null);
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

  useEffect(() => {
    api
      .get(`/budgets/budget/${id}/line_item/${item_id}`)
      .then((response) => {
        setLineItem(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Cannot fetch item", error);
      })
      .finally(() => setLoading(false));
  });

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!budget) return;

    try {
      const response = await api.put(`/budgets/budget/${id}`, {
        title: budget.title,
        description: budget?.description,
        income: budget?.income,
      });

      const response_2 = await api.put(
        `/budgets/budget/${id}/line-item/${item_id}`,
        {
          item_title: lineItem?.item_title,
          amount: lineItem?.amount,
        },
      );

      setBudget(response.data);
      setLineItem(response_2.data);

      setEditing(false);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDeleteBudget = async () => {
    try {
      await api.delete(`/budgets/budget/${id}`);
      setBudget(null);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleDeleteLineItem = async () => {
    try {
      await api.delete(`/budgets/budget/${id}/line-item/${item_id}`);
      setLineItem(null);
    } catch (error) {
      console.error("Error deleting line item:", error);
    }
  };

  return (
    <div className="container">
      {editing === false ? (
        <div key={id}>
          <p>{title}</p>
          <p>{description}</p>
          <p>{income}</p>
          <p>{balance}</p>
          <div className="line-items">
            <p>{item_title}</p>
            <p>{amount}</p>
          </div>
          {!editing && (
            <div>
              (
              <button type="button" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button type="button" onClick={() => handleDeleteBudget()}>
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
                prev ? { ...prev, title: e.target.value } : prev,
              )
            }
          />

          <input
            value={budget?.description ?? ""}
            placeholder="Description"
            onChange={(e) =>
              setBudget((prev) =>
                prev ? { ...prev, description: e.target.value } : prev,
              )
            }
          />

          <input
            type="number"
            value={budget?.income ?? ""}
            placeholder="Income"
            onChange={(e) =>
              setBudget((prev) =>
                prev ? { ...prev, income: Number(e.target.value) } : prev,
              )
            }
          />

          <div className="line-items"></div>

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
