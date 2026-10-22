import React, { useState, useEffect } from "react";
import "./App.css";

/* =========================================================
   INITIAL EMPLOYEE DATA
========================================================= */



/* =========================================================
   INITIAL ATTENDANCE DATA
========================================================= */



/* =========================================================
   INITIAL LEAVE DATA
========================================================= */



/* =========================================================
   APP
========================================================= */

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [loginError, setLoginError] = useState("");

const login = async (username, password) => {
  try {
    const response = await fetch("https://attendance-backend-api-ivrt.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoginError(data.message || "Invalid username or password");
      return;
    }

    localStorage.setItem("token", data.token);

    setUser({
      username: data.user.username,
      role: data.user.role,
      employeeId: data.user.employeeId,
      name:
        data.user.role === "Admin"
          ? "Administrator"
          : "Arun Kumar",
    });

    setActivePage("Dashboard");
    setLoginError("");
  } catch (error) {
    setLoginError("Unable to connect to server");
  }
};

  const logout = () => {
    setUser(null);
    setActivePage("Dashboard");
  };

  if (!user) {
    return (
      <LoginPage
        onLogin={login}
        error={loginError}
      />
    );
  }

  return (
    <MainApplication
      user={user}
      activePage={activePage}
      setActivePage={setActivePage}
      logout={logout}
    />
  );
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function LoginPage({
  onLogin,
  error,
}) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const submit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">

          <div className="login-logo">
            A
          </div>

          <div>
            <h1>EMPLOYEE ATTENDANCE MANAGEMENT SYSTEM</h1>
          </div>

        </div>

        <div className="login-content">

          <h2>
            Manage attendance,
            <br />
            leave requests & employees records 
          </h2>

          <div className="login-features">

            <div>
              <span>✓</span>
              Attendance Tracking
            </div>

            <div>
              <span>✓</span>
              Leave Management
            </div>

            <div>
              <span>✓</span>
              Employee Records
            </div>

            <div>
              <span>✓</span>
              Role-Based Access
            </div>

          </div>

        </div>

      </div>

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={submit}
        >

          <div className="login-heading">
            <h2>Welcome!</h2>

            <p>
              Sign in to access your account
            </p>
          </div>

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
          >
            Sign In →
          </button>

        </form>

      </div>

    </div>
  );
}

/* =========================================================
   MAIN APPLICATION
========================================================= */

function MainApplication({
  user,
  activePage,
  setActivePage,
  logout,
}) {
  const [employees, setEmployees] =
  useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [leaveRequests, setLeaveRequests] =
    useState([]);

  const [modal, setModal] =
    useState(null);

  const [successModal, setSuccessModal] =
    useState(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const isAdmin =
    user.role === "Admin";

    useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://attendance-backend-api-ivrt.onrender.com/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmployees(data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch employees:",
        error
      );
    }
  };

  fetchEmployees();
}, []);

useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://attendance-backend-api-ivrt.onrender.com/api/attendance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const formattedAttendance = data.map((record) => ({
          id: record._id,
          employeeId: record.employeeId,
          employee: record.employeeName,
          department: record.department,
          date: record.date.split("T")[0],
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          status: record.status,
        }));

        setAttendance(formattedAttendance);
      }
    } catch (error) {
      console.error(
        "Failed to fetch attendance:",
        error
      );
    }
  };

  fetchAttendance();
}, []);

useEffect(() => {
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://attendance-backend-api-ivrt.onrender.com/api/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const formattedLeaves = data.map((leave) => ({
          id: leave._id,
          employeeId: leave.employeeId,
          employee: leave.employeeName,
          type: leave.leaveType,
          from: leave.fromDate.split("T")[0],
          to: leave.toDate.split("T")[0],
          reason: leave.reason,
          status: leave.status,
        }));

        setLeaveRequests(formattedLeaves);
      }
    } catch (error) {
      console.error(
        "Failed to fetch leaves:",
        error
      );
    }
  };

  fetchLeaves();
}, []);

  /* =======================================================
     SUCCESS POPUP
  ======================================================= */

  const showSuccess = (
    title,
    message
  ) => {
    setSuccessModal({
      title,
      message,
    });
  };

  /* =======================================================
     ADD EMPLOYEE
  ======================================================= */

  const addEmployee = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://attendance-backend-api-ivrt.onrender.com/api/employees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: `EMP${String(employees.length + 1).padStart(3, "0")}`,
          name: data.name,
          department: data.department,
          email: data.email,
          phone: data.phone,
          joiningDate: data.joiningDate,
          status: "Active",
        }),
      }
    );

    const newEmployee = await response.json();

    if (!response.ok) {
      console.error(newEmployee);
      return;
    }

    setEmployees((previous) => [
      ...previous,
      newEmployee,
    ]);

    setModal(null);

    showSuccess(
      "Employee Added Successfully!",
      `${data.name} has been added to the employee records.`
    );
  } catch (error) {
    console.error("Failed to add employee:", error);
  }
};

  /* =======================================================
     MARK ATTENDANCE
  ======================================================= */

 const saveAttendance = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const employee = employees.find(
      (emp) => emp.employeeId === data.employeeId
    );

    if (!employee) {
      alert("Employee not found.");
      return;
    }

    const response = await fetch(
      "https://attendance-backend-api-ivrt.onrender.com/api/attendance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          employeeName: employee.name,
          department: employee.department,
          date: data.date,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          status: data.status,
        }),
      }
    );

    const newAttendance = await response.json();

    if (!response.ok) {
      console.error(newAttendance);
      alert("Failed to save attendance.");
      return;
    }

    const formattedAttendance = {
      id: newAttendance._id,
      employeeId: newAttendance.employeeId,
      employee: newAttendance.employeeName,
      department: newAttendance.department,
      date: newAttendance.date.split("T")[0],
      checkIn: newAttendance.checkIn,
      checkOut: newAttendance.checkOut,
      status: newAttendance.status,
    };

    setAttendance((previous) => [
      formattedAttendance,
      ...previous,
    ]);

    setModal(null);

    showSuccess(
      "Attendance Saved Successfully!",
      `${employee.name}'s attendance has been recorded successfully.`
    );
  } catch (error) {
    console.error(
      "Failed to save attendance:",
      error
    );
    alert("Unable to connect to server.");
  }
};

  /* =======================================================
     APPLY LEAVE
  ======================================================= */
const applyLeave = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const employee = employees.find(
      (emp) => emp.employeeId === data.employeeId
    );

    if (!employee) {
      alert("Employee not found.");
      return;
    }

    const response = await fetch(
      "https://attendance-backend-api-ivrt.onrender.com/api/leaves",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          employeeName: employee.name,
          leaveType: data.type,
          fromDate: data.from,
          toDate: data.to,
          reason: data.reason,
          status: "Pending",
        }),
      }
    );

    const newLeave = await response.json();

    if (!response.ok) {
      console.error(newLeave);
      alert("Failed to submit leave request.");
      return;
    }

    const formattedLeave = {
      id: newLeave._id,
      employeeId: newLeave.employeeId,
      employee: newLeave.employeeName,
      type: newLeave.leaveType,
      from: newLeave.fromDate.split("T")[0],
      to: newLeave.toDate.split("T")[0],
      reason: newLeave.reason,
      status: newLeave.status,
    };

    setLeaveRequests((previous) => [
      formattedLeave,
      ...previous,
    ]);

    setModal(null);

    showSuccess(
      "Leave Applied Successfully!",
      "Your leave request has been submitted successfully and is now pending approval."
    );
  } catch (error) {
    console.error(
      "Failed to apply leave:",
      error
    );

    alert("Unable to connect to server.");
  }
};

  /* =======================================================
     APPROVE
  ======================================================= */

 const approveRequest = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://attendance-backend-api-ivrt.onrender.com/api/leaves/${id}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedLeave = await response.json();

    if (!response.ok) {
      console.error(updatedLeave);
      alert("Failed to approve leave request.");
      return;
    }

    setLeaveRequests((previous) =>
      previous.map((request) =>
        request.id === updatedLeave._id
          ? {
              ...request,
              status: updatedLeave.status,
            }
          : request
      )
    );

    setModal(null);
    setSelectedRequest(null);

    showSuccess(
      "Leave Approved Successfully!",
      "The leave request has been approved and the record has been updated."
    );
  } catch (error) {
    console.error(
      "Failed to approve leave:",
      error
    );

    alert("Unable to connect to server.");
  }
};
  /* =======================================================
     REJECT
  ======================================================= */

  const rejectRequest = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://attendance-backend-api-ivrt.onrender.com/api/leaves/${id}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedLeave = await response.json();

    if (!response.ok) {
      console.error(updatedLeave);
      alert("Failed to reject leave request.");
      return;
    }

    setLeaveRequests((previous) =>
      previous.map((request) =>
        request.id === updatedLeave._id
          ? {
              ...request,
              status: updatedLeave.status,
            }
          : request
      )
    );

    setModal(null);
    setSelectedRequest(null);

    showSuccess(
      "Leave Rejected Successfully!",
      "The leave request has been rejected and the record has been updated."
    );
  } catch (error) {
    console.error(
      "Failed to reject leave:",
      error
    );

    alert("Unable to connect to server.");
  }
};

  /* =======================================================
     DASHBOARD
  ======================================================= */

  const renderPage = () => {

    if (
      activePage === "Employees" &&
      isAdmin
    ) {
      return (
        <EmployeesPage
          employees={employees}
          onAdd={() =>
            setModal(
              "addEmployee"
            )
          }
          onView={(employee) => {
            setSelectedEmployee(
              employee
            );

            setModal(
              "viewEmployee"
            );
          }}
        />
      );
    }

    if (
      activePage === "Attendance"
    ) {
      return (
        <AttendancePage
          user={user}
          employees={employees}
          attendance={attendance}
          onMark={() =>
            setModal(
              "markAttendance"
            )
          }
        />
      );
    }

    if (activePage === "Leave") {
      return (
        <LeavePage
          user={user}
          employees={employees}
          requests={leaveRequests}
          onApply={() =>
            setModal(
              "applyLeave"
            )
          }
        />
      );
    }

    if (
      activePage === "Approvals" &&
      isAdmin
    ) {
      return (
        <ApprovalsPage
          requests={leaveRequests}
          onReview={(request) => {
            setSelectedRequest(
              request
            );

            setModal(
              "approval"
            );
          }}
        />
      );
    }

    if (
      activePage === "Reports"
    ) {
      return (
        <ReportsPage
          attendance={attendance}
          requests={leaveRequests}
          employees={employees}
          onExport={() =>
            setModal(
              "exportReport"
            )
          }
        />
      );
    }

    return (
      <Dashboard
        user={user}
        employees={employees}
        attendance={attendance}
        requests={leaveRequests}
        setActivePage={
          setActivePage
        }
      />
    );
  };

  return (
    <div className="app">

      <Sidebar
        user={user}
        activePage={activePage}
        setActivePage={
          setActivePage
        }
        logout={logout}
      />

      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>
              {activePage}
            </h1>

            <p>
              Employee Leave & Attendance
              Management System
            </p>
          </div>

          <div className="topbar-right">

            <div className="notification">
              🔔
            </div>

            <div className="profile">

              <div className="avatar">
                {getInitials(
                  user.name
                )}
              </div>

              <div>

                <strong>
                  {user.name}
                </strong>

                <span>
                  {user.role}
                </span>

              </div>

            </div>

          </div>

        </header>

        {renderPage()}

      </main>

      {/* ===================================================
          MODALS
      =================================================== */}

      {modal ===
        "addEmployee" && (
        <AddEmployeeModal
          onClose={() =>
            setModal(null)
          }
          onSave={
            addEmployee
          }
        />
      )}

      {modal ===
        "viewEmployee" && (
        <ViewEmployeeModal
          employee={
            selectedEmployee
          }
          onClose={() => {
            setModal(null);
            setSelectedEmployee(
              null
            );
          }}
        />
      )}

      {modal ===
        "markAttendance" && (
        <MarkAttendanceModal
          employees={employees}
          onClose={() =>
            setModal(null)
          }
          onSave={
            saveAttendance
          }
        />
      )}

      {modal ===
        "applyLeave" && (
        <ApplyLeaveModal
          user={user}
          employees={employees}
          onClose={() =>
            setModal(null)
          }
          onSave={
            applyLeave
          }
        />
      )}

      {modal ===
        "approval" && (
        <ApprovalModal
          request={
            selectedRequest
          }
          onClose={() => {
            setModal(null);
            setSelectedRequest(
              null
            );
          }}
          onApprove={
            approveRequest
          }
          onReject={
            rejectRequest
          }
        />
      )}

      {modal ===
        "exportReport" && (
        <ExportModal
  employees={employees}
  onClose={() =>
    setModal(null)
  }
          onSuccess={() =>
            showSuccess(
              "Report Generated Successfully!",
              "The selected report has been generated successfully."
            )
          }
        />
      )}

      {/* ===================================================
          SUCCESS POPUP
      =================================================== */}

      {successModal && (
        <SuccessModal
          title={
            successModal.title
          }
          message={
            successModal.message
          }
          onClose={() =>
            setSuccessModal(null)
          }
        />
      )}

    </div>
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  user,
  activePage,
  setActivePage,
  logout,
}) {
  const adminMenu = [
    ["Dashboard", "⌂"],
    ["Employees", "♙"],
    ["Attendance", "▣"],
    ["Leave", "◫"],
    ["Approvals", "✓"],
    ["Reports", "▥"],
  ];

  const employeeMenu = [
    ["Dashboard", "⌂"],
    ["Attendance", "▣"],
    ["Leave", "◫"],
    ["Reports", "▥"],
  ];

  const menu =
    user.role === "Admin"
      ? adminMenu
      : employeeMenu;

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          A
        </div>

        <div>
          <h2>
            Attendance
          </h2>

          <span>
            Management System
          </span>
        </div>

      </div>

      <div className="role-display">

        <span>
          LOGGED IN AS
        </span>

        <strong>
          {user.role}
        </strong>

      </div>

      <div className="menu-title">
        MAIN MENU
      </div>

      <nav>

        {menu.map(
          ([name, icon]) => (
            <button
              key={name}
              className={`menu-item ${
                activePage === name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(
                  name
                )
              }
            >

              <span className="menu-icon">
                {icon}
              </span>

              {name}

            </button>
          )
        )}

      </nav>

      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="online-dot"></span>

          System Online

        </div>

        <button
          className="logout"
          onClick={logout}
        >
          ↪ Logout
        </button>

      </div>

    </aside>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  user,
  employees,
  attendance,
  requests,
  setActivePage,
}) {
  const totalEmployees =
    employees.length;

  const present =
    attendance.filter(
      (item) =>
        item.status ===
        "Present" ||
        item.status ===
        "Late"
    ).length;

  const absent =
    attendance.filter(
      (item) =>
        item.status ===
        "Absent"
    ).length;

  const onLeave =
    attendance.filter(
      (item) =>
        item.status ===
        "On Leave"
    ).length;

  const pending =
    requests.filter(
      (request) =>
        request.status ===
        "Pending"
    ).length;

  const attendanceBase =
  user.role === "Admin"
    ? totalEmployees
    : 1;

const attendancePercentage =
  attendanceBase
    ? Math.round(
        (present /
          attendanceBase) *
          100
      )
    : 0;

  return (
    <section className="page">

      <div className="welcome-card">

        <div>

          <span className="welcome-label">
            WELCOME
          </span>

          <h2>
            Good Morning,{" "}
            {user.role === "Admin"
              ? "Admin"
              : user.name}{" "}
            👋
          </h2>

          <p>
            Here's today's employee
            attendance and leave overview.
          </p>

        </div>

        <div className="date-box">

          <span>
            Today
          </span>

          <strong>
             {new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
          </strong>

        </div>

      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Employees"
          value={
            user.role ===
            "Admin"
              ? totalEmployees
              : "120"
          }
          change={
            user.role ===
            "Admin"
              ? "Current records"
              : "+8 this month"
          }
          icon="♙"
        />

        <StatCard
          title="Present Today"
          value={present}
          change={`${attendancePercentage}% attendance`}
          icon="✓"
        />

        <StatCard
          title="Absent Today"
          value={absent}
          change="Current attendance"
          icon="×"
        />

        <StatCard
          title="On Leave"
          value={onLeave}
          change={`${pending} pending requests`}
          icon="◫"
        />

      </div>

      <div className="dashboard-grid">

        <div className="card">

          <div className="card-header">

            <div>

              <h3>
                Attendance Overview
              </h3>

              <p>
                Today's attendance status
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                setActivePage(
                  "Attendance"
                )
              }
            >
              View Details →
            </button>

          </div>

          <div className="attendance-chart">

            <div className="donut">

              <div className="donut-inner">

                <strong>
                  {attendancePercentage}%
                </strong>

                <span>
                  Present
                </span>

              </div>

            </div>

            <div className="chart-details">

              <Legend
                type="present"
                value={
                  present
                }
                label="Present"
              />

              <Legend
                type="absent"
                value={
                  absent
                }
                label="Absent"
              />

              <Legend
                type="leave"
                value={
                  onLeave
                }
                label="On Leave"
              />

            </div>

          </div>

        </div>

        <div className="card">

          <div className="card-header">

            <div>

              <h3>
                Quick Actions
              </h3>

              <p>
                Common administrative tasks
              </p>

            </div>

          </div>

          {user.role ===
            "Admin" && (
            <ActionButton
              icon="♙"
              title="Manage Employees"
              subtitle="View employee records"
              onClick={() =>
                setActivePage(
                  "Employees"
                )
              }
            />
          )}

          <ActionButton
            icon="▣"
            title="Track Attendance"
            subtitle="View today's attendance"
            onClick={() =>
              setActivePage(
                "Attendance"
              )
            }
          />

          <ActionButton
            icon="◫"
            title="Leave Management"
            subtitle="Manage leave requests"
            onClick={() =>
              setActivePage(
                "Leave"
              )
            }
          />

          {user.role ===
            "Admin" && (
            <ActionButton
              icon="✓"
              title="Leave Approvals"
              subtitle="Review pending requests"
              onClick={() =>
                setActivePage(
                  "Approvals"
                )
              }
            />
          )}

        </div>

      </div>

      <div className="card recent-card">

        <div className="card-header">

          <div>

            <h3>
              Recent Leave Requests
            </h3>

            <p>
              Latest employee leave applications
            </p>

          </div>

          <button
            className="view-button"
            onClick={() =>
              setActivePage(
                user.role ===
                  "Admin"
                  ? "Approvals"
                  : "Leave"
              )
            }
          >
            View All →
          </button>

        </div>

        <LeaveTable
          requests={
            user.role ===
            "Admin"
              ? requests.slice(
                  0,
                  5
                )
              : requests.filter(
                  (request) =>
                    request.employeeId ===
                    user.employeeId
                )
          }
        />

      </div>

    </section>
  );
}

/* =========================================================
   EMPLOYEES PAGE
========================================================= */

function EmployeesPage({
  employees,
  onAdd,
  onView,
}) {
  const [search, setSearch] =
    useState("");

  const filtered =
    employees.filter(
      (employee) =>
        employee.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        employee.id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        employee.department
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <section className="page">

      <div className="page-intro">

        <div>

          <h2>
            Employee Records
          </h2>

          <p>
            Manage employee information
            and records.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={onAdd}
        >
          + Add Employee
        </button>

      </div>

      <div className="card">

        <div className="toolbar">

          <div className="search-box">

            🔍

            <input
              placeholder="Search employee, ID or department..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <table>

          <thead>

            <tr>

              <th>
                EMPLOYEE
              </th>

              <th>
                ID
              </th>

              <th>
                DEPARTMENT
              </th>

              <th>
                EMAIL
              </th>

              <th>
                STATUS
              </th>

              <th>
                ACTION
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map(
              (employee) => (
                <tr
                  key={
                    employee.id
                  }
                >

                  <td>

                    <div className="employee-name">

                      <div className="small-avatar">
                        {getInitials(
                          employee.name
                        )}
                      </div>

                      <strong>
                        {employee.name}
                      </strong>

                    </div>

                  </td>

                  <td>
                    {employee.id}
                  </td>

                  <td>
                    {employee.department}
                  </td>

                  <td>
                    {employee.email}
                  </td>

                  <td>

                    <span className="status approved">
                      {employee.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="more-button"
                      onClick={() =>
                        onView(
                          employee
                        )
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

/* =========================================================
   ATTENDANCE PAGE
========================================================= */

function AttendancePage({
  user,
  employees,
  attendance,
  onMark,
}) {
  const today = new Date()
  .toISOString()
  .split("T")[0];

const visibleAttendance =
  user.role === "Admin"
    ? attendance
    : attendance.filter(
        (record) =>
          record.employeeId ===
          user.employeeId
      );

const todayAttendance =
  visibleAttendance.filter(
    (record) =>
      record.date === today
  );

const present =
  todayAttendance.filter(
    (item) =>
      item.status === "Present" ||
      item.status === "Late"
  ).length;

const absent =
  todayAttendance.filter(
    (item) =>
      item.status === "Absent"
  ).length;

const late =
  todayAttendance.filter(
    (item) =>
      item.status === "Late"
  ).length;

const leave =
  todayAttendance.filter(
    (item) =>
      item.status === "On Leave"
  ).length;

  return (
    <section className="page">

      <div className="page-intro">

        <div>

          <h2>
            Attendance Tracking
          </h2>

          <p>
            Track and manage daily
            employee attendance.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={onMark}
        >
          + Mark Attendance
        </button>

      </div>

      <div className="attendance-stats">

        <MiniStat
          title="Present"
          value={present}
          percent="Present"
        />

        <MiniStat
          title="Absent"
          value={absent}
          percent="Absent"
        />

        <MiniStat
          title="Late"
          value={late}
          percent="Late arrivals"
        />

        <MiniStat
          title="On Leave"
          value={leave}
          percent="Leave"
        />

      </div>

      <div className="card">

        <div className="toolbar">

          <div>

            <h3>
              Attendance History
            </h3>

            <p>
              All attendance records
              entered through the system
            </p>

          </div>

          <select className="select">

            <option>
              All Departments
            </option>

            <option>
              CSE
            </option>

            <option>
              HR
            </option>

            <option>
              Finance
            </option>

            <option>
              IT
            </option>

            <option>
              Marketing
            </option>

          </select>

        </div>

        {visibleAttendance.length >
        0 ? (

          <table>

            <thead>

              <tr>

                <th>
                  EMPLOYEE
                </th>

                <th>
                  DATE
                </th>

                <th>
                  DEPARTMENT
                </th>

                <th>
                  CHECK-IN
                </th>

                <th>
                  CHECK-OUT
                </th>

                <th>
                  STATUS
                </th>

              </tr>

            </thead>

            <tbody>

              {visibleAttendance.map(
                (record) => (
                  <tr
                    key={
                      record.id
                    }
                  >

                    <td>

                      <div className="employee-name">

                        <div className="small-avatar">
                          {getInitials(
                            record.employee
                          )}
                        </div>

                        <strong>
                          {
                            record.employee
                          }
                        </strong>

                      </div>

                    </td>

                    <td>
                      {record.date}
                    </td>

                    <td>
                      {
                        record.department
                      }
                    </td>

                    <td>
                      {
                        record.checkIn
                      }
                    </td>

                    <td>
                      {
                        record.checkOut
                      }
                    </td>

                    <td>

                      <StatusBadge
                        status={
                          record.status
                        }
                      />

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        ) : (

          <div className="empty-state">
            No attendance records found.
          </div>

        )}

      </div>

    </section>
  );
}

/* =========================================================
   LEAVE PAGE
========================================================= */

function LeavePage({
  user,
  employees,
  requests,
  onApply,
}) {
  const visibleRequests =
    user.role === "Admin"
      ? requests
      : requests.filter(
          (request) =>
            request.employeeId ===
            user.employeeId
        );

  return (
    <section className="page">

      <div className="page-intro">

        <div>

          <h2>
            Leave Management
          </h2>

          <p>
            View leave balances and
            leave records.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={onApply}
        >
          + Apply Leave
        </button>

      </div>

      <div className="leave-balance-grid">

        <BalanceCard
          title="Casual Leave"
          days="8"
          total="12"
          percent="66%"
        />

        <BalanceCard
          title="Sick Leave"
          days="4"
          total="10"
          percent="40%"
        />

        <BalanceCard
          title="Earned Leave"
          days="12"
          total="15"
          percent="80%"
        />

      </div>

      <div className="card">

        <div className="card-header">

          <div>

            <h3>
              Leave Records
            </h3>

            <p>
              All submitted leave applications
            </p>

          </div>

        </div>

        <LeaveTable
          requests={
            visibleRequests
          }
        />

      </div>

    </section>
  );
}

/* =========================================================
   APPROVALS PAGE
========================================================= */

function ApprovalsPage({
  requests,
  onReview,
}) {
  const pending =
    requests.filter(
      (request) =>
        request.status ===
        "Pending"
    ).length;

  return (
    <section className="page">

      <div className="page-intro">

        <div>

          <h2>
            Leave Approvals
          </h2>

          <p>
            Review and process employee
            leave requests.
          </p>

        </div>

        <div className="pending-badge">
          {pending} Pending
        </div>

      </div>

      <div className="approval-list">

        {requests.map(
          (request) => (
            <div
              className="approval-card"
              key={request.id}
            >

              <div className="approval-person">

                <div className="large-avatar">
                  {getInitials(
                    request.employee
                  )}
                </div>

                <div>

                  <h3>
                    {
                      request.employee
                    }
                  </h3>

                  <span>
                    {request.type}
                  </span>

                </div>

              </div>

              <div className="approval-details">

                <div>

                  <small>
                    DATE
                  </small>

                  <strong>
                    {request.from} -{" "}
                    {request.to}
                  </strong>

                </div>

                <div>

                  <small>
                    REASON
                  </small>

                  <strong>
                    {request.reason}
                  </strong>

                </div>

              </div>

              <div className="approval-actions">

                <StatusBadge
                  status={
                    request.status
                  }
                />

                <button
                  className="review-button"
                  onClick={() =>
                    onReview(
                      request
                    )
                  }
                >
                  Review
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </section>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function ReportsPage({
  attendance,
  requests,
  employees,
  onExport,
}) {
  const present =
    attendance.filter(
      (item) =>
        item.status ===
          "Present" ||
        item.status ===
          "Late"
    ).length;

  const attendanceRate =
    employees.length
      ? Math.round(
          (present /
            employees.length) *
            100
        )
      : 0;

  const approved =
    requests.filter(
      (request) =>
        request.status ===
        "Approved"
    ).length;

  const pending =
    requests.filter(
      (request) =>
        request.status ===
        "Pending"
    ).length;

  const rejected =
    requests.filter(
      (request) =>
        request.status ===
        "Rejected"
    ).length;

  return (
    <section className="page">

      <div className="page-intro">

        <div>

          <h2>
            Reports
          </h2>

          <p>
            Attendance and leave
            management reports.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={onExport}
        >
          ↓ Export Report
        </button>

      </div>

      <div className="report-grid">

        <div className="card report-card">

          <h3>
            Attendance Report
          </h3>

          <div className="big-number">
            {attendanceRate}%
          </div>

          <p>
            Current attendance rate
          </p>

          <div className="bar-chart">

            <div style={{ height: "65%" }} />
            <div style={{ height: "80%" }} />
            <div style={{ height: "72%" }} />
            <div style={{ height: "90%" }} />
            <div style={{ height: "78%" }} />
            <div style={{ height: "88%" }} />
            <div style={{ height: "95%" }} />

          </div>

        </div>

        <div className="card report-card">

          <h3>
            Leave Request Summary
          </h3>

          <div className="report-row">

            <span>
              Approved
            </span>

            <strong>
              {approved}
            </strong>

          </div>

          <div className="report-row">

            <span>
              Pending
            </span>

            <strong>
              {pending}
            </strong>

          </div>

          <div className="report-row">

            <span>
              Rejected
            </span>

            <strong>
              {rejected}
            </strong>

          </div>

          <div className="report-row">

            <span>
              Total Requests
            </span>

            <strong>
              {requests.length}
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  change,
  icon,
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <span>
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <strong className="stat-value">
        {value}
      </strong>

      <small>
        {change}
      </small>

    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  title,
  value,
  percent,
}) {
  return (
    <div className="mini-stat">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {percent}
      </small>

    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function Legend({
  type,
  value,
  label,
}) {
  return (
    <div className="legend">

      <span
        className={`dot ${type}`}
      />

      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      className="action-button"
      onClick={onClick}
    >

      <span>
        {icon}
      </span>

      <div>

        <strong>
          {title}
        </strong>

        <small>
          {subtitle}
        </small>

      </div>

      →

    </button>
  );
}

/* =========================================================
   BALANCE CARD
========================================================= */

function BalanceCard({
  title,
  days,
  total,
  percent,
}) {
  return (
    <div className="balance-card">

      <span>
        {title}
      </span>

      <strong>
        {days}
      </strong>

      <small>
        Days remaining
      </small>

      <div className="progress">

        <div
          style={{
            width: percent,
          }}
        />

      </div>

      <small>
        {days} of {total} days available
      </small>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {
  let className =
    "pending";

  if (
    status ===
    "Approved"
  ) {
    className =
      "approved";
  }

  if (
    status ===
      "Rejected" ||
    status ===
      "Absent"
  ) {
    className =
      "rejected";
  }

  if (
    status ===
    "On Leave"
  ) {
    className =
      "leave-status";
  }

  if (
    status ===
    "Late"
  ) {
    className =
      "pending";
  }

  return (
    <span
      className={`status ${className}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   LEAVE TABLE
========================================================= */

function LeaveTable({
  requests,
}) {
  if (
    requests.length ===
    0
  ) {
    return (
      <div className="empty-state">
        No leave records found.
      </div>
    );
  }

  return (
    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>
              EMPLOYEE
            </th>

            <th>
              LEAVE TYPE
            </th>

            <th>
              FROM
            </th>

            <th>
              TO
            </th>

            <th>
              REASON
            </th>

            <th>
              STATUS
            </th>

          </tr>

        </thead>

        <tbody>

          {requests.map(
            (request) => (
              <tr
                key={
                  request.id
                }
              >

                <td>

                  <strong>
                    {
                      request.employee
                    }
                  </strong>

                </td>

                <td>
                  {request.type}
                </td>

                <td>
                  {request.from}
                </td>

                <td>
                  {request.to}
                </td>

                <td>
                  {request.reason}
                </td>

                <td>

                  <StatusBadge
                    status={
                      request.status
                    }
                  />

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

/* =========================================================
   BASE MODAL
========================================================= */

function Modal({
  title,
  subtitle,
  children,
  onClose,
}) {
  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <div>

            <h2>
              {title}
            </h2>

            {subtitle && (
              <p>
                {subtitle}
              </p>
            )}

          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}

/* =========================================================
   ADD EMPLOYEE MODAL
========================================================= */

function AddEmployeeModal({
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState({
      name: "",
      department: "",
      email: "",
      phone: "",
      joiningDate: "",
    });

  const update = (
    field,
    value
  ) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.department ||
      !form.email
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    onSave(form);
  };

  return (
    <Modal
      title="Add New Employee"
      subtitle="Enter employee information"
      onClose={onClose}
    >

      <form
        className="modal-form"
        onSubmit={submit}
      >

        <div className="form-grid">

          <FormField
            label="Full Name *"
            placeholder="Enter full name"
            value={form.name}
            onChange={(value) =>
              update(
                "name",
                value
              )
            }
          />

          <div className="form-group">

            <label>
              Department *
            </label>

            <select
              value={
                form.department
              }
              onChange={(e) =>
                update(
                  "department",
                  e.target.value
                )
              }
            >

              <option value="">
                Select department
              </option>

              <option>
                CSE
              </option>

              <option>
                IT
              </option>

              <option>
                HR
              </option>

              <option>
                Finance
              </option>

              <option>
                Marketing
              </option>

            </select>

          </div>

          <FormField
            label="Email *"
            type="email"
            placeholder="employee@company.com"
            value={form.email}
            onChange={(value) =>
              update(
                "email",
                value
              )
            }
          />

          <FormField
            label="Phone Number"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(value) =>
              update(
                "phone",
                value
              )
            }
          />

          <div className="form-group full">

            <label>
              Joining Date
            </label>

            <input
              type="date"
              value={
                form.joiningDate
              }
              onChange={(e) =>
                update(
                  "joiningDate",
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Add Employee
          </button>

        </div>

      </form>

    </Modal>
  );
}

/* =========================================================
   VIEW EMPLOYEE MODAL
========================================================= */

function ViewEmployeeModal({
  employee,
  onClose,
}) {
  if (!employee) {
    return null;
  }

  return (
    <Modal
      title="Employee Details"
      subtitle="Employee record information"
      onClose={onClose}
    >

      <div className="employee-profile">

        <div className="profile-large">
          {getInitials(
            employee.name
          )}
        </div>

        <h3>
          {employee.name}
        </h3>

        <span>
          {employee.id}
        </span>

      </div>

      <div className="detail-grid">

        <Detail
          label="Department"
          value={
            employee.department
          }
        />

        <Detail
          label="Status"
          value={
            employee.status
          }
        />

        <Detail
          label="Email"
          value={
            employee.email
          }
        />

        <Detail
          label="Phone"
          value={
            employee.phone
          }
        />

        <Detail
          label="Joining Date"
          value={
            formatDate(
              employee.joiningDate
            )
          }
        />

      </div>

      <div className="modal-actions">

        <button
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </Modal>
  );
}

/* =========================================================
   MARK ATTENDANCE MODAL
========================================================= */

function MarkAttendanceModal({
  employees,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState({
      employeeId: "",
      date: "",
      status: "Present",
      checkIn: "",
      checkOut: "",
    });

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.employeeId ||
      !form.date
    ) {
      alert(
        "Please select employee and date."
      );
      return;
    }

    onSave(form);
  };

  return (
    <Modal
      title="Mark Attendance"
      subtitle="Record employee attendance"
      onClose={onClose}
    >

      <form
        className="modal-form"
        onSubmit={submit}
      >

        <div className="form-group">

          <label>
            Employee *
          </label>

          <select
            value={
              form.employeeId
            }
            onChange={(e) =>
              setForm({
                ...form,
                employeeId:
                  e.target.value,
              })
            }
          >

            <option value="">
              Select employee
            </option>

            {employees.map(
              (employee) => (
                <option
                  key={
                    employee.employeeId
                  }
                  value={
                    employee.employeeId
                  }
                >
                  {
                    employee.name
                  }
                </option>
              )
            )}

          </select>

        </div>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Date *
            </label>

            <input
              type="date"
              value={
                form.date
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  date:
                    e.target.value,
                })
              }
            />

          </div>

          <div className="form-group">

            <label>
              Status *
            </label>

            <select
              value={
                form.status
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  status:
                    e.target.value,
                })
              }
            >

              <option>
                Present
              </option>

              <option>
                Absent
              </option>

              <option>
                Late
              </option>

              <option>
                On Leave
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>
              Check-in Time
            </label>

            <input
              type="time"
              value={
                form.checkIn
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  checkIn:
                    e.target.value,
                })
              }
            />

          </div>

          <div className="form-group">

            <label>
              Check-out Time
            </label>

            <input
              type="time"
              value={
                form.checkOut
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  checkOut:
                    e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Save Attendance
          </button>

        </div>

      </form>

    </Modal>
  );
}

/* =========================================================
   APPLY LEAVE MODAL
========================================================= */

function ApplyLeaveModal({
  user,
  employees,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState({
      employeeId:
        user.role === "Employee"
          ? user.employeeId
          : "",
      type: "",
      from: "",
      to: "",
      reason: "",
    });

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.employeeId ||
      !form.type ||
      !form.from ||
      !form.to ||
      !form.reason
    ) {
      alert(
        "Please fill all fields."
      );
      return;
    }

    onSave(form);
  };

  return (
    <Modal
      title="Apply for Leave"
      subtitle="Submit a new leave request"
      onClose={onClose}
    >

      <form
        className="modal-form"
        onSubmit={submit}
      >

        {user.role ===
          "Admin" && (
          <div className="form-group">

            <label>
              Employee
            </label>

            <select
              value={
                form.employeeId
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  employeeId:
                    e.target.value,
                })
              }
            >

              <option value="">
                Select employee
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={
                      employee.employeeId
                    }
                    value={
                      employee.employeeId
                    }
                  >
                    {
                      employee.name
                    }
                  </option>
                )
              )}

            </select>

          </div>
        )}

        {user.role ===
          "Employee" && (
          <div className="form-group">

            <label>
              Employee
            </label>

            <input
              value={
                user.name
              }
              disabled
            />

          </div>
        )}

        <div className="form-group">

          <label>
            Leave Type
          </label>

          <select
            value={
              form.type
            }
            onChange={(e) =>
              setForm({
                ...form,
                type:
                  e.target.value,
              })
            }
          >

            <option value="">
              Select leave type
            </option>

            <option>
              Casual Leave
            </option>

            <option>
              Sick Leave
            </option>

            <option>
              Earned Leave
            </option>

          </select>

        </div>

        <div className="form-grid">

          <div className="form-group">

            <label>
              From Date
            </label>

            <input
              type="date"
              value={
                form.from
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  from:
                    e.target.value,
                })
              }
            />

          </div>

          <div className="form-group">

            <label>
              To Date
            </label>

            <input
              type="date"
              value={
                form.to
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  to:
                    e.target.value,
                })
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Reason
          </label>

          <textarea
            rows="4"
            placeholder="Enter reason for leave..."
            value={
              form.reason
            }
            onChange={(e) =>
              setForm({
                ...form,
                reason:
                  e.target.value,
              })
            }
          />

        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Submit Request
          </button>

        </div>

      </form>

    </Modal>
  );
}

/* =========================================================
   APPROVAL MODAL
========================================================= */

function ApprovalModal({
  request,
  onClose,
  onApprove,
  onReject,
}) {
  if (!request) {
    return null;
  }

  return (
    <Modal
      title="Review Leave Request"
      subtitle="Review employee leave application"
      onClose={onClose}
    >

      <div className="approval-profile">

        <div className="large-avatar">
          {getInitials(
            request.employee
          )}
        </div>

        <div>

          <h3>
            {request.employee}
          </h3>

          <span>
            {request.type}
          </span>

        </div>

      </div>

      <div className="detail-grid">

        <Detail
          label="From Date"
          value={
            request.from
          }
        />

        <Detail
          label="To Date"
          value={
            request.to
          }
        />

        <Detail
          label="Reason"
          value={
            request.reason
          }
        />

        <Detail
          label="Current Status"
          value={
            request.status
          }
        />

      </div>

      {request.status ===
      "Pending" ? (

        <div className="modal-actions">

          <button
            className="reject-large"
            onClick={() =>
              onReject(
                request.id
              )
            }
          >
            ✕ Reject
          </button>

          <button
            className="approve-large"
            onClick={() =>
              onApprove(
                request.id
              )
            }
          >
            ✓ Approve
          </button>

        </div>

      ) : (

        <div className="modal-actions">

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      )}

    </Modal>
  );
}

/* =========================================================
   EXPORT REPORT MODAL
========================================================= */

function ExportModal({
  employees,
  onClose,
  onSuccess,
}) {
  const generatePDF = () => {
    const reportWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!reportWindow) {
      alert(
        "Please allow pop-ups for this website to generate the PDF."
      );
      return;
    }

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee Attendance Report</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #172033;
            }

            h1 {
              color: #00a9d6;
              margin-bottom: 5px;
            }

            .subtitle {
              color: #667085;
              margin-bottom: 30px;
            }

            .section {
              margin-top: 25px;
              padding: 20px;
              border: 1px solid #d9e1e8;
              border-radius: 10px;
            }

            h2 {
              margin-top: 0;
              color: #172033;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }

            th,
            td {
              padding: 10px;
              border: 1px solid #d9e1e8;
              text-align: left;
            }

            th {
              background: #eefaff;
            }

            .footer {
              margin-top: 35px;
              color: #667085;
              font-size: 12px;
            }
          </style>
        </head>

        <body>

          <h1>Employee Attendance Management System</h1>

          <div class="subtitle">
            Attendance & Leave Management Report
          </div>

          <div class="section">
            <h2>Report Generated</h2>

            <p>
              Date:
              ${new Date().toLocaleDateString("en-GB")}
            </p>
            
          </div>

          <div class="section">
            <h2>Report Summary</h2>

            <p>
              This report was generated from the
              Employee Attendance Management System.
            </p>

            <p>
              Attendance, employee and leave
              management information can be
              included in this report.
            </p>
          </div>

          <div class="footer">
            Employee Attendance Management System
          </div>

        </body>
      </html>
    `);

    reportWindow.document.close();

    reportWindow.onload = () => {
      reportWindow.focus();
      reportWindow.print();
    };

    onClose();
    onSuccess();
  };

  return (
    <Modal
      title="Export Report"
      subtitle="Select report details"
      onClose={onClose}
    >

      <div className="modal-form">

        <div className="form-group">

          <label>
            Report Type
          </label>

          <select>
            <option>
              Attendance Report
            </option>

            <option>
              Leave Report
            </option>

            <option>
              Employee Report
            </option>
          </select>

        </div>
<div className="form-group">
  <label>Employee Name</label>
  <select>
    <option value="">Select Employee</option>
    {employees.map((employee) => (
      <option key={employee._id} value={employee._id}>
        {employee.name}
      </option>
    ))}
  </select>
</div>

        <div className="form-grid">

          <div className="form-group">

            <label>
              From Date
            </label>

            <input type="date" />

          </div>

          <div className="form-group">

            <label>
              To Date
            </label>

            <input type="date" />

          </div>

        </div>

        <div className="form-group">
          <label>Format</label>
          <div className="form-control">PDF</div>
        </div>

        <div className="modal-actions">

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            onClick={generatePDF}
          >
            Generate Report
          </button>

        </div>

      </div>

    </Modal>
  );
}

/* =========================================================
   SUCCESS MODAL
========================================================= */

function SuccessModal({
  title,
  message,
  onClose,
}) {
  return (
    <div className="success-overlay">

      <div className="success-modal">

        <div className="success-icon">
          ✓
        </div>

        <h2>
          {title}
        </h2>

        <p>
          {message}
        </p>

        <button
          className="success-button"
          onClick={onClose}
        >
          OK
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="form-group">

      <label>
        {label}
      </label>

      <input
        type={type}
        placeholder={
          placeholder
        }
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

    </div>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}) {
  return (
    <div className="detail-item">

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name) {
  return name
    .split(" ")
    .map(
      (word) =>
        word[0]
    )
    .join("");
}

function formatDate(dateString) {
  if (!dateString) {
    return "--";
  }

  const date =
    new Date(
      dateString +
        "T00:00:00"
    );

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(time) {
  if (!time) {
    return "--";
  }

  const [
    hour,
    minute,
  ] = time.split(":");

  const h =
    parseInt(hour, 10);

  const suffix =
    h >= 12
      ? "PM"
      : "AM";

  const displayHour =
    h % 12 || 12;

  return `${String(
    displayHour
  ).padStart(
    2,
    "0"
  )}:${minute} ${suffix}`;
}

export default App;
