import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function Transactions() {
  const { toast } = useToast();

  const transactions = [
    {
      id: "INV001",
      title: "Transaction 1",
      payer: "John Doe",
      payee: "Jane Doe",
      amount: "$1500",
      date: "12/01/2023",
      dueDate: "13/01/2023",
      status: "Pending",
    },
    {
      id: "INV002",
      title: "Transaction 2",
      payer: "Mike Smith",
      payee: "Emma Jones",
      amount: "$1200",
      date: "10/01/2023",
      dueDate: "11/01/2023",
      status: "Processed",
    },
    {
      id: "INV003",
      title: "Transaction 3",
      payer: "Martin Johnson",
      payee: "Sophie Lee",
      amount: "$2000",
      date: "08/01/2023",
      dueDate: "09/01/2023",
      status: "Failed",
    },
    {
      id: "INV004",
      title: "Transaction 4",
      payer: "Robert Brown",
      payee: "Stella Davis",
      amount: "$500",
      date: "06/01/2023",
      dueDate: "07/01/2023",
      status: "Pending",
    },
  ];

  if (transactions.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No transactions</AlertTitle>
        <AlertDescription>
          There are currently no transactions to display.
        </AlertDescription>
      </Alert>
    );
  }

  const settleTransaction = (id: string) => {
    toast({
      title: `settle transaction ${id}`,
    });
  };

  return (
    <Table className="text-white">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox id="checkbox-select-all" className="dark:bg-black" />
          </TableHead>
          <TableHead>Invoice Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Payer</TableHead>
          <TableHead>Payee</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => {
          const { id, title, payer, payee, amount, date, dueDate, status } =
            transaction;

          return (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  id={"checkbox-select-" + id}
                  className="dark:bg-black"
                />
              </TableCell>
              <TableCell>{id}</TableCell>
              <TableCell>{title}</TableCell>
              <TableCell>{payer}</TableCell>
              <TableCell>{payee}</TableCell>
              <TableCell>{amount}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{dueDate}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>
                <Button onClick={() => settleTransaction(id)}>Settle</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default Transactions;
