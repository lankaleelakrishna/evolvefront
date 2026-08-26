import React, {
  useState,
  useEffect,
} from "react";

import "./SystemSettings.css";

import axios from "axios";

const SystemSettings = () => {
  const [settings, setSettings] =
    useState({
      portalName: "",
      supportEmail: "",
      registrationMode:
        "MANUAL",
      sessionTimeout: 30,
      maintenanceMode: false,
      userRegistration: true,
      employerApproval: true,
      autoBackup: true,
    });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:8080/api/system-settings"
          );

        setSettings({
          portalName:
            res.data.portalName ||
            "",

          supportEmail:
            res.data
              .supportEmail || "",

          registrationMode:
            res.data
              .registrationMode ||
            "MANUAL",

          sessionTimeout:
            res.data
              .sessionTimeout ||
            30,

          maintenanceMode:
            res.data
              .maintenanceMode ??
            false,

          userRegistration:
            res.data
              .userRegistration ??
            true,

          employerApproval:
            res.data
              .employerApproval ??
            true,

          autoBackup:
            res.data
              .autoBackup ??
            true,
        });
      } catch (error) {
        console.error(
          "Error fetching settings:",
          error
        );
      }
    };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : name ===
            "sessionTimeout"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/system-settings",
        settings
      );

      alert(
        "Settings saved successfully"
      );
    } catch (error) {
      console.error(
        "Save settings error:",
        error
      );

      alert(
        "Failed to save settings"
      );
    }
  };

  return (
    <div className="systemSettingsGrid">
      <div className="systemSettingsCard">
        <div className="systemSettingsHeader">
          <h2>
            System Settings
          </h2>
        </div>

        <form
          className="systemSettingsForm"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="portalName"
            value={
              settings.portalName
            }
            onChange={
              handleChange
            }
            placeholder="Portal Name"
          />

          <input
            type="email"
            name="supportEmail"
            value={
              settings.supportEmail
            }
            onChange={
              handleChange
            }
            placeholder="Support Email"
          />

          <select
            name="registrationMode"
            value={
              settings.registrationMode
            }
            onChange={
              handleChange
            }
          >
            <option value="MANUAL">
              Manual
            </option>

            <option value="AUTOMATIC">
              Automatic
            </option>
          </select>

          <input
            type="number"
            name="sessionTimeout"
            value={
              settings.sessionTimeout
            }
            onChange={
              handleChange
            }
            placeholder="Session Timeout"
          />

          <div className="systemSettingsFormActions">
            <button
              type="submit"
              className="systemSettingsSaveBtn"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>

      <div className="systemSettingsCard">
        <div className="systemSettingsHeader">
          <h2>
            Platform Controls
          </h2>
        </div>

        <div className="systemSettingsToggleList">
          <label className="systemSettingsToggleRow">
            <span>
              Maintenance Mode
            </span>

            <input
              type="checkbox"
              name="maintenanceMode"
              checked={
                settings.maintenanceMode
              }
              onChange={
                handleChange
              }
            />
          </label>

          <label className="systemSettingsToggleRow">
            <span>
              User Registration
            </span>

            <input
              type="checkbox"
              name="userRegistration"
              checked={
                settings.userRegistration
              }
              onChange={
                handleChange
              }
            />
          </label>

          <label className="systemSettingsToggleRow">
            <span>
              Employer Approval
            </span>

            <input
              type="checkbox"
              name="employerApproval"
              checked={
                settings.employerApproval
              }
              onChange={
                handleChange
              }
            />
          </label>

          <label className="systemSettingsToggleRow">
            <span>
              Auto Backup
            </span>

            <input
              type="checkbox"
              name="autoBackup"
              checked={
                settings.autoBackup
              }
              onChange={
                handleChange
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;