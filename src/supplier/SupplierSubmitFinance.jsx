import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { supabase } from "../supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const SupplierSubmitFinance = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [usd, setUSD] = useState("");
  const [deposit, setDeposit] = useState("");
  const [fullPayment, setFullPayment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ email: user.email, uid: user.uid });
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const uploadFileToSupabase = async () => {
    if (!file) return "";
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("finance_submissions").upload(fileName, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from("finance_submissions").getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!file || !amount || !rate || !usd || !deposit || !fullPayment) {
      return alert("Please fill in all fields.");
    }

    setLoading(true);

    try {
      const fileURL = await uploadFileToSupabase();
      await addDoc(collection(db, "finance_submissions"), {
        supplierEmail: currentUser.email,
        fileURL,
        amount: Number(amount),
        rate: Number(rate),
        usd: Number(usd),
        deposit: Number(deposit),
        fullPayment: Number(fullPayment),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Submission sent to Finance!");
      setFile(null);
      setAmount(""); setRate(""); setUSD(""); setDeposit(""); setFullPayment("");
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to submit: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <p>Please login to submit product data.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Product Data to Finance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input type="file" id="fileInput" onChange={handleFileChange} />
          <Input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          <Input placeholder="Rate" type="number" value={rate} onChange={e => setRate(e.target.value)} />
          <Input placeholder="USD" type="number" value={usd} onChange={e => setUSD(e.target.value)} />
          <Input placeholder="Deposit" type="number" value={deposit} onChange={e => setDeposit(e.target.value)} />
          <Input placeholder="Full Payment" type="number" value={fullPayment} onChange={e => setFullPayment(e.target.value)} />

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            {loading ? "Submitting..." : "Submit to Finance"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierSubmitFinance;
