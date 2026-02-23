import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, FileText, Tag, Calendar, CheckCircle } from "lucide-react";
import { api } from "../services/api";

const TAX_TYPES = ["PAYE", "Personal Income Tax", "Business Tax", "VAT", "Levy", "Government Fee", "Other"];

export const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [marking, setMarking] = useState(null);

  // ✅ State matches what backend expects
  const [newTax, setNewTax] = useState({
    title: "",
    amount: "",
    taxType: "Other",
    dueDate: "",
    authority: "",
    notes: "",
  });

  const loadTaxes = async () => {
    try {
      const result = await api.getTaxes();
      // Backend returns plain array
      if (Array.isArray(result)) {
        setTaxes(result);
      } else if (result?.taxes) {
        setTaxes(result.taxes);
      }
    } catch (err) {
      console.error("Failed to load taxes", err);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleCreate = async () => {
    // ✅ Validate correct fields
    if (!newTax.title || !newTax.amount || !newTax.dueDate) return;
    setLoading(true);
    try {
      // ✅ Send what backend actually expects
      const result = await api.addTax({
        title: newTax.title,
        amount: Number(newTax.amount),
        taxType: newTax.taxType,
        dueDate: newTax.dueDate,
        authority: newTax.authority,
        notes: newTax.notes,
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        setShowModal(false);
        setNewTax({ title: "", amount: "", taxType: "Other", dueDate: "", authority: "", notes: "" });
        loadTaxes();
      }
    } catch (err) {
      console.error("Failed to create tax entry", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.deleteTax(id);
      loadTaxes();
    } catch (err) {
      console.error("Failed to delete tax", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkPaid = async (tax) => {
    setMarking(tax._id);
    try {
      await api.updateTax(tax._id, {
        status: "paid",
        paidAt: new Date().toISOString(),
      });
      loadTaxes();
    } catch (err) {
      console.error("Failed to mark tax as paid", err);
    } finally {
      setMarking(null);
    }
  };

  const totalTaxes = taxes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const pendingTaxes = taxes.filter((t) => t.status !== "paid");
  const paidTaxes = taxes.filter((t) => t.status === "paid");
  const taxTypes = [...new Set(taxes.map((t) => t.taxType).filter(Boolean))];

  const statusStyle = (status) => {
    if (status === "paid") return "bg-emerald-500/15 text-emerald-400";
    if (status === "overdue") return "bg-red-500/15 text-red-400";
    return "bg-amber-500/15 text-amber-400";
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Tax Tracker</h1>
          <p className="text-gray-400 text-sm mt-1">
            {taxes.length > 0
              ? `${pendingTaxes.length} pending · ${paidTaxes.length} paid · ${taxTypes.length} tax type${taxTypes.length !== 1 ? "s" : ""}`
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Total Tax</p>
            <p className="text-lg font-bold text-white">₦{totalTaxes.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Entries</p>
            <p className="text-lg font-bold text-purple-400">{taxes.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Pending</p>
            <p className="text-lg font-bold text-amber-400">{pendingTaxes.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Paid</p>
            <p className="text-lg font-bold text-emerald-400">{paidTaxes.length}</p>
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
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {/* ✅ tax.title not tax.description */}
                  <h3 className="text-base font-semibold text-white truncate">{tax.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {/* ✅ tax.taxType not tax.category */}
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{tax.taxType}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyle(tax.status)}`}>
                      {tax.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(tax._id)}
                  disabled={deleting === tax._id}
                  className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Due date */}
              <div className="flex items-center gap-1.5 mb-3">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  Due: {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
                </span>
              </div>

              {/* Authority */}
              {tax.authority && (
                <p className="text-xs text-gray-500 mb-3">Authority: {tax.authority}</p>
              )}

              {/* Amount row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-500">{tax.currency || "NGN"}</span>
                <span className="text-lg font-bold text-white">
                  ₦{Number(tax.amount).toLocaleString()}
                </span>
              </div>

              {/* Mark as paid button */}
              {tax.status !== "paid" && (
                <button
                  onClick={() => handleMarkPaid(tax)}
                  disabled={marking === tax._id}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500 rounded-lg py-2 transition-colors disabled:opacity-40"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {marking === tax._id ? "Marking..." : "Mark as Paid"}
                </button>
              )}

              {/* Paid at info */}
              {tax.status === "paid" && tax.paidAt && (
                <p className="mt-3 text-xs text-emerald-400 text-center">
                  ✓ Paid on {new Date(tax.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 mb-5">
            <FileText className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tax entries yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Keep track of your taxes, deductions, and related expenses all in one place.
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

      {/* Create modal — ✅ all fields now inside the modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-lg font-semibold text-white">New Tax Entry</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="e.g., LIRS PAYE - January"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  value={newTax.title}
                  onChange={(e) => setNewTax({ ...newTax, title: e.target.value })}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  value={newTax.amount}
                  onChange={(e) => setNewTax({ ...newTax, amount: e.target.value })}
                />
              </div>

              {/* Tax Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tax Type</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none"
                  value={newTax.taxType}
                  onChange={(e) => setNewTax({ ...newTax, taxType: e.target.value })}
                >
                  {TAX_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm outline-none"
                  value={newTax.dueDate}
                  onChange={(e) => setNewTax({ ...newTax, dueDate: e.target.value })}
                />
              </div>

              {/* Authority */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Authority (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., FIRS, LIRS, State Govt"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  value={newTax.authority}
                  onChange={(e) => setNewTax({ ...newTax, authority: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes (optional)</label>
                <input
                  type="text"
                  placeholder="Any additional info..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  value={newTax.notes}
                  onChange={(e) => setNewTax({ ...newTax, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex gap-3 sticky bottom-0 bg-gray-900">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !newTax.title || !newTax.amount || !newTax.dueDate}
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