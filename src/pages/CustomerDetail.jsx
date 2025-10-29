import {
  ExternalLink,
  DollarSign,
  Pause,
  RotateCcw,
  Info,
  User,
  Key,
  Gift,
  Calendar,
  Lock,
  ChevronRight,
  ReceiptText,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import TrialDateModal from "../components/TrialDateModal";
import ReactivateModal from "../components/ReactivateModal";
import FullScreenLoader from "../components/FullScreenLoader";
import PasswordResetModal from "../components/PasswordResetModal";
import SuspendAccountModal from "../components/SuspendAccountModal";
import TemplateAccessModal from "../components/TemplateAccessModal";
import ImpersonateUserModal from "../components/ImpersonateUserModal";

import { formatDate } from "../utils/helper";
import { PAYMENT_STATUS } from "../config/constants";
import { updateTemplateAccess } from "../store/slices/customerSlice";
import { useOrganizationUsers } from "../hooks/useOrganizationUsers";

export default function CustomerDetail({ env }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: customerId } = useParams();

  const { users, loading } = useOrganizationUsers(env);

  const customer = users?.find((user) => user?.id === customerId);

  const [openModal, setOpenModal] = useState("");
  const [newTrialDate, setNewTrialDate] = useState("");

  const isTrailExtendAllowed =
    customer?.status === "Trial" || customer?.status === "Inactive";

  const subscriptionEndDate = customer?.subscription?.period_end;
  const subscriptionStartDate = customer?.subscription?.period_start;
  const address = customer?.subscription?.address;
  const isSuspensionAllowed =
    customer?.status === "Active" || customer?.status === "Overdue";
  const isSuspended = customer?.status === "Suspended";
  const isImpersonateAllowed =
    customer?.status === "Active" ||
    customer?.status === "Trial" ||
    customer?.status === "Overdue";

  const handleOpenTrailModal = () => {
    const formattedDate = customer?.trial_ends
      ? new Date(customer?.trial_ends).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setNewTrialDate(formattedDate);
    setOpenModal("EXTEND_TRIAL");
  };

  const handleCloseModal = () => {
    setOpenModal("");
    setNewTrialDate("");
  };

  const handleExit = () => {
    navigate("/customers");
  };

  const handleUpdateTemplateAccess = async (selectedTemplateIds) => {
    try {
      await dispatch(
        updateTemplateAccess({
          env,
          selectedTemplateIds,
          organizationId: customer?.id,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to update template access:", err);
      toast.error("Failed to update template access");
    }
  };

  const handleViewInStripe = () => {
    window.open(
      `https://dashboard.stripe.com/${env === "dev" ? "test/" : ""}customers/${
        customer?.subscription?.customer_id
      }`,
      "_blank"
    );
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="h-full pt-5 bg-transparent">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer?.business_name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {customer?.owner?.name} • {customer?.owner?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="text-white px-4 py-1 h-[24px] text-center rounded-full text-xs font-normal"
              style={{
                backgroundColor: PAYMENT_STATUS[customer?.status]?.color,
              }}
            >
              {PAYMENT_STATUS[customer?.status]?.label}
            </div>
            <button
              className="bg-[#e3e6d3] text-[#5d614a] px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-0"
              onClick={handleExit}
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex p-6 gap-6">
        {/* Left Panel - Customer Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-1/2">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-400">
                Customer Name
              </label>
              <p className="text-gray-900 ms-3">{customer?.business_name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">
                Owner Name
              </label>
              <p className="text-gray-900 ms-3">{customer?.owner?.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Email</label>
              <p className="text-gray-900 ms-3">{customer?.owner?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">
                Address
              </label>
              {address ? (
                <div className="text-gray-900 ms-3">
                  <p>{address.line1 || address.line2}</p>
                  <p>{address.city}</p>
                  <p>
                    {address.state}, {address.country} {address.postal_code}
                  </p>
                </div>
              ) : (
                <div className="text-gray-900 ms-3">
                  <p>N/A</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">
                Status
              </label>
              <div className="mt-1 ms-3">
                <span
                  className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium text-white"
                  style={{
                    backgroundColor: PAYMENT_STATUS[customer?.status]?.color,
                  }}
                >
                  {PAYMENT_STATUS[customer?.status]?.label}
                </span>
              </div>
            </div>

            {isTrailExtendAllowed ? (
              <div
                className="rounded-md px-4 py-2 border border-gray-400 relative cursor-pointer"
                onClick={handleOpenTrailModal}
              >
                <div className="flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium">Extend Trial</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {customer.status === "Trial" ? (
                    <span>Trail Ends: {formatDate(customer?.trial_ends)}</span>
                  ) : (
                    <span>
                      {subscriptionEndDate ? "Subscription" : "Trial"} Ended on{" "}
                      {formatDate(subscriptionEndDate || customer?.trial_ends)}
                    </span>
                  )}
                </p>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-md px-4 py-2 cursor-not-allowed">
                <div className="flex items-center text-gray-500">
                  <Gift className="h-5 w-5 mr-2" />
                  <span className="font-medium">Extend Trial</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Only available for trial accounts
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-400">
                Last Payment Date
              </label>
              <div className="flex items-center mt-1 ms-3">
                <Calendar className="h-3.5 w-3.5 me-2" />
                <span className="text-gray-900">
                  {subscriptionStartDate
                    ? formatDate(subscriptionStartDate)
                    : "N/A (Trial Account)"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <Lock className="h-3 w-3 mr-1" />
              <span>
                All customer information is synced with Stripe. Use "View in
                Stripe" to make changes.
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-1/2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Account Actions
          </h3>

          <div className="space-y-3">
            {/* View in Stripe */}
            <button
              onClick={handleViewInStripe}
              className="w-full flex items-center justify-between p-3 border border-gray-300 text-left hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-0"
            >
              <div className="flex items-center">
                <ReceiptText className="h-4 w-4 text-blue-500 mr-3" />
                <span className="text-gray-900 font-semibold">
                  View in Stripe
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </button>

            {/* Add Credit */}
            <button
              disabled
              className="w-full flex items-center justify-between border border-gray-100 p-3 text-left cursor-not-allowed bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-0"
            >
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-300 mr-3" />
                <span className="text-gray-400 font-semibold">Add Credit</span>
              </div>
            </button>

            {/* Suspend Account */}
            {isSuspensionAllowed ? (
              <button
                onClick={() => setOpenModal("SUSPEND_ACCOUNT")}
                className="w-full flex items-center border border-gray-300 justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-0"
              >
                <div className="flex items-center">
                  <Pause className="h-4 w-4 text-red-500 mr-3" />
                  <span className="text-gray-900 font-semibold">
                    Suspend Account
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <button className="w-full flex flex-col p-3 text-left bg-gray-100 cursor-not-allowed rounded-md transition-colors focus:outline-none focus:ring-0">
                <div className="flex items-center">
                  <Pause className="h-4 w-4 text-gray-300 mr-3" />
                  <span className="text-gray-400 font-semibold">
                    Suspend Account
                  </span>
                </div>
                <p className="text-xs text-gray-400 ml-7">
                  Only available for active accounts
                </p>
              </button>
            )}

            {/* Reactivate Account */}
            {isSuspended ? (
              <button
                onClick={() => setOpenModal("REACTIVATE_ACCOUNT")}
                className="w-full flex items-center justify-between p-3 text-left rounded-md border border-gray-300 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-0"
              >
                <div className="flex items-center">
                  <RotateCcw className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-900 font-semibold">
                    Reactivate Account
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <div className="w-full p-3 text-left rounded-md bg-gray-100 cursor-not-allowed">
                <div className="flex items-center">
                  <RotateCcw className="h-5 w-5 text-gray-300 mr-3" />
                  <span className="text-gray-400">Reactivate Account</span>
                </div>
                <p className="text-xs text-gray-400 ml-8">
                  Only available for suspended accounts
                </p>
              </div>
            )}
          </div>

          {/* Support Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Support
            </h3>

            <div className="space-y-3">
              {/* Template Access */}
              <button
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setOpenModal("TEMPLATE_ACCESS")}
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-900 font-semibold">
                    Template Access
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              {/* Impersonate User */}
              <button
                disabled={!isImpersonateAllowed}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-100"
                onClick={() => setOpenModal("IMPERSONATE_USER")}
              >
                <div className="flex items-center">
                  <User
                    className={`h-5 w-5 ${
                      isImpersonateAllowed ? "text-blue-500" : "text-gray-400"
                    } mr-3`}
                  />
                  <span
                    className={`font-semibold ${
                      isImpersonateAllowed ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    Impersonate User
                  </span>
                </div>
                {isImpersonateAllowed && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {/* Password Reset */}
              <button
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setOpenModal("PASSWORD_RESET")}
              >
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-900 font-semibold">
                    Password Reset
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal === "EXTEND_TRIAL" && (
        <TrialDateModal
          env={env}
          onClose={handleCloseModal}
          newTrialDate={newTrialDate}
          organizationId={customer?.id}
          setNewTrialDate={setNewTrialDate}
        />
      )}

      {openModal === "IMPERSONATE_USER" && (
        <ImpersonateUserModal
          env={env}
          onClose={handleCloseModal}
          email={customer?.owner?.email}
        />
      )}

      {openModal === "TEMPLATE_ACCESS" && (
        <TemplateAccessModal
          onClose={handleCloseModal}
          onSave={handleUpdateTemplateAccess}
          currentTemplates={customer?.skeletons}
          isOpen={openModal === "TEMPLATE_ACCESS"}
        />
      )}

      {openModal === "PASSWORD_RESET" && (
        <PasswordResetModal onClose={handleCloseModal} />
      )}

      {openModal === "SUSPEND_ACCOUNT" && (
        <SuspendAccountModal
          env={env}
          customerId={customer?.id}
          onClose={handleCloseModal}
        />
      )}

      {openModal === "REACTIVATE_ACCOUNT" && (
        <ReactivateModal
          env={env}
          customerId={customer?.id}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
