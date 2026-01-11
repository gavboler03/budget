"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineItem } from "../objects/LineItemObject";
import { Budget } from "../objects/BudgetObject";

interface Props {
  budgetObject: Budget;
  lineItemObject: LineItem;
}

export default function LineItemComponent({
  budgetObject,
  lineItemObject,
}: Props) {
  const [lineItem, setLineItem] = useState<LineItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const { id } = budgetObject;
  const { item_id, title, amount } = lineItemObject;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  });

  useEffect(() => {
    api
      .get(`/budgets/budget/${id}/line-items/${item_id}`)
      .then((response) => {
        setLineItem(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Cannot fetch line items");
      })
      .finally(() => setLoading(false));
  });

  if (loading) {
    return <p>Loading budgets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <div>LineItemComponent</div>;
}
