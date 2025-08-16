interface BudgetProps {
  title: string;
  description?: string;
  income: string;
  balance: string;
  currency: string;
  locale: string;
}

function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
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
    </div>
  );
}
