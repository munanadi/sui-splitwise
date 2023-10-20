import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";

const Dashboard = () => {
  return (
    <div className="flex dark:bg-black justify-center">
      <div className="w-1/2 dark:bg-black p-6 mx-2">
        <Card className="dark:bg-black">
          <CardHeader>
            <CardTitle className="text-black text-5xl">
              Account Receivable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-black text-3xl">$42</CardContent>
        </Card>
      </div>
      <div className="w-1/2 dark:bg-black p-6 mx-2">
        <Card className="dark:bg-black">
          <CardHeader>
            <CardTitle className="text-black text-5xl">
              Accounts Payable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-black text-3xl">$100</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
