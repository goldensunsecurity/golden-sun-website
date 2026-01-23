import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// --- INDIAN COMPLIANCE LOGIC HELPER ---
const calculateSalary = (data) => {
  const basic = parseFloat(data.basic) || 0;
  const hra = parseFloat(data.hra) || 0;
  const allowance = parseFloat(data.allowance) || 0;
  const bonus = parseFloat(data.bonus) || 0;

  const gross = basic + hra + allowance + bonus;

  // 1. EPF (12% of Basic)
  let epf = data.pf ? Math.round(basic * 0.12) : 0;

  // 2. ESI (0.75% of Gross if Gross <= 21000)
  let esi = 0;
  if (data.esi && gross <= 21000) {
    esi = Math.ceil(gross * 0.0075);
  }

  // 3. PT / LWF (Punjab Rules: Approx ₹200 PT, ₹20 LWF)
  let pt = data.pt ? 200 : 0;
  let lwf = data.lwf ? 20 : 0;

  const totalDeductions = epf + esi + pt + lwf;
  const netSalary = gross - totalDeductions;

  // Employer Cost (CTC)
  // Employer PF: 13% (12% + 1% Admin)
  // Employer ESI: 3.25%
  const employerPF = data.pf ? Math.round(basic * 0.13) : 0;
  const employerESI = (data.esi && gross <= 21000) ? Math.ceil(gross * 0.0325) : 0;
  const ctc = gross + employerPF + employerESI;

  return { gross, epf, esi, pt, lwf, totalDeductions, netSalary, ctc };
};

export default function App() {
  // State for Employees List
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('goldenSun_employees');
    return saved ? JSON.parse(saved) : [];
  });

  // State for Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', id: '', designation: 'Security Guard', state: 'Punjab',
    basic: 12000, hra: 3000, allowance: 0, bonus: 0,
    pf: true, esi: true, pt: true, lwf: true
  });

  // Calculated Values for Preview
  const [preview, setPreview] = useState({});

  // Effect: Save to LocalStorage whenever list changes
  useEffect(() => {
    localStorage.setItem('goldenSun_employees', JSON.stringify(employees));
  }, [employees]);

  // Effect: Recalculate salary whenever form data changes
  useEffect(() => {
    setPreview(calculateSalary(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEmployees([...employees, { ...formData, ...preview }]);
    setShowModal(false);
    // Reset Form
    setFormData({
      name: '', id: '', designation: 'Security Guard', state: 'Punjab',
      basic: 12000, hra: 3000, allowance: 0, bonus: 0,
      pf: true, esi: true, pt: true, lwf: true
    });
  };

  const handleDelete = (index) => {
    const newList = employees.filter((_, i) => i !== index);
    setEmployees(newList);
  };

  // Dashboard Stats
  const totalPayroll = employees.reduce((acc, emp) => acc + emp.ctc, 0);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>EMS Portal</h2>
        <ul>
          <li><a href="#" className="active">Dashboard</a></li>
          <li><a href="#">Employees</a></li>
          <li><a href="#">Payroll</a></li>
          <li><a href="#">Compliance</a></li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header-bar">
          <h1>Admin Dashboard</h1>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New Employee</button>
        </div>

        {/* STATS CARDS */}
        <div className="card-grid">
          <div className="stat-card">
            <h3>{employees.length}</h3>
            <p>Total Staff</p>
          </div>
          <div className="stat-card">
            <h3 style={{color: '#28a745'}}>₹{totalPayroll.toLocaleString()}</h3>
            <p>Monthly CTC Cost</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Compliance Score</p>
          </div>
        </div>

        {/* EMPLOYEE TABLE */}
        <div className="table-container">
          <h3>Employee Directory</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Basic</th>
                <th>In-Hand Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:'center'}}>No employees found. Add one!</td></tr>
              ) : (
                employees.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.designation}</td>
                    <td>₹{emp.basic}</td>
                    <td style={{fontWeight:'bold', color:'#28a745'}}>₹{emp.netSalary.toLocaleString()}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(index)}>Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="form-grid">
                {/* Personal Info */}
                <div className="section-title">Personal Details</div>
                <input name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} />
                <input name="id" placeholder="Employee ID (GSS-001)" required value={formData.id} onChange={handleInputChange} />
                <select name="designation" value={formData.designation} onChange={handleInputChange}>
                  <option>Security Guard</option>
                  <option>Supervisor</option>
                  <option>Gunman</option>
                  <option>Housekeeping</option>
                </select>
                <select name="state" value={formData.state} onChange={handleInputChange}>
                  <option>Punjab</option>
                  <option>Haryana</option>
                  <option>Chandigarh</option>
                </select>

                {/* Salary Info */}
                <div className="section-title">Earnings</div>
                <input type="number" name="basic" placeholder="Basic" value={formData.basic} onChange={handleInputChange} />
                <input type="number" name="hra" placeholder="HRA" value={formData.hra} onChange={handleInputChange} />
                <input type="number" name="allowance" placeholder="Allowances" value={formData.allowance} onChange={handleInputChange} />
                <input type="number" name="bonus" placeholder="Bonus" value={formData.bonus} onChange={handleInputChange} />

                {/* Compliance Checkboxes */}
                <div className="checkbox-group">
                   <label><input type="checkbox" name="pf" checked={formData.pf} onChange={handleInputChange}/> EPF (12%)</label>
                   <label><input type="checkbox" name="esi" checked={formData.esi} onChange={handleInputChange}/> ESI (0.75%)</label>
                   <label><input type="checkbox" name="pt" checked={formData.pt} onChange={handleInputChange}/> Prof. Tax</label>
                   <label><input type="checkbox" name="lwf" checked={formData.lwf} onChange={handleInputChange}/> LWF</label>
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div className="salary-preview">
                <h4>Salary Slip Preview</h4>
                <div className="row"><span>Gross Earnings:</span> <span>₹{preview.gross}</span></div>
                <div className="row deduction"><span>EPF Deduction:</span> <span>-₹{preview.epf}</span></div>
                <div className="row deduction"><span>ESI Deduction:</span> <span>-₹{preview.esi}</span></div>
                <div className="row total"><span>Net In-Hand Salary:</span> <span>₹{preview.netSalary}</span></div>
                <div className="row ctc"><span>Total Company Cost (CTC):</span> <span>₹{preview.ctc}</span></div>
              </div>

              <button type="submit" className="save-btn">Save Employee</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}