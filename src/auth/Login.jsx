import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email and password");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return alert("User data not found");

      const { role } = userDoc.data();
      if (role === "sales") navigate("/dashboard/sales");
      else if (role === "finance") navigate("/dashboard/finance");
      else if (role === "supplier") navigate("/dashboard/supplier");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl text-center mb-4 text-black">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input 
            placeholder="Email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <Input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />

          <Button onClick={handleLogin} className="w-full mt-2 bg-blue-950 hover:bg-blue-900 text-white">
            Login
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-950 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;