import React, { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const snapshot = await getDocs(collection(db, "branches"));
        setBranches(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      } catch (err) {
        console.error("Error fetching branches:", err);
        alert("Error loading branches");
      }
    };
    fetchBranches();
  }, []);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !role) {
      return alert("Please fill all fields");
    }

    // Only require branch for suppliers
    if (role === "supplier" && !branch) {
      return alert("Please select a branch for supplier role");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data - only include branch for suppliers
      const userData = {
        uid: user.uid,
        fullName,
        email,
        role,
        createdAt: serverTimestamp(),
      };

      // Add branch only for suppliers
      if (role === "supplier") {
        userData.branch = branch;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      // Redirect to login page after successful signup
      alert("Account created successfully! Please login.");
      navigate("/login");
      
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        alert("Email already exists. Please use a different email.");
      } else if (err.code === 'auth/invalid-email') {
        alert("Invalid email address.");
      } else if (err.code === 'auth/weak-password') {
        alert("Password is too weak.");
      } else {
        alert("Signup failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-pink-200 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        
        <div className="flex flex-col gap-3">
          <Input 
            placeholder="Full Name" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <Input 
            placeholder="Email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <Input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {/* Role Dropdown */}
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Role</option>
            <option value="sales">Sales</option>
            <option value="finance">Finance</option>
            <option value="supplier">Supplier</option>
          </select>

          {/* Branch Dropdown - Only show for suppliers */}
          {role === "supplier" && (
            <select 
              value={branch} 
              onChange={e => setBranch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Branch</option>
              {branches.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          )}

          <Button 
            className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;