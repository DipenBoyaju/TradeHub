import { Loader2, Mail, MailCheck, X } from "lucide-react";

interface VerificationModalProps {
  unverifiedEmail: string;
  isResending: boolean;
  resendStatus: {
    type: "success" | "error";
    message: string;
  } | null;
  setShowUnverifiedModal: (open: boolean) => void;
  handleResend: () => void;
}


export default function VerificationModal({ unverifiedEmail,
  isResending,
  resendStatus,
  setShowUnverifiedModal,
  handleResend, }: VerificationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-zinc-100">
        <button
          onClick={() => setShowUnverifiedModal(false)}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 rounded-lg p-1"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Mail className="h-6 w-6" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-zinc-900">Verify Your Email</h3>
          <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
            Your email address <span className="font-semibold text-zinc-800">{unverifiedEmail}</span> is not verified yet. Please check your inbox for the activation link.
          </p>

          {resendStatus && (
            <div
              className={`mt-4 rounded-lg p-2.5 text-xs font-medium ${resendStatus.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {resendStatus.message}
            </div>
          )}

          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors h-12"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Resending email...</span>
                </>
              ) : (
                <>
                  <MailCheck className="h-4 w-4" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowUnverifiedModal(false)}
              className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 h-12"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}