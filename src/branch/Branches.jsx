import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Input } from "components/ui/input";
import { Button } from "components/ui/Button";
import { Edit, Trash2, Plus, Save, Download } from "lucide-react";

const PAGE_SIZE = 5;

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const snapshot = await getDocs(collection(db, "branches"));
    setBranches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddBranch = async () => {
    if (!newBranch.trim()) return;
    await addDoc(collection(db, "branches"), { name: newBranch, createdAt: serverTimestamp() });
    setNewBranch("");
    fetchBranches();
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    await deleteDoc(doc(db, "branches", id));
    fetchBranches();
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEditing = async (id) => {
    if (!editingName.trim()) return;
    await updateDoc(doc(db, "branches", id), { name: editingName });
    setEditingId(null);
    setEditingName("");
    fetchBranches();
  };

  // Pagination
  const totalPages = Math.ceil(branches.length / PAGE_SIZE);
  const paginatedBranches = branches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Export CSV
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Branch Name"].join(",") + "\n" +
      branches.map(b => b.name).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "branches.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Add & Export Card */}
      <Card className="w-full max-w-4xl mb-6 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="New Branch Name"
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            className="flex-1"
          />
          <Button iconOnly onClick={handleAddBranch}>
            <Plus className="w-45 h-45" />
          </Button>
        </div>
        <Button iconOnly bg={false} onClick={handleExport}>
          <Download className="w-6 h-6" />
        </Button>
      </Card>

      {/* Branch Table Card */}
      <Card className="w-full max-w-4xl overflow-x-auto">
        <CardContent>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Branch Name
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map(branch => (
                <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 border-b">
                    {editingId === branch.id ? (
                      <Input
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onBlur={() => saveEditing(branch.id)}
                        autoFocus
                        className="w-full"
                      />
                    ) : branch.name}
                  </td>
                  <td className="px-6 py-3 text-right border-b flex justify-end gap-2">
                    {editingId !== branch.id ? (
                      <>
                        <Button iconOnly bg={false} onClick={() => startEditing(branch.id, branch.name)}>
                          <Edit className="w-6 h-6" />
                        </Button>
                        <Button iconOnly bg={false} onClick={() => handleDeleteBranch(branch.id)}>
                          <Trash2 className="w-6 h-6 text-red-600" />
                        </Button>
                      </>
                    ) : (
                      <Button iconOnly bg={false} onClick={() => saveEditing(branch.id)}>
                        <Save className="w-6 h-6 text-green-600" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                    No branches available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button iconOnly bg={false} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                ◀
              </Button>
              <span className="px-3 py-1 bg-gray-200 rounded">{currentPage} / {totalPages}</span>
              <Button iconOnly bg={false} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                ▶
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Branches;
