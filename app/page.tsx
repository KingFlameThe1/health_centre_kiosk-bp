"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home, User, Users, Building, UserCheck } from "lucide-react"

type Affiliation = "student" | "staff" | "staff-dependent" | "other" | null
type Step = "affiliation" | "information" | "triage" | "confirmation" | "welcome" | "direct" | "info"
type DirectMsg =
  | "font-desk"
  | "nurse"
  | "appointment"
  | "pharmacy"
  | "exemption"
  | "public health"
  | "urgent-care"
  | "help"
  | "lab"
  | null /*determines which message is displayed on "direct" screen*/

const PRINTSERVER = "192.168.29.10" /* IP of flask script host ------ This host will handle printing */
var nurseTicketCount = 1
var pharmacyTicketCount = 1
var otherTicketCount = 1

interface UserInfo {
  firstName: string
  lastName: string
  idNumber: string
  dateOfBirth: string
}

export default function MedicalTriageKiosk() {
  //const [currentStep, setCurrentStep] = useState<Step>("affiliation")
  const [currentStep, setCurrentStep] = useState<Step>("welcome") //determines opening screen
  const [affiliation, setAffiliation] = useState<Affiliation>(null) //stores patient affiliation -- not currently in use
  const [directMsg, setDirectMsg] = useState<DirectMsg>(null) //determines where the user is told to go on the "currentStep === "direct" screen
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    idNumber: "",
    dateOfBirth: "",
  }) //not currently in use
  const [reasonForVisit, setReasonForVisit] = useState<string>("") //stores patient reson for visit

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }
  }, [])

  const handleAffiliationSelect = (selectedAffiliation: Affiliation) => {
    //not in use
    setAffiliation(selectedAffiliation)
    if (selectedAffiliation === "other") {
      setCurrentStep("triage")
    } else {
      setCurrentStep("information")
    }
  }

  const handleInformationSubmit = () => {
    //not in use
    if (userInfo.firstName && userInfo.lastName && userInfo.idNumber && userInfo.dateOfBirth) {
      setCurrentStep("triage")
    }
  }

  const seenFrntDsk = (resp: string) => {
    if (resp === "no") {
      /*sends user to page where they are direct on where to go */
      setDirectMsg("font-desk")
      setCurrentStep("direct")
    } else {
      setCurrentStep("triage")
    }
  }

  const handleReasonSelect = (reason: string) => {
    setReasonForVisit(reason)
    setAffiliation("other")
    //setCurrentStep("confirmation")
    setCurrentStep("info")
  }

  const handleBack = () => {
    switch (currentStep) {
      /*case "information":
        setCurrentStep("affiliation")
        break*/
      case "triage":
        /*if (affiliation === "other") {
          setCurrentStep("affiliation")
        } else {
          setCurrentStep("information")
        }*/
        setCurrentStep("welcome")
        break

      case "confirmation":
        setCurrentStep("triage")
        break
      default:
        setCurrentStep("triage")
        break
    }
  }

  const handleHome = () => {
    /*setCurrentStep("affiliation")
    setAffiliation(null)
    setUserInfo({ firstName: "", lastName: "", idNumber: "", dateOfBirth: "" })
    setReasonForVisit("")*/
    setDirectMsg(null)
    setCurrentStep("welcome")
  }

  const getAffiliationLabel = () => {
    switch (affiliation) {
      case "student":
        return "Student"
      case "staff":
        return "Staff"
      case "staff-dependent":
        return "Staff Dependent"
      case "other":
        return "Other Visitor"
      default:
        return ""
    }
  }

  const handleFinalSelect = (reason: string) => {
    setReasonForVisit(reason)
    if (reason === "Medical Exemption") {
      setDirectMsg("exemption")
      setCurrentStep("direct")
    } else {
      setCurrentStep("confirmation")
    }
  }

  const handleContinue = () => {
    setCurrentStep("confirmation")
  }

  const exempConfirm = (resp: boolean) => {
    if (resp === true) {
      setDirectMsg("public health")
      printReciept("Public Health Consult")
    } else {
      //redirect to public health consultant????
      setReasonForVisit("Urgent Care")
      printReciept("Urgent Care")
      setCurrentStep("confirmation")
    }
  }

  const printReciept = (destination: string) => {
    var ticketNum = ""
    if (destination === "nurse") {
      ticketNum = "NRS" + nurseTicketCount
      nurseTicketCount = nurseTicketCount + 1
    } else if (destination === "pharmacy") {
      ticketNum = "PH" + pharmacyTicketCount
      pharmacyTicketCount = pharmacyTicketCount + 1
    } else if (destination !== "nurse" && destination !== "pharmacy") {
      ticketNum = "" + otherTicketCount
      otherTicketCount = otherTicketCount + 1
    }
    //console.log(ticketNum)
    fetch(`http://${PRINTSERVER}:5000/print/network`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: ticketNum, facility: destination }),
    })
  }

  /*below is where the page is rendered */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to the University Health Center</h1>
          <p className="text-xl text-gray-600">Self-Service Medical Triage</p>
        </div>

        {/* Affiliation Selection Screen */}
        {currentStep === "affiliation" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Please select your affiliation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={() => handleAffiliationSelect("student")}
                  className="h-24 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-center gap-4 rounded-lg shadow-lg"
                >
                  <User className="h-8 w-8" />
                  <div className="text-left">
                    <div>Student</div>
                    <div className="text-sm font-normal opacity-90">Current university student</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleAffiliationSelect("staff")}
                  className="h-24 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-center gap-4 rounded-lg shadow-lg"
                >
                  <Building className="h-8 w-8" />
                  <div className="text-left">
                    <div>Staff</div>
                    <div className="text-sm font-normal opacity-90">University employee</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleAffiliationSelect("staff-dependent")}
                  className="h-24 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-center gap-4 rounded-lg shadow-lg"
                >
                  <Users className="h-8 w-8" />
                  <div className="text-left">
                    <div>Staff Dependent</div>
                    <div className="text-sm font-normal opacity-90">Family member of staff</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleAffiliationSelect("other")}
                  className="h-24 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-center gap-4 rounded-lg shadow-lg"
                >
                  <UserCheck className="h-8 w-8" />
                  <div className="text-left">
                    <div>Other</div>
                    <div className="text-sm font-normal opacity-90">Visitor or other affiliation</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Form */}
        {currentStep === "information" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Please provide your information</CardTitle>
              <p className="text-lg text-gray-600 mt-2">Selected: {getAffiliationLabel()}</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-lg font-semibold text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={userInfo.firstName}
                    onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                    className="h-14 text-lg border-2 border-gray-300 focus:border-red-500"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-lg font-semibold text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={userInfo.lastName}
                    onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                    className="h-14 text-lg border-2 border-gray-300 focus:border-red-500"
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="idNumber" className="text-lg font-semibold text-gray-700">
                    ID Number
                  </Label>
                  <Input
                    id="idNumber"
                    type="text"
                    value={userInfo.idNumber}
                    onChange={(e) => setUserInfo({ ...userInfo, idNumber: e.target.value })}
                    className="h-14 text-lg border-2 border-gray-300 focus:border-red-500"
                    placeholder="Enter your ID number"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="dateOfBirth" className="text-lg font-semibold text-gray-700">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={userInfo.dateOfBirth}
                    onChange={(e) => setUserInfo({ ...userInfo, dateOfBirth: e.target.value })}
                    className="h-14 text-lg border-2 border-gray-300 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleInformationSubmit}
                  disabled={!userInfo.firstName || !userInfo.lastName || !userInfo.idNumber || !userInfo.dateOfBirth}
                  className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/*new home page */}
        {currentStep === "welcome" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Hi! Have you consulted the front desk?</CardTitle>
            </CardHeader>

            <div className="FrntDskCnfrm">
              <Button onClick={() => seenFrntDsk("no")} className="confirmationBTN">
                No
              </Button>

              <Button onClick={() => seenFrntDsk("yes")} className="confirmationBTN">
                Yes
              </Button>
            </div>
          </Card>
        )}

        {/* Reason for Visit (Triage) */}
        {currentStep === "triage" && (
          <Card className="w-full max-w-5xl mx-auto">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">What is your reason for visiting?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Make an Appointment */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <img src="/doctor-with-calendar.png" alt="Doctor with calendar" className="w-20 h-20" />
                  </div>
                  <Button
                    onClick={() => handleReasonSelect("appointment")}
                    className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded-lg shadow-lg"
                  >
                    Make an Appointment
                  </Button>
                  <p className="text-gray-600 text-center text-sm">
                    For check-ups, rescheduling, lab results, routine care
                  </p>
                </div>

                {/* Nursing */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <img src="/nursing-services.png" alt="Nursing services" className="w-20 h-20" />
                  </div>
                  <Button
                    onClick={() => handleReasonSelect("nurse")}
                    className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded-lg shadow-lg"
                  >
                    Nursing
                  </Button>
                  <p className="text-gray-600 text-center text-sm">
                    For contraceptives, STI counselling, pregnancy & rapid tests, medical suplies
                  </p>
                </div>

                {/* Urgent Care */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <img src="/urgent-care.png" alt="Urgent care" className="w-20 h-20" />
                  </div>
                  <Button
                    onClick={() => handleReasonSelect("urgent-care")}
                    className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded-lg shadow-lg"
                  >
                    Urgent Care
                  </Button>
                  <p className="text-gray-600 text-center text-sm">
                    For Emergencies / Urgent care / Immediate medical attention
                  </p>
                </div>

                {/* Other */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <img src="/medical-supplies.png" alt="Other services" className="w-20 h-20" />
                  </div>
                  <Button
                    onClick={() => handleReasonSelect("other")}
                    className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded-lg shadow-lg"
                  >
                    Other
                  </Button>
                  <p className="text-gray-600 text-center text-sm">tap to see options</p>
                </div>
              </div>

              <div className="flex justify-start pt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-gray-300 hover:bg-gray-50 bg-transparent rounded-lg"
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Direction screen*/}
        {currentStep === "direct" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              {directMsg === "font-desk" && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please see front / Information Desk.</CardTitle>
              )}
              {directMsg === "appointment" && (
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Please head over to Appointments Desk
                </CardTitle>
              )}
              {directMsg === "nurse" && (
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Please head over to the Nurse's Station
                </CardTitle>
              )}
              {directMsg === "urgent-care" && (
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Please have a seat. We will be wth you shortly.
                </CardTitle>
              )}
              {directMsg === "pharmacy" && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please head over to our Pharmacy</CardTitle>
              )}
              {directMsg === "exemption" && (
                <CardTitle className="text-3xl font-bold text-gray-900">Have you seen a doctor about this previously?</CardTitle>
              )}
              {directMsg === "public health" && (
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Please see our public health consultant
                </CardTitle>
              )}
              {directMsg === "lab" && (
                <CardTitle className="text-3xl font-bold text-gray-900">Head to the lab between 9 - 2 on Tuesday or Thursday</CardTitle>
              )}
              {directMsg === "help" && (
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Please ask for assitance at the information desk
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {directMsg !== "exemption" && (
                <div className="flex justify-start pt-8">
                  <Button
                    onClick={handleHome}
                    variant="outline"
                    className="h-14 px-8 text-lg border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Home
                  </Button>
                </div>
              )}
              {directMsg === "exemption" && (
                <div className="FrntDskCnfrm">
                  <Button onClick={() => exempConfirm(false)} className="confirmationBTN">
                    No
                  </Button>

                  <Button onClick={() => exempConfirm(true)} className="confirmationBTN">
                    Yes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Selection Information Screen */}
        {currentStep === "info" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Your selection includes:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/*Appointments info card */}
              {reasonForVisit === "appointment" && (
                <ul className="info-list">
                  <li>Medicals</li>
                  <li>Physicals/ Check-ups</li>
                  <li>Missed appointments</li>
                  <li>Pap Smears</li>
                  <li>Non-urgent complaints</li>
                </ul>
              )}

              {/*Nursing info card */}
              {reasonForVisit === "nurse" && (
                <ul className="info-list">
                  <li>Contraceptive services</li>
                  <li>STI counselling / rapid tests</li>
                  <li>Pregnancy Testing</li>
                  <li>Blood Pressure/Glucose/A1c/Weight/etc.</li>
                  <li>Other rapid tests (covid, dengue, flu, etc.)</li>
                  <li>Dressings/Bandaging</li>
                </ul>
              )}

              {reasonForVisit === "urgent-care" && (
                <div className="info-list">
                  <ol>
                    <h3>Urgent Cases Only</h3>
                    <h3>Waiting time(s) may vary</h3>
                    <li id="urgCareDisc">IF SITUATION IS NOT URGENT YOU WILL BE RE-ROUTED</li>
                    <li>Please Note: emergency cases will be prioritized</li>
                    <li>Doctor seen will be based on availability</li>
                  </ol>
                </div>
              )}

              {reasonForVisit === "other" && (
                <div className="space-y-6">
                  <Button
                    onClick={() => handleFinalSelect("Prescription Re-write") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>Prescription re-write / renew</div>
                      <div className="text-sm font-normal opacity-90"></div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("Over the Counter Medication") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>Over the counter medications</div>
                      <div className="text-sm font-normal opacity-90">no prescription needed</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("Medical Supplies") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>Medical Supplies</div>
                      <div className="text-sm font-normal opacity-90">bandages, etc.</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("Medication Advice") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>Medication Advice</div>
                      <div className="text-sm font-normal opacity-90"></div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("NHF Card Advice") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>NHF Card Advice</div>
                      <div className="text-sm font-normal opacity-90"></div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("Vaccination") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>Vaccinations</div>
                      <div className="text-sm font-normal opacity-90"></div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("Lab Tests") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>Lab Tests</div>
                      <div className="text-sm font-normal opacity-90">STI screens, executive profiles and others</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFinalSelect("Medical Exemption") /* change handle function */}
                    className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                  >
                    <div className="text-left">
                      <div>medical exemptions/ sick leave</div>
                      <div className="text-sm font-normal opacity-90"></div>
                    </div>
                  </Button>
                </div>
              )}

              <div className="flex justify-start pt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>

                {reasonForVisit !== "other" && (
                  <Button onClick={handleContinue} className="info-continue-btn">
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Screen */}
        {currentStep === "confirmation" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">Please confirm your information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="text-lg">
                  <span className="font-semibold text-gray-700">Affiliation:</span>{" "}
                  <span className="text-gray-900">{getAffiliationLabel()}</span>
                </div>

                {affiliation !== "other" && (
                  <>
                    <div className="text-lg">
                      <span className="font-semibold text-gray-700">Name:</span>{" "}
                      <span className="text-gray-900">
                        {userInfo.firstName} {userInfo.lastName}
                      </span>
                    </div>
                    <div className="text-lg">
                      <span className="font-semibold text-gray-700">ID Number:</span>{" "}
                      <span className="text-gray-900">{userInfo.idNumber}</span>
                    </div>
                    <div className="text-lg">
                      <span className="font-semibold text-gray-700">Date of Birth:</span>{" "}
                      <span className="text-gray-900">{userInfo.dateOfBirth}</span>
                    </div>
                  </>
                )}

                <div className="text-lg">
                  <span className="font-semibold text-gray-700">Reason for Visit:</span>{" "}
                  <span className="text-gray-900">
                    {reasonForVisit === "appointment" && "Make an Appointment"}
                    {reasonForVisit === "nurse" && "See a Nurse"}
                    {reasonForVisit === "urgent-care" && "Urgent Care"}
                    {!["appointment", "nurse", "urgent-care"].includes(reasonForVisit) && reasonForVisit}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <Button
                  onClick={handleHome}
                  className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </Button>

                <Button
                  onClick={() => {
                    // This section determins message displayed to direct patients and prints the reciept
                    switch (reasonForVisit) {
                      case "appointment":
                        setDirectMsg("appointment")
                        setCurrentStep("direct")
                        break
                      case "nurse":
                        setDirectMsg("nurse")
                        printReciept("nurse")
                        setCurrentStep("direct")
                        break
                      case "urgent-care":
                        setDirectMsg("urgent-care")
                        printReciept("urgent-care")
                        setCurrentStep("direct")
                        break
                      case "Prescription Re-write":
                        setDirectMsg("help")
                        //printReciept("pharmacy")
                        setCurrentStep("direct")
                        break
                      case "Over the Counter Medication":
                        setDirectMsg("pharmacy")
                        printReciept("pharmacy")
                        setCurrentStep("direct")
                        break
                      case "Medical Supplies":
                        setDirectMsg("pharmacy")
                        printReciept("pharmacy")
                        setCurrentStep("direct")
                        break
                      case "Medication Advice":
                        setDirectMsg("pharmacy")
                        printReciept("pharmacy")
                        setCurrentStep("direct")
                        break
                      case "NHF Card Advice":
                        setDirectMsg("pharmacy")
                        printReciept("pharmacy")
                        setCurrentStep("direct")
                        break
                      case "Vaccination":
                        setDirectMsg("pharmacy")
                        printReciept("pharmacy")
                        setCurrentStep("direct")
                        break
                      case "Lab Tests":
                        setDirectMsg("lab")
                        //printReciept("The Lab")
                        setCurrentStep("direct")
                        break
                      default:
                        setDirectMsg("help")
                        setCurrentStep("direct")
                        break
                    }
                  }}
                  className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                >
                  Confirm & Continue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
