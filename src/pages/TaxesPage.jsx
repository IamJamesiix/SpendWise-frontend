import React, { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { api } from "../services/api";

export const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTax, setNewTax] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const loadTaxes = async () => {
    try {
      const result = await api.getTaxes();
      if (result.success) setTaxes(result.taxes || []);
    } catch (err) {
      console.error("Failed to load taxes");
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleCreate = async () => {
    try {
      await api.addTax(newTax);
      setShowModal(false);
      setNewTax({ description: "", amount: "", category: "" });
      loadTaxes();
    } catch (err) {
      console.error("Failed to create tax entry");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTax(id);
      loadTaxes();
    } catch (err) {
      console.error("Failed to delete tax");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Tax Tracker</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Tax Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {taxes.map((tax, idx) => (
          <div
            key={idx}
            className="bg-gray-800/50 p-6 rounded-2xl border border-purple-500/20"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {tax.description}
                </h3>
                <p className="text-gray-400 text-sm">{tax.category}</p>
              </div>
              <button
                onClick={() => handleDelete(tax._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-bold text-lg">${tax.amount}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">New Tax Entry</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Property Tax"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newTax.description}
                  onChange={(e) =>
                    setNewTax({ ...newTax, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newTax.amount}
                  onChange={(e) =>
                    setNewTax({ ...newTax, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Federal"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newTax.category}
                  onChange={(e) =>
                    setNewTax({ ...newTax, category: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl"
              >
                Add Tax Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
