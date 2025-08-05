"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home, User, Users, Building, UserCheck } from "lucide-react"

type Affiliation = "student" | "staff" | "staff-dependent" | "other" | null
type Step = "affiliation" | "information" | "triage" | "confirmation" | "welcome" | "direct" | "info"

interface UserInfo {
  firstName: string
  lastName: string
  idNumber: string
  dateOfBirth: string
}

var directMsg = 0 /*determines which message is displayed on "direct" screen*/

export default function MedicalTriageKiosk() {
  //const [currentStep, setCurrentStep] = useState<Step>("affiliation")
  const [currentStep, setCurrentStep] = useState<Step>("welcome")
  const [affiliation, setAffiliation] = useState<Affiliation>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    idNumber: "",
    dateOfBirth: "",
  })
  const [reasonForVisit, setReasonForVisit] = useState<string>("")

  const handleAffiliationSelect = (selectedAffiliation: Affiliation) => {
    setAffiliation(selectedAffiliation)
    if (selectedAffiliation === "other") {
      setCurrentStep("triage")
    } else {
      setCurrentStep("information")
    }
  }

  const handleInformationSubmit = () => {
    if (userInfo.firstName && userInfo.lastName && userInfo.idNumber && userInfo.dateOfBirth) {
      setCurrentStep("triage")
    }
  }

  const seenFrntDsk = (resp: string) =>{
    if (resp === "no"){
      /*sends user to page where they are direct on where to go */
      setCurrentStep("direct")
      directMsg = 1
    }
    else{
      setCurrentStep("triage")
    }
  }

  const handleReasonSelect = (reason: string) => {
    setReasonForVisit(reason)
    setCurrentStep("confirmation")
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">University Health Center</h1>
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
                <Button
                  onClick={() => seenFrntDsk("no")}
                  className="confirmationBTN"
                >
                  No
                </Button>

                <Button
                  onClick={() => seenFrntDsk("yes")}
                  className="confirmationBTN"
                >
                  Yes
                </Button>
              </div>

          </Card>
        )}

        {/* Reason for Visit (Triage) */}
        {currentStep === "triage" && (
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">What is the reason for your visit?</CardTitle>
              {/*affiliation !== "other" && (
                <p className="text-lg text-gray-600 mt-2">
                  Welcome, {userInfo.firstName} {userInfo.lastName} ({getAffiliationLabel()})
                </p>
              )*/}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <Button
                  onClick={() => handleReasonSelect("appointment")}
                  className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                >
                  <div className="text-left">
                    <div>Make an Appointment</div>
                    <div className="text-sm font-normal opacity-90">
                      For checkups, rescheduling, lab results, routine care
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleReasonSelect("medicine")/*change to match text */}
                  className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                >
                  <div className="text-left">
                    <div>See a nurse</div>
                    <div className="text-sm font-normal opacity-90">
                      For prescriptions, refills, and pharmaceutical needs
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleReasonSelect("urgent-care")}
                  className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                >
                  <div className="text-left">
                    <div>Urgent Care</div>
                    <div className="text-sm font-normal opacity-90">
                      For emergency, urgent care, or immediate medical attention
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleReasonSelect("other")}
                  className="w-full h-20 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold flex items-center justify-start gap-6 px-8 rounded-lg shadow-lg"
                >
                  <div className="text-left">
                    <div>Other Service</div>
                    <div className="text-sm font-normal opacity-90">
                      . . .
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex justify-start pt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Direction screen*/}
        {currentStep === "direct" &&(
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              {directMsg === 1 && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please see Information Desk.</CardTitle>
              )}
              {directMsg === 2 && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please go to Appointments Desk</CardTitle>
                
              )}
              {directMsg === 3 && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please go to the Nurse's Station</CardTitle>
                
              )}
              {directMsg === 3 && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please go to ________</CardTitle>
                
              )}
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        )}

        {/* Selection Information Screen */}
        {/*currentStep === "info" &&(
          <Card className="w-full">
            <CardHeader className="text-center pb-8">
              {reasonForVisit === "" && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please see Information Desk.</CardTitle>
              )}
              { && (
                <CardTitle className="text-3xl font-bold text-gray-900">Please go to Appointments Desk</CardTitle>
                
              )}
              { (
                <CardTitle className="text-3xl font-bold text-gray-900">Please go to the Nurse's Station</CardTitle>
                
              )}
              { (
                <CardTitle className="text-3xl font-bold text-gray-900">Please go to ________</CardTitle>
                
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              
            </CardContent>
          </Card>
        )*/}

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
                    {reasonForVisit === "medicine" && "Get Medicine"}
                    {reasonForVisit === "urgent-care" && "See a Doctor or Nurse"}
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
                    // This would typically submit the form or proceed to next step
                    alert("Information confirmed! Please proceed to the reception desk.")
                    handleHome()
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
