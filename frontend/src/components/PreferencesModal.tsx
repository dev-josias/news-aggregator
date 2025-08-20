import type { ModalProps } from "../types";
import { categories, sources } from "../data";

const PreferencesModal = ({ onClose }: ModalProps) => {
  const handleSave = () => {
    // Save preferences logic
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <h2 className="modal-title">Preferences</h2>
        <div className="preferences-grid">
          <div className="preference-group">
            <h3 className="preference-title">Preferred Categories</h3>
            <div className="checkbox-group">
              {categories.slice(1).map((cat) => (
                <label key={cat} className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="preference-group">
            <h3 className="preference-title">Preferred Sources</h3>
            <div className="checkbox-group">
              {sources.slice(1).map((source) => (
                <label key={source} className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span>{source}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="form-footer">
          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
