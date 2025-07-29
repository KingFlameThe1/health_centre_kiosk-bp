"use client"

import React from "react"
import ReactDOM from "react-dom"

const { useState } = React

// Icon components
const UserIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const UsersIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const BuildingIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-3 4h1m-1 4h1"
    />
  </svg>
)

const UserCheckIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const HomeIcon = () => (
  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

// Triage options data
const triageOptions = [
  {
    id: "appointment",
    title: "Make an Appointment",
    subtitle: "Schedule or manage appointments",
    services: [
      "Medicals",
      "Physicals / Check-ups",
      "Missed Appointments",
      "Results / Reports Review",
      "Pap Smears",
      "I have an appointment today",
    ],
  },
  {
    id: "nursing",
    title: "Nursing Station",
    subtitle: "Nursing services and health monitoring",
    services: [
      "Contraceptive services",
      "STI counselling",
      "Pregnancy testing",
      "Blood pressure, Glucose, A1C, Weight",
      "Dressings/Bandaging",
    ],
  },
  {
    id: "urgent-care",
    title: "Urgent Care",
    subtitle: "For urgent medical complaints",
    services: [
      "For urgent complaints only",
      "Waiting time may be long",
      "Must visit the front desk for number and billing code",
      "Appointments are still optional",
    ],
  },
  {
    id: "other-services",
    title: "Other Services",
    subtitle: "Medications, supplies, and additional services",
    services: [
      "Medication refills",
      "Over-the-counter meds (no prescription)",
      "Medical supplies (e.g., bandages)",
      "Medication advice",
      "NHF card advice",
      "Vaccinations",
      "STI or Blood type testing",
    ],
  },
]

function MedicalTriageKiosk() {
  //const [currentStep, setCurrentStep] = useState("affiliation")
  const [currentStep, setCurrentStep] = useState("triage")
  const [affiliation, setAffiliation] = useState(null)
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dateOfBirth: "",
  })
  const [reasonForVisit, setReasonForVisit] = useState("")
  const [expandedAccordion, setExpandedAccordion] = useState(null)

  // Event handlers
  const handleAffiliationSelect = (selectedAffiliation) => {
    setAffiliation(selectedAffiliation)
    if (selectedAffiliation === "other") {
      setCurrentStep("triage")
    } else {
      setCurrentStep("information")
    }
  }

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleInformationSubmit = () => {
    const { firstName, lastName, idNumber, dateOfBirth } = userInfo
    if (firstName && lastName && idNumber && dateOfBirth) {
      setCurrentStep("triage")
    }
  }

  const handleAccordionToggle = (optionId) => {
    setExpandedAccordion(expandedAccordion === optionId ? null : optionId)
  }

  const handleReasonSelect = (reason) => {
    setReasonForVisit(reason)
    setCurrentStep("confirmation")
  }

  const handleBack = () => {
    switch (currentStep) {
      /*case "information":
        setCurrentStep("affiliation")
        break
      case "triage":
        if (affiliation === "other") {
          setCurrentStep("affiliation")
        } else {
          setCurrentStep("information")
        }
        break*/
      case "confirmation":
        setCurrentStep("triage")
        break;
      default:
        setCurrentStep("triage")
        break;
    }
  }

  const handleHome = () => {
    setCurrentStep("affiliation")
    setAffiliation(null)
    setUserInfo({ firstName: "", lastName: "", idNumber: "", dateOfBirth: "" })
    setReasonForVisit("")
    setExpandedAccordion(null)
  }

  const getAffiliationLabel = () => {
    const labels = {
      student: "Student",
      staff: "Staff",
      "staff-dependent": "Staff Dependent",
      other: "Other Visitor",
    }
    return labels[affiliation] || ""
  }

  const getReasonLabel = () => {
    const option = triageOptions.find((opt) => opt.id === reasonForVisit)
    return option ? option.title : ""
  }

  const isFormValid = () => {
    const { firstName, lastName, idNumber, dateOfBirth } = userInfo
    return firstName && lastName && idNumber && dateOfBirth
  }

  return (
    <div className="kiosk-container">
      <div className="kiosk-wrapper">
        {/* Header */}
        <header className="kiosk-header">
          <h1 className="kiosk-title">University Health Center</h1>
          <p className="kiosk-subtitle">Self-Service Medical Triage</p>
        </header>

        {/* Affiliation Selection Screen */}
        {/*currentStep === "affiliation" && (
          <div className="kiosk-card">
            <div className="card-header">
              <h2 className="card-title">Please select your affiliation</h2>
            </div>
            <div className="card-content">
              <div className="grid grid-2">
                <button className="btn btn-primary btn-large" onClick={() => handleAffiliationSelect("student")}>
                  <UserIcon />
                  <div className="btn-content">
                    <span className="btn-content-title">Student</span>
                    <span className="btn-content-desc">Current university student</span>
                  </div>
                </button>

                <button className="btn btn-primary btn-large" onClick={() => handleAffiliationSelect("staff")}>
                  <BuildingIcon />
                  <div className="btn-content">
                    <span className="btn-content-title">Staff</span>
                    <span className="btn-content-desc">University employee</span>
                  </div>
                </button>

                <button
                  className="btn btn-primary btn-large"
                  onClick={() => handleAffiliationSelect("staff-dependent")}
                >
                  <UsersIcon />
                  <div className="btn-content">
                    <span className="btn-content-title">Staff Dependent</span>
                    <span className="btn-content-desc">Family member of staff</span>
                  </div>
                </button>

                <button className="btn btn-primary btn-large" onClick={() => handleAffiliationSelect("other")}>
                  <UserCheckIcon />
                  <div className="btn-content">
                    <span className="btn-content-title">Other</span>
                    <span className="btn-content-desc">Visitor or other affiliation</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )*/}

        {/* Information Form */}
        {/*currentStep === "information" && (
          <div className="kiosk-card">
            <div className="card-header">
              <h2 className="card-title">Please provide your information</h2>
              <p className="card-subtitle">Selected: {getAffiliationLabel()}</p>
            </div>
            <div className="card-content">
              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-input"
                    placeholder="Enter your first name"
                    value={userInfo.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-input"
                    placeholder="Enter your last name"
                    value={userInfo.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="idNumber" className="form-label">
                    ID Number
                  </label>
                  <input
                    id="idNumber"
                    type="text"
                    className="form-input"
                    placeholder="Enter your ID number"
                    value={userInfo.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className="form-input"
                    value={userInfo.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn btn-secondary btn-medium" onClick={handleBack}>
                  <ArrowLeftIcon />
                  Back
                </button>
                <button
                  className="btn btn-primary btn-medium"
                  disabled={!isFormValid()}
                  onClick={handleInformationSubmit}
                >
                  Continue
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        )*/}

        {/* Reason for Visit (Triage) with Accordion */}
        {currentStep === "triage" && (
          <div className="kiosk-card">
            <div className="card-header">
              <h2 className="card-title">What is the reason for your visit?</h2>
              {affiliation !== "other" && (
                <p className="card-subtitle">
                  Welcome, {userInfo.firstName} {userInfo.lastName} ({getAffiliationLabel()})
                </p>
              )}
              <p className="card-subtitle" style={{ marginTop: "0.5rem", fontSize: "1rem" }}>
                Tap each option below to see what services are available
              </p>
            </div>
            <div className="card-content">
              {triageOptions.map((option) => (
                <div key={option.id} className="accordion-container">
                  <button
                    className={`accordion-button ${expandedAccordion === option.id ? "expanded" : ""}`}
                    onClick={() => handleAccordionToggle(option.id)}
                  >
                    <div>
                      <div className="accordion-title">{option.title}</div>
                      <div className="accordion-subtitle">{option.subtitle}</div>
                    </div>
                    <ChevronDownIcon className={expandedAccordion === option.id ? "expanded" : ""} />
                  </button>

                  <div className={`accordion-content ${expandedAccordion === option.id ? "expanded" : "collapsed"}`}>
                    <div className="accordion-inner">
                      <ul className="service-list">
                        {option.services.map((service, index) => (
                          <li key={index} className="service-item">
                            <div className="service-bullet"></div>
                            {service}
                          </li>
                        ))}
                      </ul>
                      <button className="select-button" onClick={() => handleReasonSelect(option.id)}>
                        Select {option.title}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="nav-buttons nav-buttons-single">
                <button className="btn btn-secondary btn-medium" onClick={handleBack}>
                  <ArrowLeftIcon />
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {currentStep === "confirmation" && (
          <div className="kiosk-card">
            <div className="card-header">
              <h2 className="card-title">Please confirm your information</h2>
            </div>
            <div className="card-content">
              <div className="confirmation-info">
                <div className="info-item">
                  <span className="info-label">Affiliation:</span>
                  <span className="info-value">{getAffiliationLabel()}</span>
                </div>

                {affiliation !== "other" && (
                  <>
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">
                        {userInfo.firstName} {userInfo.lastName}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">ID Number:</span>
                      <span className="info-value">{userInfo.idNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date of Birth:</span>
                      <span className="info-value">{userInfo.dateOfBirth}</span>
                    </div>
                  </>
                )}

                <div className="info-item">
                  <span className="info-label">Reason for Visit:</span>
                  <span className="info-value">{getReasonLabel()}</span>
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn btn-primary btn-medium" onClick={handleHome}>
                  <HomeIcon />
                  Home
                </button>
                <button
                  className="btn btn-primary btn-medium"
                  onClick={() => {
                    alert("Information confirmed! Please proceed to the reception desk.")
                    handleHome()
                  }}
                >
                  Confirm & Continue
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Render the application
ReactDOM.render(<MedicalTriageKiosk />, document.getElementById("root"))
