interface BudgetProps {
  title: string;
  description?: string;
  income: string;
  balance: string;
}

export default function BudgetComponent({
  title,
  description,
  income,
  balance,
}: BudgetProps) {
  return (
    <div className="container">
      <div>{title}</div>
      <div>{description}</div>
      <div>{income}</div>
      <div>{balance}</div>
    </div>
  );
}
