import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { supabase } from "@/frontend/lib/supabase";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Save,
  Loader2,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/account")({
  component: AdminAccountPage,
});

function AdminAccountPage() {
  const { currentUser, isLoading, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    profile_image_id: null as string | null,
    profile_image_url: null as string | null,
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Email Form State
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
  });
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync state when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || "",
        profile_image_id: currentUser.profile_image_id || null,
        profile_image_url: currentUser.profile_image_url || null,
      });
    }
  }, [currentUser]);

  // Handle Email Change
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingEmail || !currentUser) return;

    const trimmedNewEmail = emailForm.newEmail.trim().toLowerCase();
    const { currentPassword } = emailForm;

    if (!trimmedNewEmail) {
      toast.error("Please enter your new email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedNewEmail)) {
      toast.error("Please enter a valid email address format");
      return;
    }

    if (trimmedNewEmail === currentUser.email?.toLowerCase()) {
      toast.error("New email must be different from your current email address");
      return;
    }

    if (!currentPassword) {
      toast.error("Please enter your current password to confirm this change");
      return;
    }

    try {
      setIsChangingEmail(true);

      // 1. Re-authenticate current user with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect. Email change canceled.");
        return;
      }

      // 2. Request email update via Supabase Auth
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        email: trimmedNewEmail,
      });

      if (updateError) {
        throw updateError;
      }

      const isVerificationRequired =
        Boolean(updateData.user?.new_email) ||
        (updateData.user?.email && updateData.user.email.toLowerCase() !== trimmedNewEmail);

      if (isVerificationRequired) {
        toast.info(
          "A verification email has been sent to your new email address. Please verify it to complete the change.",
          { duration: 8000 },
        );
      } else {
        toast.success("Email address changed successfully!");
      }

      setEmailForm({
        newEmail: "",
        currentPassword: "",
      });

      await refreshUserProfile();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number } | null;
      console.error("Email change error:", err);
      const msg = (errorObj?.message || "").toLowerCase();
      const status = errorObj?.status;

      if (
        status === 429 ||
        msg.includes("rate limit") ||
        msg.includes("rate_limit") ||
        msg.includes("over_email_send_rate_limit")
      ) {
        toast.error(
          "Email change is temporarily unavailable because the authentication email sending limit has been reached. Please wait and try again later.",
          { duration: 8000 },
        );
      } else if (
        msg.includes("already registered") ||
        msg.includes("already been registered") ||
        msg.includes("already exists") ||
        msg.includes("user already registered") ||
        msg.includes("taken") ||
        msg.includes("duplicate")
      ) {
        toast.error("This email address is already associated with another account.");
      } else if (msg.includes("invalid email") || msg.includes("valid email format")) {
        toast.error("Please enter a valid email address format.");
      } else {
        toast.error(
          `Failed to change email address: ${errorObj?.message || "An unexpected error occurred. Please try again later."}`,
        );
      }
    } finally {
      setIsChangingEmail(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProfile || !currentUser) return;

    if (!profileForm.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setIsSavingProfile(true);

      const { error } = await supabase
        .from("users")
        .update({
          full_name: profileForm.full_name.trim(),
          phone: profileForm.phone.trim() || null,
          profile_image_id: profileForm.profile_image_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (error) {
        throw error;
      }

      await refreshUserProfile();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string } | null;
      console.error("Profile update error:", err);
      toast.error(`Failed to update profile: ${errorObj?.message || "Unknown error"}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingPassword || !currentUser) return;

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsChangingPassword(true);

      // 1. Verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect. Please try again.");
        return;
      }

      // 2. Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string } | null;
      console.error("Password change error:", err);
      toast.error(`Failed to change password: ${errorObj?.message || "Unknown error"}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#186a42]" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-gray-600 mb-6">
          You must be logged in to view and manage your administrator account.
        </p>
        <button
          onClick={() => navigate({ to: "/admin/login" })}
          className="px-6 py-2.5 bg-[#186a42] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#125333] transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const memberSince = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Active Member";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <AdminPageHeader
        title="My Account"
        description="Manage your administrator profile, contact details, and account security credentials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Left Column: Account Profile Card ─── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-sm text-center space-y-6">
            {/* Avatar */}
            <div className="relative inline-block mx-auto">
              {currentUser.profile_image_url ? (
                <img
                  src={currentUser.profile_image_url}
                  alt={currentUser.full_name || "Profile"}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg mx-auto ring-2 ring-[#186a42]/20"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#186a42]/10 text-[#186a42] flex items-center justify-center border-4 border-white shadow-lg mx-auto ring-2 ring-[#186a42]/20">
                  <User className="w-14 h-14" />
                </div>
              )}
              <span
                className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 rounded-full text-white ring-2 ring-white"
                title="Active Account"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Basic Info */}
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-gray-900">
                {currentUser.full_name || "Administrator"}
              </h2>
              <p className="text-xs text-gray-500 font-medium truncate max-w-full">
                {currentUser.email}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gray-100">
              <AdminBadge status="Active" />
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#186a42]/10 text-[#186a42]">
                <Shield className="w-3.5 h-3.5" />
                {currentUser.role_name || "Staff Admin"}
              </span>
            </div>

            {/* Details List */}
            <div className="pt-4 border-t border-gray-100 space-y-3 text-left text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="text-gray-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email:
                </span>
                <span className="font-semibold text-gray-900 truncate max-w-[180px]">
                  {currentUser.email}
                </span>
              </div>

              {currentUser.phone && (
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-gray-400 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone:
                  </span>
                  <span className="font-semibold text-gray-900">{currentUser.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-gray-600">
                <span className="text-gray-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Joined:
                </span>
                <span className="font-semibold text-gray-900">{memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Edit Forms ─── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Personal Information & Profile Photo */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-[#186a42]/10 text-[#186a42] rounded-2xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500">
                  Update your contact details and upload a profile photo.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Image Upload */}
              <AdminImageUpload
                label="Profile Photo"
                description="Upload an official avatar photo (PNG, JPG, max 10MB)"
                value={profileForm.profile_image_id}
                imageUrl={profileForm.profile_image_url}
                onChange={(media) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    profile_image_id: media?.id ?? null,
                    profile_image_url: media?.file_url ?? null,
                  }))
                }
                disabled={isSavingProfile}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="e.g. Dr. Abebe Bekele"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="e.g. +251 91 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Managed by university identity governance.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Assigned Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.role_name || "Administrator"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Roles are assigned by the Super Administrator.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-all"
                >
                  {isSavingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Change Email Address */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Change Email Address</h3>
                <p className="text-xs text-gray-500">
                  Update your authentication and administrative notification email address.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangeEmail} className="space-y-5">
              {/* Current Email (Read-Only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Current Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* New Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  New Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                    placeholder="Enter your new email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Current Password for Confirmation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Current Password (for confirmation) *
                </label>
                <div className="relative">
                  <input
                    type={showEmailPassword ? "text" : "password"}
                    required
                    value={emailForm.currentPassword}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter your current password to confirm"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showEmailPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Changing your email address requires re-authentication with your current password.
                  If confirmation is enabled, a verification link will be sent to the new address.
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isChangingEmail}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-all"
                >
                  {isChangingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  Change Email Address
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Security & Password */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Security & Password</h3>
                <p className="text-xs text-gray-500">
                  Update your authentication password to ensure account security.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter your current password"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      placeholder="Minimum 8 characters"
                      className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      placeholder="Re-enter new password"
                      className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#186a42] shrink-0 mt-0.5" />
                <span>
                  Passwords must contain at least 8 characters. We recommend a mix of uppercase
                  letters, numbers, and symbols.
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-all"
                >
                  {isChangingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
