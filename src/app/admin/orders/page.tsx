"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Eye, CheckCircle2, Clock, Truck, X, Loader2 } from "lucide-react";
import { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    orderStatus: string,
    paymentStatus: string,
    carrier?: string,
    tracking?: string
  ) => {
    setStatusUpdateLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          order_status: orderStatus,
          payment_status: paymentStatus,
          tracking_carrier: carrier,
          tracking_number: tracking,
        }),
      });

      if (res.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      } else {
        alert("Failed to update order");
      }
    } catch {
      alert("Error updating order");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
          Customer Orders &amp; Fulfillment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review placed fabric orders, customer delivery addresses, payment verification, and dispatch tracking.
        </p>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            <tr>
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Fulfillment</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <ShoppingBag className="w-8 h-8 text-gold/40 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">No orders placed yet</p>
                  <p className="text-[11px] text-slate-400">
                    Live client orders placed on the storefront will appear here instantly.
                  </p>
                </td>
              </tr>
            )}

            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-navy">
                  {o.order_number}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900 block">
                    {o.customer_name}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {o.customer_email}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  ₹{Number(o.total_amount).toLocaleString("en-IN")}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      o.payment_status === "paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {o.payment_status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      o.order_status === "delivered"
                        ? "bg-emerald-50 text-emerald-700"
                        : o.order_status === "shipped"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {o.order_status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <span className="text-xs uppercase tracking-luxury text-gold font-bold">
                  Order Details
                </span>
                <h2 className="text-xl font-mono font-bold text-navy">
                  {selectedOrder.order_number}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-600">
              
              {/* Customer Info */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedOrder.customer_name}
                </p>
                <p>Email: {selectedOrder.customer_email}</p>
                <p>Phone: {selectedOrder.customer_phone}</p>
                {selectedOrder.shipping_address && (
                  <p className="pt-2 text-slate-700 border-t border-slate-200 mt-2">
                    <strong>Delivery Address:</strong> {selectedOrder.shipping_address.addressLine1},{" "}
                    {selectedOrder.shipping_address.addressLine2 ? `${selectedOrder.shipping_address.addressLine2}, ` : ""}
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} — {selectedOrder.shipping_address.postalCode}
                  </p>
                )}
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Fabric Items Ordered:
                </h3>
                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {item.product_title}
                        </p>
                        <p className="text-slate-500">
                          {item.quantity} {item.selling_unit === "per_metre" ? "metres" : "units"} @ ₹{Number(item.unit_price).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        ₹{Number(item.total_price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 border-t border-slate-200 pt-3 text-right">
                <p>Subtotal: ₹{Number(selectedOrder.subtotal).toLocaleString("en-IN")}</p>
                <p>Shipping: ₹{Number(selectedOrder.shipping_fee).toLocaleString("en-IN")}</p>
                <p className="text-base font-bold text-slate-900 pt-1 border-t border-slate-200">
                  Total Paid / Payable: ₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Status Update Controls */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
                <h4 className="font-semibold text-slate-900">
                  Update Order Fulfillment &amp; Tracking
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      defaultValue={selectedOrder.order_status}
                      id="orderStatusSelect"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Cutting &amp; Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Payment Status
                    </label>
                    <select
                      defaultValue={selectedOrder.payment_status}
                      id="paymentStatusSelect"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Courier Carrier
                    </label>
                    <input
                      type="text"
                      id="carrierInput"
                      defaultValue={selectedOrder.tracking_carrier || "Blue Dart"}
                      placeholder="e.g. Blue Dart / Delhivery"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Tracking Number / AWB
                    </label>
                    <input
                      type="text"
                      id="trackingInput"
                      defaultValue={selectedOrder.tracking_number || ""}
                      placeholder="e.g. BD123456789"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={statusUpdateLoading}
                    onClick={() => {
                      const orderStatus = (document.getElementById("orderStatusSelect") as HTMLSelectElement).value;
                      const paymentStatus = (document.getElementById("paymentStatusSelect") as HTMLSelectElement).value;
                      const carrier = (document.getElementById("carrierInput") as HTMLInputElement).value;
                      const tracking = (document.getElementById("trackingInput") as HTMLInputElement).value;

                      handleUpdateStatus(
                        selectedOrder.id,
                        orderStatus,
                        paymentStatus,
                        carrier,
                        tracking
                      );
                    }}
                    className="px-4 py-2 bg-navy hover:bg-navy-deep text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-2"
                  >
                    {statusUpdateLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Save Order Updates</span>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
