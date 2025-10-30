import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

import { DateRangePicker as RsuiteDateRangePicker } from "rsuite";

interface PaymentRow {
  id: string;
  transactionDate: string; // e.g., "2025-09-01 07:58 PM"
  invoiceId: string;
  paymentMethod: string; // e.g., Mastercard **** 1887
  type: string; // e.g., Subscription, Add-on
  plan: string; // e.g., Growth Plan, Scale Plan, Custom Plan
  currency: string; // e.g., USD
  invoiceAmount: number; // numeric amount
  serviceProvider: string; // e.g., Stripe
}

const rows: PaymentRow[] = [
  {
    id: "1",
    transactionDate: "2025-09-01 07:58 PM",
    invoiceId: "INV-2025-091-001",
    paymentMethod: "Mastercard **** 1887",
    type: "Subscription",
    plan: "Growth Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "Stripe",
  },
  {
    id: "2",
    transactionDate: "2025-08-01 08:03 PM",
    invoiceId: "INV-2025-081-002",
    paymentMethod: "Visa **** 4421",
    type: "Subscription",
    plan: "Scale Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "Stripe",
  },
  {
    id: "3",
    transactionDate: "2025-07-15 10:12 AM",
    invoiceId: "INV-2025-071-003",
    paymentMethod: "Amex **** 3012",
    type: "Add-on Credits",
    plan: "Custom Plan",
    currency: "USD",
    invoiceAmount: 120,
    serviceProvider: "Stripe",
  },
  {
    id: "4",
    transactionDate: "2025-06-04 11:00 AM",
    invoiceId: "INV-2025-061-004",
    paymentMethod: "UPI **** 3289",
    type: "Subscription",
    plan: "Growth Plan",
    currency: "INR",
    invoiceAmount: 5499,
    serviceProvider: "Razorpay",
  },
  {
    id: "5",
    transactionDate: "2025-05-02 05:34 PM",
    invoiceId: "INV-2025-051-005",
    paymentMethod: "PayPal john.doe@email.com",
    type: "Subscription",
    plan: "Scale Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "PayPal",
  },
  {
    id: "6",
    transactionDate: "2025-04-17 09:27 AM",
    invoiceId: "INV-2025-041-006",
    paymentMethod: "Visa **** 9301",
    type: "Add-on Credits",
    plan: "Custom Plan",
    currency: "USD",
    invoiceAmount: 220,
    serviceProvider: "Stripe",
  },
  {
    id: "7",
    transactionDate: "2025-03-01 08:01 PM",
    invoiceId: "INV-2025-031-007",
    paymentMethod: "Mastercard **** 1887",
    type: "Subscription",
    plan: "Growth Plan",
    currency: "USD",
    invoiceAmount: 660,
    serviceProvider: "Stripe",
  },
  {
    id: "8",
    transactionDate: "2025-02-14 01:43 PM",
    invoiceId: "INV-2025-021-008",
    paymentMethod: "NetBanking ICICI",
    type: "Add-on Credits",
    plan: "Scale Plan",
    currency: "INR",
    invoiceAmount: 2999,
    serviceProvider: "Razorpay",
  },
];

function downloadInvoice(row: PaymentRow) {
  const lines = [
    "Invoice",
    "------------------------------",
    `Invoice ID: ${row.invoiceId}`,
    `Date: ${row.transactionDate}`,
    `Payment Method: ${row.paymentMethod}`,
    `Type: ${row.type}`,
    `Plan: ${row.plan}`,
    `Currency: ${row.currency}`,
    `Amount: ${row.invoiceAmount}`,
    `Service Provider: ${row.serviceProvider}`,
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${row.invoiceId}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Robust parser for dates like "2025-09-01 07:58 PM"
function parsePaymentDate(input: string): Date | null {
  const m = input.match(
    /(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i,
  );
  if (!m) return null;
  const [_, y, mo, d, hh, mm, ap] = m;
  let hour = parseInt(hh, 10);
  const minute = parseInt(mm, 10);
  if (/pm/i.test(ap) && hour !== 12) hour += 12;
  if (/am/i.test(ap) && hour === 12) hour = 0;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d), hour, minute, 0);
  if (isNaN(dt.getTime())) return null;
  return dt;
}

type SortField =
  | "transactionDate"
  | "invoiceId"
  | "paymentMethod"
  | "type"
  | "plan"
  | "currency"
  | "invoiceAmount"
  | "serviceProvider";

type SortDir = "asc" | "desc";

export default function Payments() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("transactionDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const uniqueTypes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.type))).sort(),
    [],
  );

  const uniquePlans = useMemo(
    () => Array.from(new Set(rows.map((r) => r.plan))).sort(),
    [],
  );

  const [dateRange, setDateRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >();
  const [pickerValue, setPickerValue] = useState<[Date, Date] | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = q
        ? [r.invoiceId, r.paymentMethod, r.type, r.plan, r.serviceProvider]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;

      const matchesType = typeFilter === "all" ? true : r.type === typeFilter;
      const matchesPlan = planFilter === "all" ? true : r.plan === planFilter;

      let inRange = true;
      if (dateRange?.from && dateRange?.to) {
        const dt = parsePaymentDate(r.transactionDate);
        if (!dt) return false;
        const t = dt.getTime();
        inRange = t >= dateRange.from.getTime() && t <= dateRange.to.getTime();
      }

      return matchesQuery && matchesType && matchesPlan && inRange;
    });
  }, [query, typeFilter, planFilter, dateRange]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      const getVal = (r: PaymentRow) => {
        switch (sortField) {
          case "transactionDate": {
            const da = parsePaymentDate(r.transactionDate)?.getTime() ?? 0;
            return da;
          }
          case "invoiceAmount":
            return r.invoiceAmount;
          case "invoiceId":
            return r.invoiceId.toLowerCase();
          case "paymentMethod":
            return r.paymentMethod.toLowerCase();
          case "type":
            return r.type.toLowerCase();
          case "plan":
            return r.plan.toLowerCase();
          case "currency":
            return r.currency.toLowerCase();
          case "serviceProvider":
            return r.serviceProvider.toLowerCase();
        }
      };
      const va = getVal(a);
      const vb = getVal(b);

      if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else {
        const sa = String(va);
        const sb = String(vb);
        cmp = sa.localeCompare(sb);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setPlanFilter("all");
    setDateRange(undefined);
    setPickerValue(null);
  };

  const HeaderSort = ({
    label,
    field,
    alignRight,
  }: {
    label: string;
    field: SortField;
    alignRight?: boolean;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="group flex items-center justify-between gap-2 text-left hover:text-valasys-orange w-full h-full px-4 py-2 cursor-pointer"
    >
      <span>{label}</span>
      <div className="flex-shrink-0">
        {sortField === field ? (
          sortDir === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5 text-valasys-orange" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-valasys-orange" />
          )
        ) : (
          <span className="opacity-40 group-hover:opacity-70">↕</span>
        )}
      </div>
    </button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-valasys-gray-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-valasys-orange" /> Payments
            </h1>
            <p className="text-sm text-valasys-gray-600">
              Search, filter and download your invoices.
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Filter className="w-5 h-5 mr-2 text-valasys-orange" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search invoices, methods, provider..."
                    className="pl-10"
                    aria-label="Search payments"
                  />
                </div>
              </div>
              <div className="w-full flex-1">
                <RsuiteDateRangePicker
                  value={pickerValue as any}
                  onChange={(val) => setPickerValue(val as any)}
                  onOk={(val) => {
                    setPickerValue(val as any);
                    if (val && Array.isArray(val)) {
                      setDateRange({ from: val[0], to: val[1] });
                    }
                  }}
                  onClean={() => {
                    setPickerValue(null);
                    setDateRange(undefined);
                  }}
                  placeholder="MM/DD/YYYY - MM/DD/YYYY"
                  format="MM/dd/yyyy"
                  character=" - "
                  placement="leftStart"
                  showOneCalendar={false}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="w-full flex-1">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex-1">
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Plans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {uniquePlans.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={resetFilters}
                title="Reset filters"
                aria-label="Reset filters"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-valasys-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[180px]">
                      <HeaderSort
                        label="Transaction Date"
                        field="transactionDate"
                      />
                    </TableHead>
                    <TableHead className="min-w-[160px]">
                      <HeaderSort label="Invoice ID" field="invoiceId" />
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      <HeaderSort
                        label="Payment Method"
                        field="paymentMethod"
                      />
                    </TableHead>
                    <TableHead className="min-w-[140px]">
                      <HeaderSort label="Type" field="type" />
                    </TableHead>
                    <TableHead className="min-w-[140px]">
                      <HeaderSort label="Plan" field="plan" />
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <HeaderSort label="Currency" field="currency" />
                    </TableHead>
                    <TableHead className="text-right min-w-[150px]">
                      <HeaderSort
                        label="Invoice Amount"
                        field="invoiceAmount"
                        alignRight
                      />
                    </TableHead>
                    <TableHead className="min-w-[160px]">
                      <HeaderSort
                        label="Service Provider"
                        field="serviceProvider"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-sm text-gray-700">
                        {row.transactionDate}
                      </TableCell>
                      <TableCell className="font-mono text-sm flex items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1 text-valasys-orange hover:underline"
                          onClick={() => downloadInvoice(row)}
                          aria-label={`Download invoice ${row.invoiceId}`}
                        >
                          {row.invoiceId}
                          <Download className="w-4 h-4" />
                        </button>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {row.paymentMethod}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {row.type}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {row.plan}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {row.currency}
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-900">
                        {row.currency === "USD"
                          ? `$${row.invoiceAmount.toLocaleString()}`
                          : `${row.invoiceAmount.toLocaleString()} ${row.currency}`}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {row.serviceProvider}
                      </TableCell>
                    </TableRow>
                  ))}
                  {sorted.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-sm text-gray-500"
                      >
                        No transactions match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
