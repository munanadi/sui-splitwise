import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "./components/ui/use-toast";

const AddTransaction = () => {
  const [title, setTitle] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [payer, setPayer] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  const { toast } = useToast();

  const addTransaction = () => {
    toast({
      title: "Add Transaction",
    });
  };

  return (
    <div className="flex flex-col m-4 p-4 space-y-4 bg-black text-white">
      <div className="space-y-2">
        <Label htmlFor="invoiceId" className="text-white">
          Invoice ID
        </Label>
        <Input
          id="invoiceId"
          type="text"
          className="w-full px-3 py-2 bg-white text-white"
          placeholder="Invoice ID"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">
          Title
        </Label>
        <Input
          id="title"
          type="text"
          className="w-full px-3 py-2 bg-white text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <div className="w-full space-y-2">
          <Label htmlFor="payer" className="text-white">
            Payer
          </Label>
          <Select onValueChange={(value) => setPayer(value)}>
            <SelectTrigger className="text-black">
              <SelectValue placeholder="Pick Payer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payer1">Payer 1</SelectItem>
              <SelectItem value="payer2">Payer 2</SelectItem>
              <SelectItem value="payer3">Payer 3</SelectItem>
              <SelectItem value="payer4">Payer 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="payee" className="text-white">
            Payee
          </Label>
          <Select onValueChange={(value) => setPayee(value)}>
            <SelectTrigger className="text-black">
              <SelectValue placeholder="Pick Payee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payee1">Payee 1</SelectItem>
              <SelectItem value="payee2">Payee 2</SelectItem>
              <SelectItem value="payee3">Payee 3</SelectItem>
              <SelectItem value="payee4">Payee 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-white">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          className="w-full px-3 py-2 bg-white text-white"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full px-3 py-2 text-left bg-white text-black"
            >
              Date: {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full px-3 py-2 text-left bg-white text-black"
            >
              Due Date: {format(dueDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button
        className="w-full px-3 py-2 bg-green-700 text-white"
        onClick={addTransaction}
      >
        Add to Transactions
      </Button>
    </div>
  );
};

export default AddTransaction;
