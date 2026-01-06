import { LineItem } from "./LineItemObject";

export interface Budget {
  id: number;
  title: string;
  description: string;
  income: number;
  balance: number;
  line_item: LineItem[];
}
