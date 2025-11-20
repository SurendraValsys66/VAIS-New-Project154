import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, AlertCircle, Check, Zap } from "lucide-react";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Mexico",
  "Singapore",
  "Netherlands",
  "Sweden",
  "Switzerland",
];

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  cardNetwork?: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
  lastUsed: string;
  status: "active" | "expired" | "inactive";
  autopayEnabled: boolean;
}

interface AddPaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  country: string;
  paypalEmail: string;
}

interface ValidationError {
  field: keyof AddPaymentFormData;
  message: string;
}

const getCardNetworkFromNumber = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, "");
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return "Visa";
  if (/^5[1-5][0-9]{14}$/.test(number)) return "Mastercard";
  if (/^3[47][0-9]{13}$/.test(number)) return "American Express";
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(number)) return "Discover";
  return "";
};

function validateCardForm(data: AddPaymentFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.cardholderName.trim()) {
    errors.push({
      field: "cardholderName",
      message: "Cardholder name is required",
    });
  }

  const cardNumber = data.cardNumber.replace(/\s/g, "");
  if (!cardNumber || cardNumber.length < 13) {
    errors.push({ field: "cardNumber", message: "Invalid card number" });
  }

  if (!data.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
    errors.push({
      field: "expiryDate",
      message: "Use MM/YY format",
    });
  }

  if (!data.cvc || data.cvc.length < 3) {
    errors.push({ field: "cvc", message: "Invalid CVC" });
  }

  return errors;
}

function validatePayPalForm(data: AddPaymentFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.paypalEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push({
      field: "paypalEmail",
      message: "Please enter a valid email address",
    });
  }

  return errors;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  onAdd,
  editingMethod,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (method: PaymentMethod) => void;
  editingMethod?: PaymentMethod;
}) {
  const isEditMode = !!editingMethod;
  const initialPaymentType: "card" | "paypal" = editingMethod
    ? editingMethod.type === "paypal"
      ? "paypal"
      : "card"
    : "card";

  const [paymentType, setPaymentType] = useState<"card" | "paypal">(
    initialPaymentType,
  );
  const [formData, setFormData] = useState<AddPaymentFormData>({
    cardholderName: editingMethod?.cardholderName || "",
    cardNumber: editingMethod?.cardNumber || "",
    expiryDate: editingMethod?.expiryDate || "",
    cvc: "",
    country: "United States",
    paypalEmail: editingMethod?.type === "paypal" ? editingMethod.cardNumber : "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardNetwork = useMemo(
    () => getCardNetworkFromNumber(formData.cardNumber),
    [formData.cardNumber],
  );

  const getErrorMessage = (field: keyof AddPaymentFormData): string => {
    return errors.find((e) => e.field === field)?.message || "";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/[^\d]/g, "");
    value = value.slice(0, 19);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setFormData({ ...formData, cardNumber: value });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData({ ...formData, cvc: value });
  };

  const handleAddCard = async () => {
    const validationErrors = validateCardForm(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMethod: PaymentMethod = {
      id: editingMethod?.id || `pm_${Date.now()}`,
      type: "credit_card",
      cardNetwork: cardNetwork || "Card",
      cardNumber: formData.cardNumber.slice(-4),
      expiryDate: formData.expiryDate,
      cardholderName: formData.cardholderName,
      isDefault: editingMethod?.isDefault ?? false,
      lastUsed: editingMethod?.lastUsed || new Date().toISOString().split("T")[0],
      status: editingMethod?.status ?? "active",
      autopayEnabled: editingMethod?.autopayEnabled ?? true,
    };

    onAdd(newMethod);
    resetForm();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleAddPayPal = async () => {
    const validationErrors = validatePayPalForm(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMethod: PaymentMethod = {
      id: editingMethod?.id || `pm_${Date.now()}`,
      type: "paypal",
      cardNumber: formData.paypalEmail,
      expiryDate: "",
      cardholderName: "PayPal Account",
      isDefault: editingMethod?.isDefault ?? false,
      lastUsed: editingMethod?.lastUsed || new Date().toISOString().split("T")[0],
      status: editingMethod?.status ?? "active",
      autopayEnabled: editingMethod?.autopayEnabled ?? true,
    };

    onAdd(newMethod);
    resetForm();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      country: "United States",
      paypalEmail: "",
    });
    setErrors([]);
    setPaymentType("card");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full mx-2 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-valasys-orange to-valasys-orange-light bg-clip-text text-transparent">
            Add Payment Method
          </DialogTitle>
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            Choose your preferred payment method to get started
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={() => {
                setPaymentType("card");
                setErrors([]);
              }}
              className={`group relative p-3 md:p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                paymentType === "card"
                  ? "border-valasys-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div
                  className={`p-2 md:p-3 rounded-xl transition-all transform ${
                    paymentType === "card"
                      ? "bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white scale-110 shadow-lg"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  <CreditCard className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm md:text-base">
                    Card
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Visa, Mastercard</p>
                </div>
              </div>
              {paymentType === "card" && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-full p-1 md:p-1.5 shadow-lg animate-bounce">
                  <Check className="w-3 md:w-4 h-3 md:h-4 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setPaymentType("paypal");
                setErrors([]);
              }}
              className={`group relative p-3 md:p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                paymentType === "paypal"
                  ? "border-valasys-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div
                  className={`p-2 md:p-3 rounded-xl transition-all transform ${
                    paymentType === "paypal"
                      ? "bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white scale-110 shadow-lg"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  <svg
                    className="w-5 md:w-6 h-5 md:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 4-.04.22a.805.805 0 01-.794.68h-2.31a.626.626 0 01-.625-.7l.236-1.49.32-2.03.158-1c.047-.3.318-.508.626-.508h1.04c3.238 0 5.774-1.314 6.514-5.12.74-3.807-.236-5.428-2.55-5.428h-4.166L7.944 4.24a.805.805 0 01-.794-.68l-.04-.22a.626.626 0 01.625-.7h2.31a.805.805 0 01.794.68l.04.22 1.342 8.513h1.575c3.238 0 5.774 1.314 6.514 5.12.373 1.903.04 3.327-.743 4.64z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm md:text-base">
                    PayPal
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Fast & secure</p>
                </div>
              </div>
              {paymentType === "paypal" && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-full p-1 md:p-1.5 shadow-lg animate-bounce">
                  <Check className="w-3 md:w-4 h-3 md:h-4 text-white" />
                </div>
              )}
            </button>
          </div>

          {paymentType === "card" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 md:w-6 h-5 md:h-6 bg-gradient-to-br from-valasys-orange to-valasys-orange-light text-white text-xs font-bold rounded-full">
                      1
                    </span>
                    Card Number
                  </label>
                  <div className="relative group">
                    <Input
                      placeholder="1234 1234 1234 1234"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      className={`h-10 md:h-12 text-sm md:text-base font-mono tracking-wider transition-all border-2 focus:ring-2 focus:ring-valasys-orange/30 ${
                        getErrorMessage("cardNumber")
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-valasys-orange"
                      }`}
                      maxLength={19}
                    />
                    {cardNetwork && (
                      <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 animate-fade-in">
                        <div className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg text-xs font-bold text-white shadow-lg">
                          {cardNetwork}
                        </div>
                      </div>
                    )}
                  </div>
                  {getErrorMessage("cardNumber") && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{getErrorMessage("cardNumber")}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                      Expires
                    </label>
                    <Input
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      className={`h-10 md:h-12 text-base md:text-lg font-mono font-bold tracking-widest transition-all border-2 focus:ring-2 focus:ring-valasys-orange/30 ${
                        getErrorMessage("expiryDate")
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-valasys-orange"
                      }`}
                      maxLength={5}
                    />
                    {getErrorMessage("expiryDate") && (
                      <div className="flex items-center gap-2 mt-1.5 md:mt-2 text-xs md:text-sm text-red-600 animate-in fade-in">
                        <AlertCircle className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        <span>{getErrorMessage("expiryDate")}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                      CVC
                    </label>
                    <Input
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleCvcChange}
                      className={`h-10 md:h-12 text-base md:text-lg font-mono font-bold tracking-widest transition-all border-2 focus:ring-2 focus:ring-valasys-orange/30 ${
                        getErrorMessage("cvc")
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-valasys-orange"
                      }`}
                      maxLength={4}
                    />
                    {getErrorMessage("cvc") && (
                      <div className="flex items-center gap-2 mt-1.5 md:mt-2 text-xs md:text-sm text-red-600 animate-in fade-in">
                        <AlertCircle className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        <span>{getErrorMessage("cvc")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                    Cardholder Name
                  </label>
                  <Input
                    placeholder="Full name on card"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardholderName: e.target.value,
                      })
                    }
                    className={`h-10 md:h-12 text-sm md:text-base transition-all border-2 focus:ring-2 focus:ring-valasys-orange/30 ${
                      getErrorMessage("cardholderName")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-valasys-orange"
                    }`}
                  />
                  {getErrorMessage("cardholderName") && (
                    <div className="flex items-center gap-2 mt-1.5 md:mt-2 text-xs md:text-sm text-red-600 animate-in fade-in">
                      <AlertCircle className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                      <span>{getErrorMessage("cardholderName")}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                    Country or Region
                  </label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger className="h-10 md:h-12 text-sm md:text-base border-2 border-gray-200 focus:border-valasys-orange">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 font-semibold text-sm md:text-base text-gray-700 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCard}
                  disabled={isSubmitting}
                  className="flex-1 h-10 md:h-12 bg-gradient-to-r from-valasys-orange to-valasys-orange-light hover:from-valasys-orange/90 hover:to-valasys-orange-light/90 disabled:opacity-50 text-white font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 md:w-5 h-4 md:h-5" />
                      <span className="hidden sm:inline">Add Card</span>
                      <span className="sm:hidden">Add</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {paymentType === "paypal" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 rounded-2xl p-4 md:p-6 border-2 border-valasys-orange/30 shadow-lg">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-xl shadow-lg flex-shrink-0">
                    <Zap className="w-5 md:w-6 h-5 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base md:text-lg">
                      Secure & Fast Payment
                    </p>
                    <p className="text-xs md:text-sm text-gray-700 mt-1">
                      PayPal securely handles your payment without sharing card
                      details
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                  PayPal Email Address
                </label>
                <Input
                  placeholder="your-email@example.com"
                  type="email"
                  value={formData.paypalEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, paypalEmail: e.target.value })
                  }
                  className={`h-10 md:h-12 text-sm md:text-base transition-all border-2 focus:ring-2 focus:ring-valasys-orange/30 ${
                    getErrorMessage("paypalEmail")
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-valasys-orange"
                  }`}
                />
                {getErrorMessage("paypalEmail") && (
                  <div className="flex items-center gap-2 mt-1.5 md:mt-2 text-xs md:text-sm text-red-600 animate-in fade-in">
                    <AlertCircle className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                    <span>{getErrorMessage("paypalEmail")}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 md:gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 font-semibold text-sm md:text-base text-gray-700 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPayPal}
                  disabled={isSubmitting}
                  className="flex-1 h-10 md:h-12 bg-gradient-to-r from-valasys-orange to-valasys-orange-light hover:from-valasys-orange/90 hover:to-valasys-orange-light/90 disabled:opacity-50 text-white font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 md:w-5 h-4 md:h-5" />
                      <span className="hidden sm:inline">Add PayPal</span>
                      <span className="sm:hidden">Add</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
