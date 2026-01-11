"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineItem } from "../objects/LineItemObject";

interface Props {
  lineItemObject: LineItem;
}

export default function LineItemComponent({ lineItemObject }: Props) {
  const [lineItem, setLineItem] = useState<LineItem | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  });

  useEffect(() => {
    api.get(``);
  });

  return <div>LineItemComponent</div>;
}
