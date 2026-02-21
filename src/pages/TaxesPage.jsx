import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, FileText, DollarSign, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";

export const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [newTax, setNewTax] = useState({
    title: "",
    amount: "",
    taxType: "Other",
    dueDate: "",
  });

  const loadTaxes = async () => {
    try {
      const result = await api.getTaxes();
      if (Array.isArray(result)) {
        setTaxes(result);
      } else if (result?.success) {
        setTaxes(result.taxes || []);
      } else {
        toast.error(
          result?.error || result?.message || "Failed to load tax entries"
        );
      }
    } catch (err) {
      console.error("Failed to load taxes", err);
      toast.error("Failed to load tax entries");
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleCreate = async () => {
    if (!newTax.description || !newTax.amount) return;
    setLoading(true);
    try {
      const payload = {
        // Backend maps description -> title
        description: newTax.description,
        amount: Number(newTax.amount),
        category: newTax.category,
      };

      const result = await api.addTax(payload);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Tax entry added");
        setShowModal(false);
        setNewTax({ description: "", amount: "", category: "" });
        loadTaxes();
      }
    } catch (err) {
      console.error("Failed to create tax entry", err);
      toast.error("Failed to create tax entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const result = await api.deleteTax(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Tax entry deleted");
        loadTaxes();
      }
    } catch (err) {
      console.error("Failed to delete tax", err);
      toast.error("Failed to delete tax");
    } finally {
      setDeleting(null);
    }
  };

  const totalTaxes = taxes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const categories = [...new Set(taxes.map((t) => t.category).filter(Boolean))];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Tax Tracker
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {taxes.length > 0
              ? `${taxes.length} entr${
                  taxes.length !== 1 ? "ies" : "y"
                } across ${categories.length} categor${
                  categories.length !== 1 ? "ies" : "y"
                }`
              : "Track your tax entries and deductions"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm shrink-0 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {/* Summary cards */}
      {taxes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-white">
              ${totalTaxes.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Entries</p>
            <p className="text-lg font-bold text-purple-400">{taxes.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Categories</p>
            <p className="text-lg font-bold text-amber-400">
              {categories.length}
            </p>
          </div>
        </div>
      )}

      {/* Tax entries */}
      {taxes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxes.map((tax, idx) => (
            <div
              key={tax._id || idx}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">
                    {tax.description}
                  </h3>
                  {tax.category && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {tax.category}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(tax._id)}
                  disabled={deleting === tax._id}
                  className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-500">Amount</span>
                <span className="text-lg font-bold text-white">
                  ${Number(tax.amount).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 mb-5">
            <FileText className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No tax entries yet
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Keep track of your taxes, deductions, and related expenses all in
            one place.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Entry
          </button>
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                New Tax Entry
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Property Tax"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={newTax.description}
                  onChange={(e) =>
                    setNewTax({ ...newTax, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    value={newTax.amount}
                    onChange={(e) =>
                      setNewTax({ ...newTax, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Federal"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={newTax.category}
                  onChange={(e) =>
                    setNewTax({ ...newTax, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Tax Type
              </label>
              <select
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none"
                value={newTax.taxType}
                onChange={(e) =>
                  setNewTax({ ...newTax, taxType: e.target.value })
                }
              >
                {[
                  "PAYE",
                  "Personal Income Tax",
                  "Business Tax",
                  "VAT",
                  "Levy",
                  "Government Fee",
                  "Other",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none"
                value={newTax.dueDate}
                onChange={(e) =>
                  setNewTax({ ...newTax, dueDate: e.target.value })
                }
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !newTax.description || !newTax.amount}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                {loading ? "Adding..." : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
