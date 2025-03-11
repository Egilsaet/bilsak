"use client"

import React from "react"
import "./styles.css"

const { useState, useEffect } = React


const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

// Sample solution tips for common car issues
const solutionTips = {
  motor: ["Sjekk oljenivå og kvalitet", "Kontroller tennplugger", "Undersøk luftfilter for tilstopping"],
  bremser: ["Kontroller bremsevæskenivå", "Sjekk bremseklosser for slitasje", "Undersøk bremseskiver for skader"],
  elektrisk: ["Test batterispenning", "Kontroller sikringer", "Sjekk ledningsnett for skader"],
  drivverk: ["Kontroller girolje", "Sjekk drivaksler for slitasje", "Undersøk clutch-funksjon"],
  kjølesystem: ["Sjekk kjølevæskenivå", "Kontroller radiator for lekkasjer", "Test termostat-funksjon"],
}

// Component for the navigation bar
function Navbar({ activePage, setActivePage }) {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">Åpen sak</div>
        <nav>
          <ul>
            <li>
              <a
                href="#"
                className={activePage === "dashboard" ? "active" : ""}
                onClick={() => setActivePage("dashboard")}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activePage === "new-case" ? "active" : ""}
                onClick={() => setActivePage("new-case")}
              >
                Ny sak
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

// Component for the case registration form
function CaseForm({ addCase, editingCase, updateCase, setActivePage }) {
  const [caseData, setCaseData] = useState({
    regNumber: "",
    customerName: "",
    customerPhone: "",
    carModel: "",
    issueCategory: "",
    issueDescription: "",
    priority: "medium",
    status: "open",
  })

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (editingCase) {
      setCaseData(editingCase)
    }
  }, [editingCase])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCaseData({
      ...caseData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!caseData.regNumber || !caseData.issueDescription) {
      setNotification({
        type: "error",
        message: "Vennligst fyll ut alle påkrevde felt",
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    if (editingCase) {
      updateCase(caseData)
    } else {
      addCase({
        ...caseData,
        id: generateId(),
        caseNumber: "SAK-" + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        solutionTips: solutionTips[caseData.issueCategory] || [],
      })
    }

    setCaseData({
      regNumber: "",
      customerName: "",
      customerPhone: "",
      carModel: "",
      issueCategory: "",
      issueDescription: "",
      priority: "medium",
      status: "open",
    })

    setNotification({
      type: "success",
      message: editingCase ? "Sak oppdatert!" : "Ny sak registrert!",
    })

    setTimeout(() => {
      setNotification(null)
      if (!editingCase) {
        setActivePage("dashboard")
      }
    }, 2000)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{editingCase ? "Rediger sak" : "Registrer ny sak"}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="regNumber">Registreringsnummer *</label>
          <input
            type="text"
            id="regNumber"
            name="regNumber"
            value={caseData.regNumber}
            onChange={handleChange}
            placeholder="F.eks. AB12345"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerName">Kundenavn</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={caseData.customerName}
            onChange={handleChange}
            placeholder="Ola Nordmann"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerPhone">Telefonnummer</label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            value={caseData.customerPhone}
            onChange={handleChange}
            placeholder="12345678"
          />
        </div>

        <div className="form-group">
          <label htmlFor="carModel">Bilmodell</label>
          <input
            type="text"
            id="carModel"
            name="carModel"
            value={caseData.carModel}
            onChange={handleChange}
            placeholder="F.eks. Toyota Corolla 2018"
          />
        </div>

        <div className="form-group">
          <label htmlFor="issueCategory">Feilkategori</label>
          <select id="issueCategory" name="issueCategory" value={caseData.issueCategory} onChange={handleChange}>
            <option value="">Velg kategori</option>
            <option value="motor">Motor</option>
            <option value="bremser">Bremser</option>
            <option value="elektrisk">Elektrisk</option>
            <option value="drivverk">Drivverk</option>
            <option value="kjølesystem">Kjølesystem</option>
            <option value="annet">Annet</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="issueDescription">Beskrivelse av feil *</label>
          <textarea
            id="issueDescription"
            name="issueDescription"
            value={caseData.issueDescription}
            onChange={handleChange}
            rows="4"
            placeholder="Beskriv feilen i detalj..."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Prioritet</label>
          <select id="priority" name="priority" value={caseData.priority} onChange={handleChange}>
            <option value="low">Lav</option>
            <option value="medium">Medium</option>
            <option value="high">Høy</option>
          </select>
        </div>

        {editingCase && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={caseData.status} onChange={handleChange}>
              <option value="open">Åpen</option>
              <option value="in-progress">Under arbeid</option>
              <option value="resolved">Løst</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn">
          {editingCase ? "Oppdater sak" : "Registrer sak"}
        </button>
      </form>

      {notification && (
        <div className={`notification ${notification.type === "error" ? "notification-error" : ""}`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}

// Component for the case list
function CaseList({ cases, searchTerm, openCaseDetails }) {
  const filteredCases = cases.filter((caseItem) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      caseItem.regNumber.toLowerCase().includes(searchLower) ||
      caseItem.caseNumber.toLowerCase().includes(searchLower) ||
      caseItem.issueDescription.toLowerCase().includes(searchLower) ||
      (caseItem.customerName && caseItem.customerName.toLowerCase().includes(searchLower)) ||
      (caseItem.carModel && caseItem.carModel.toLowerCase().includes(searchLower))
    )
  })

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "Åpen"
      case "in-progress":
        return "Under arbeid"
      case "resolved":
        return "Løst"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "low":
        return "Lav"
      case "medium":
        return "Medium"
      case "high":
        return "Høy"
      default:
        return priority
    }
  }

  return (
    <div className="case-list">
      {filteredCases.length === 0 ? (
        <div className="card">
          <p>Ingen saker funnet.</p>
        </div>
      ) : (
        filteredCases.map((caseItem) => (
          <div key={caseItem.id} className="case-item" onClick={() => openCaseDetails(caseItem)}>
            <div className="case-header">
              <span className="case-number">{caseItem.caseNumber}</span>
              <span className={`case-status status-${caseItem.status}`}>{getStatusLabel(caseItem.status)}</span>
            </div>
            <div className="case-details">
              <p>
                <strong>Reg.nr:</strong> {caseItem.regNumber}
              </p>
              <p>
                <strong>Bil:</strong> {caseItem.carModel || "Ikke spesifisert"}
              </p>
              <p>
                <strong>Prioritet:</strong> {getPriorityLabel(caseItem.priority)}
              </p>
              <p>
                <strong>Problem:</strong>{" "}
                {caseItem.issueDescription.length > 50
                  ? `${caseItem.issueDescription.substring(0, 50)}...`
                  : caseItem.issueDescription}
              </p>
            </div>
            <div className="case-actions">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  openCaseDetails(caseItem)
                }}
              >
                Se detaljer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// Component for the case details modal
function CaseDetailsModal({ caseItem, closeModal, editCase, deleteCase }) {
  const [activeTab, setActiveTab] = useState("details")

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("no-NO", options)
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "Åpen"
      case "in-progress":
        return "Under arbeid"
      case "resolved":
        return "Løst"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "low":
        return "Lav"
      case "medium":
        return "Medium"
      case "high":
        return "Høy"
      default:
        return priority
    }
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{caseItem.caseNumber}</h3>
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
        </div>

        <div className="tabs">
          <div className={`tab ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>
            Detaljer
          </div>
          <div className={`tab ${activeTab === "solutions" ? "active" : ""}`} onClick={() => setActiveTab("solutions")}>
            Løsningsforslag
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "details" && (
            <div>
              <p>
                <strong>Status:</strong> {getStatusLabel(caseItem.status)}
              </p>
              <p>
                <strong>Registreringsnummer:</strong> {caseItem.regNumber}
              </p>
              <p>
                <strong>Bilmodell:</strong> {caseItem.carModel || "Ikke spesifisert"}
              </p>
              <p>
                <strong>Kundenavn:</strong> {caseItem.customerName || "Ikke spesifisert"}
              </p>
              <p>
                <strong>Telefon:</strong> {caseItem.customerPhone || "Ikke spesifisert"}
              </p>
              <p>
                <strong>Prioritet:</strong> {getPriorityLabel(caseItem.priority)}
              </p>
              <p>
                <strong>Opprettet:</strong> {formatDate(caseItem.createdAt)}
              </p>
              <p>
                <strong>Beskrivelse av feil:</strong>
              </p>
              <p>{caseItem.issueDescription}</p>
            </div>
          )}

          {activeTab === "solutions" && (
            <div>
              <h4>Mulige løsningsforslag:</h4>
              {caseItem.solutionTips && caseItem.solutionTips.length > 0 ? (
                <ul>
                  {caseItem.solutionTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p>Ingen løsningsforslag tilgjengelig for denne feilen.</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm("Er du sikker på at du vil slette denne saken?")) {
                deleteCase(caseItem.id)
                closeModal()
              }
            }}
          >
            Slett sak
          </button>
          <button
            className="btn"
            onClick={() => {
              editCase(caseItem)
              closeModal()
            }}
          >
            Rediger sak
          </button>
        </div>
      </div>
    </div>
  )
}

// Component for the dashboard
function Dashboard({ cases, searchTerm, setSearchTerm, openCaseDetails }) {
  const openCases = cases.filter((caseItem) => caseItem.status === "open").length
  const inProgressCases = cases.filter((caseItem) => caseItem.status === "in-progress").length
  const resolvedCases = cases.filter((caseItem) => caseItem.status === "resolved").length

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dashboard</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div
            className="badge"
            style={{ backgroundColor: "#f39c12", color: "white", fontSize: "1rem", padding: "0.5rem 1rem" }}
          >
            Åpne saker: {openCases}
          </div>
          <div
            className="badge"
            style={{ backgroundColor: "#3498db", color: "white", fontSize: "1rem", padding: "0.5rem 1rem" }}
          >
            Under arbeid: {inProgressCases}
          </div>
          <div
            className="badge"
            style={{ backgroundColor: "#2ecc71", color: "white", fontSize: "1rem", padding: "0.5rem 1rem" }}
          >
            Løste saker: {resolvedCases}
          </div>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Søk etter registreringsnummer, saksnummer, beskrivelse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CaseList cases={cases} searchTerm={searchTerm} openCaseDetails={openCaseDetails} />
    </div>
  )
}

// Main App component
function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const [cases, setCases] = useState(() => {
    const savedCases = localStorage.getItem("workshopCases")
    return savedCases
      ? JSON.parse(savedCases)
      : [
          {
            id: "sample1",
            caseNumber: "SAK-1234",
            regNumber: "AB12345",
            customerName: "Ola Nordmann",
            customerPhone: "12345678",
            carModel: "Volvo V70 2015",
            issueCategory: "bremser",
            issueDescription: "Bilen bremser dårlig og lager ulyder ved bremsing.",
            priority: "high",
            status: "open",
            createdAt: "2023-05-15T10:30:00Z",
            solutionTips: solutionTips["bremser"],
          },
          {
            id: "sample2",
            caseNumber: "SAK-5678",
            regNumber: "CD67890",
            customerName: "Kari Nordmann",
            customerPhone: "87654321",
            carModel: "Toyota Corolla 2018",
            issueCategory: "motor",
            issueDescription: "Motoren starter ikke. Hører klikkelyd når jeg vrir om nøkkelen.",
            priority: "medium",
            status: "in-progress",
            createdAt: "2023-05-14T14:45:00Z",
            solutionTips: solutionTips["motor"],
          },
          {
            id: "sample3",
            caseNumber: "SAK-9012",
            regNumber: "EF12345",
            customerName: "Per Hansen",
            customerPhone: "45678901",
            carModel: "BMW 3-serie 2020",
            issueCategory: "elektrisk",
            issueDescription: "Varmeapparatet virker ikke. Ingen varm luft kommer ut av ventilene.",
            priority: "low",
            status: "resolved",
            createdAt: "2023-05-10T09:15:00Z",
            solutionTips: solutionTips["elektrisk"],
          },
        ]
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [showCaseDetails, setShowCaseDetails] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [editingCase, setEditingCase] = useState(null)

  // Save cases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workshopCases", JSON.stringify(cases))
  }, [cases])

  const addCase = (newCase) => {
    setCases([newCase, ...cases])
  }

  const updateCase = (updatedCase) => {
    setCases(cases.map((caseItem) => (caseItem.id === updatedCase.id ? updatedCase : caseItem)))
    setEditingCase(null)
  }

  const deleteCase = (caseId) => {
    setCases(cases.filter((caseItem) => caseItem.id !== caseId))
  }

  const openCaseDetails = (caseItem) => {
    setSelectedCase(caseItem)
    setShowCaseDetails(true)
  }

  const closeCaseDetails = () => {
    setShowCaseDetails(false)
    setSelectedCase(null)
  }

  const editCase = (caseItem) => {
    setEditingCase(caseItem)
    setActivePage("new-case")
  }

  return (
    <div>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <div className="container main-content">
        {activePage === "dashboard" && (
          <Dashboard
            cases={cases}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openCaseDetails={openCaseDetails}
          />
        )}

        {activePage === "new-case" && (
          <CaseForm addCase={addCase} editingCase={editingCase} updateCase={updateCase} setActivePage={setActivePage} />
        )}
      </div>

      {showCaseDetails && selectedCase && (
        <CaseDetailsModal
          caseItem={selectedCase}
          closeModal={closeCaseDetails}
          editCase={editCase}
          deleteCase={deleteCase}
        />
      )}
    </div>
  )
}

export default App

