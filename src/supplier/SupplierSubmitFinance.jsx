import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { supabase } from "../supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { onAuthStateChanged } from "firebase/auth";

const SupplierSubmitFinance = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [usd, setUSD] = useState("");
  const [deposit, setDeposit] = useState("");
  const [fullPayment, setFullPayment] = useState("");
  const [financeUsers, setFinanceUsers] = useState([]);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Track logged-in supplier
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ email: user.email, uid: user.uid });
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Finance users from Firestore
  useEffect(() => {
    const fetchFinanceUsers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "finance"));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFinanceUsers(users);
    };
    fetchFinanceUsers();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  // Upload to Supabase (same bucket as AddOrder)
  const uploadFileToSupabase = async () => {
    if (!file) return "";

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("orders")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("orders")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Supabase upload error:", err);
      alert("File upload failed: " + err.message);
      return "";
    }
  };

  const handleSubmit = async () => {
    if (!file || !amount || !rate || !usd || !deposit || !fullPayment || !selectedFinance) {
      return alert("Please fill in all fields.");
    }

    setLoading(true);
    try {
      const fileURL = await uploadFileToSupabase();

      await addDoc(collection(db, "finance_submissions"), {
        supplierEmail: currentUser.email,
        financeUserId: selectedFinance.id,
        financeUserEmail: selectedFinance.email,
        fileURL,
        amount: Number(amount),
        rate: Number(rate),
        usd: Number(usd),
        deposit: Number(deposit),
        fullPayment: Number(fullPayment),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Finance submission sent successfully!");

      // Reset fields
      setFile(null);
      setAmount("");
      setRate("");
      setUSD("");
      setDeposit("");
      setFullPayment("");
      setSelectedFinance(null);
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to submit: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser)
    return (
      <p className="text-center text-gray-700 mt-10">
        Please log in to submit finance data.
      </p>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md border border-gray-200 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Submit Finance Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Input type="file" id="fileInput" onChange={handleFileChange} />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Rate"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <Input
            placeholder="USD"
            type="number"
            value={usd}
            onChange={(e) => setUSD(e.target.value)}
          />
          <Input
            placeholder="Deposit"
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
          <Input
            placeholder="Full Payment"
            type="number"
            value={fullPayment}
            onChange={(e) => setFullPayment(e.target.value)}
          />

          <select
            value={selectedFinance?.id || ""}
            onChange={(e) => {
              const user = financeUsers.find((u) => u.id === e.target.value);
              setSelectedFinance(user);
            }}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select Finance User --</option>
            {financeUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-48 bg-gradient-to-b from-gray-900 to-blue-950 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"
            >
              {loading ? "Submitting..." : "Submit to Finance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierSubmitFinance;
