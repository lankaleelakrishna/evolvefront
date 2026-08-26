import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import "./SecurityLogs.css";

import axios from "axios";

const SecurityLogs = () => {
  const [search, setSearch] =
    useState("");

  const [logs, setLogs] =
    useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/security-logs/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = (
        res.data || []
      ).map((log) => ({
        id: log.id,
        action: log.action,
        actor:
          log.actor || "ANONYMOUS",
        target: log.target,
        status: log.status,
        time: log.createdAt,
      }));

      setLogs(formatted);
    } catch (error) {
      console.error(
        "Error fetching logs:",
        error
      );
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      `${log.action} ${log.actor} ${log.target} ${log.status} ${log.time}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [logs, search]);

  const clearLogs = async () => {
    const confirmClear =
      window.confirm(
        "Clear all logs?"
      );

    if (!confirmClear) return;

    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        "http://localhost:8080/api/security-logs/clear",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs([]);
    } catch (error) {
      console.error(
        "Clear logs error:",
        error
      );
    }
  };

  return (
    <div className="securityLogsCard">
      <div className="securityLogsHeader">
        <h2>Security Logs</h2>

        <div className="securityLogsActions">
          <input
            type="text"
            placeholder="Search logs..."
            className="securityLogsSearchInput"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <button
            className="securityLogsDangerBtn"
            onClick={clearLogs}
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div className="securityLogsTableWrapper">
        <table className="securityLogsTable">
          <thead>
            <tr>
              <th>Action</th>
              <th>Actor</th>
              <th>Target</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>

                  <td>{log.actor}</td>

                  <td>{log.target}</td>

                  <td>
                    <span
                      className={`securityLogsStatus ${log.status.toLowerCase()}`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td>
                    {log.time
                      ? new Date(
                          log.time
                        ).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="securityLogsNoData"
                >
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityLogs;