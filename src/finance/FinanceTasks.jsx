import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const FinanceTask = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track current finance user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser({ email: user.email, uid: user.uid });
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch finance submissions assigned to this user
  const fetchSubmissions = async (email) => {
    setLoading(true);
    try {
      const q = query(collection(db, "finance_submissions"), where("financeUserEmail", "==", email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) fetchSubmissions(currentUser.email);
  }, [currentUser]);

  // Generate random Salaam Bank account
  const generateAccountNumber = () => {
    const prefix = "SLM";
    const number = Math.floor(10000000 + Math.random() * 90000000);
    return `${prefix}-${number}`;
  };

  // Approve
  const handleApprove = async (submissionId) => {
    try {
      const accountNumber = generateAccountNumber();
      await updateDoc(doc(db, "finance_submissions", submissionId), {
        status: "approved",
        accountNumber,
        approvedAt: new Date().toISOString(),
      });
      alert("✅ Submission approved!");
      fetchSubmissions(currentUser.email);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve submission.");
    }
  };

  // Reject
  const handleReject = async (submissionId) => {
    try {
      await updateDoc(doc(db, "finance_submissions", submissionId), {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      });
      alert("❌ Submission rejected!");
      fetchSubmissions(currentUser.email);
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Failed to reject submission.");
    }
  };

  if (!currentUser)
    return <p className="text-center text-gray-700 mt-10">Please log in as a finance user.</p>;

  if (loading)
    return <p className="text-center text-gray-700 mt-10">Loading submissions...</p>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10 px-4">
      <Card className="w-full max-w-4xl shadow-md border border-gray-200 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Finance Review Tasks
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 p-6">
          {submissions.length === 0 ? (
            <p className="text-center text-gray-600">No submissions assigned to you.</p>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Supplier: <span className="text-blue-700">{sub.supplierEmail}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p><strong>Amount:</strong> {sub.amount}</p>
                  <p><strong>Rate:</strong> {sub.rate}</p>
                  <p><strong>USD:</strong> {sub.usd}</p>
                  <p><strong>Deposit:</strong> {sub.deposit}</p>
                  <p><strong>Full Payment:</strong> {sub.fullPayment}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge
                      className={`ml-1 ${
                        sub.status === "approved"
                          ? "bg-green-600"
                          : sub.status === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {sub.status?.toUpperCase()}
                    </Badge>
                  </p>
                </div>

                {sub.fileURL ? (
                  <Button
                    asChild
                    className="bg-gradient-to-b from-gray-900 to-blue-950 hover:opacity-90 text-white mt-3 w-full sm:w-40 font-medium"
                  >
                    <a href={sub.fileURL} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-2">No PDF uploaded</p>
                )}

                {sub.status === "pending" && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => handleApprove(sub.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full sm:w-32"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(sub.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full sm:w-32"
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {sub.status === "approved" && (
                  <p className="mt-3 text-sm">
                    <strong>Salaam Bank Account:</strong>{" "}
                    <span className="text-green-700 font-semibold">{sub.accountNumber}</span>
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceTask;
