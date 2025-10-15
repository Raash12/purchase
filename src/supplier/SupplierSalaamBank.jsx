import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const SupplierSalaamBank = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ email: user.email, uid: user.uid });
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  const fetchSubmissions = async (email) => {
    setLoading(true);
    try {
      const q = query(collection(db, "finance_submissions"), where("supplierEmail", "==", email), where("status", "==", "approved"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) fetchSubmissions(currentUser.email);
  }, [currentUser]);

  if (!currentUser) return <p className="text-center mt-10">Please login.</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Salaam Bank Account</h1>
      {submissions.length === 0 ? (
        <p className="text-center text-gray-600">No approved payments yet.</p>
      ) : (
        submissions.map(sub => (
          <Card key={sub.id} className="mb-4 border border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-gray-700">
              <p><strong>Amount:</strong> {sub.amount}</p>
              <p><strong>Deposit:</strong> {sub.deposit}</p>
              <p><strong>Full Payment:</strong> {sub.fullPayment}</p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge className="ml-2 bg-green-600">{sub.status?.toUpperCase()}</Badge>
              </p>
              <p>
                <strong>Salaam Bank Account:</strong>{" "}
                <span className="text-green-700 font-semibold">{sub.accountNumber}</span>
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default SupplierSalaamBank;
