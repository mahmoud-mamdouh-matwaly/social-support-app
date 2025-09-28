import { Check, Edit3, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import Textarea from "./Textarea";

type AISuggestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  suggestion: string;
  isLoading: boolean;
  error?: string;
  fieldLabel: string;
};

const AISuggestionModal = ({
  isOpen,
  onClose,
  onAccept,
  suggestion,
  isLoading,
  error,
  fieldLabel,
}: AISuggestionModalProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [editedSuggestion, setEditedSuggestion] = useState(suggestion);
  const [isEditing, setIsEditing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update edited suggestion when suggestion changes
  useEffect(() => {
    setEditedSuggestion(suggestion);
    setIsEditing(false);
  }, [suggestion]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleAccept = () => {
    onAccept(editedSuggestion);
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleDiscard = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`
            relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all
            ${isRTL ? "text-right" : "text-left"}
          `}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
              {t("aiSuggestion.title", { field: fieldLabel })}
            </h3>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t("common.actions.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className={`${isRTL ? "mr-3" : "ml-3"} text-gray-600`}>{t("aiSuggestion.generating")}</span>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="text-red-800">
                  <strong>{t("aiSuggestion.error")}:</strong> {error}
                </div>
              </div>
            )}

            {!isLoading && !error && suggestion && (
              <>
                <p className="text-sm text-gray-600 mb-4">{t("aiSuggestion.description")}</p>

                {isEditing ? (
                  <Textarea
                    ref={textareaRef}
                    label={t("aiSuggestion.editLabel")}
                    value={editedSuggestion}
                    onChange={(e) => setEditedSuggestion(e.target.value)}
                    rows={6}
                    maxLength={1000}
                    showCharCount
                    fullWidth
                    className="mb-4"
                    aria-label={t("aiSuggestion.editLabel")}
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 mb-4">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{editedSuggestion}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          {!isLoading && !error && suggestion && (
            <div className={`flex flex-wrap gap-3 ${isRTL ? "justify-start" : "justify-end"}`}>
              {isEditing ? (
                <Button
                  onClick={handleSaveEdit}
                  variant="primary"
                  size="sm"
                  icon={<Check className="h-4 w-4" />}
                  iconPosition={isRTL ? "right" : "left"}
                >
                  {t("aiSuggestion.saveEdit")}
                </Button>
              ) : (
                <>
                  <Button onClick={handleDiscard} variant="outline" size="sm">
                    {t("aiSuggestion.discard")}
                  </Button>

                  <Button
                    onClick={handleEdit}
                    variant="secondary"
                    size="sm"
                    icon={<Edit3 className="h-4 w-4" />}
                    iconPosition={isRTL ? "right" : "left"}
                  >
                    {t("aiSuggestion.edit")}
                  </Button>

                  <Button
                    onClick={handleAccept}
                    variant="primary"
                    size="sm"
                    icon={<Check className="h-4 w-4" />}
                    iconPosition={isRTL ? "right" : "left"}
                  >
                    {t("aiSuggestion.accept")}
                  </Button>
                </>
              )}
            </div>
          )}

          {error && (
            <div className={`flex justify-end`}>
              <Button onClick={onClose} variant="outline" size="sm">
                {t("common.actions.close")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionModal;
