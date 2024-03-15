import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "./components/Snackbar";
import { Provider } from "react-redux";
import store from "./redux/store";
import PrivateRoutes from "./routes/PrivateRoutes";
// import Header from './components/Header';
// import Footer from './components/Footer';

// import {baseTheme} from './utils/Theme'

import Header from "./layouts/Header";
import { ColorModeContextProvider } from "./utils/ColorModeContext";
import ScrollToTop from "./components/ScrollToTop";
import NavigateToTop from "./components/NavigateToTop";
import EnrollmentStatus from "./pages/BasicEmp/EnrollmentStatus";
import Leave from "./pages/LeaveManagement/Leave/Leave";
import TransportBooking from "./pages/LeaveManagement/essentialServices/Transport/TransportBooking";
import BoardRoomBooking from "./pages/LeaveManagement/essentialServices/BoardRoom/BoardRoomBooking";
import ConferenceRoomBooking from "./pages/LeaveManagement/essentialServices/ConferenceRoomBooking";
//import DCOfficeExpenses from "./pages/admin/DCOfficeExpenses";
//import DCTravelExpenses from "./pages/admin/DCTravelExpenses";
import ViewLeaves from "./pages/LeaveManagement/Leave/ViewLeaves";
import ViewBoardRoomBooking from "./pages/LeaveManagement/essentialServices/BoardRoom/ViewBoardRoomBooking";
import ViewTransportBooking from "./pages/LeaveManagement/essentialServices/Transport/ViewTransportBooking";
import ViewConferenceRoomBooking from "./pages/LeaveManagement/viewEssentialServices/ViewConferenceRoomBooking";
//import ViewDCOfficeExpense from "./pages/admin/ViewDCOfficeExpense";
//import ViewDCTravelExpense from "./pages/admin/ViewDCTravelExpense";
import EnrollmentInbox from "./pages/BasicEmp/EmloyeeIndex";
import ApprovalBookingRoom from "./pages/LeaveManagement/essentialServices/BoardRoom/BookingRoomApproval";
import DummyRoomBooking from "./pages/LeaveManagement/essentialServices/BoardRoom/bookingroomdummy";
import IndentRequest from "./pages/HR/IndentRequest/IndentRequest";
import ViewIndentDetails from "./pages/HR/IndentRequest/ViewIndentRequest";
import ViewIndentRequestDetails from "./pages/HR/IndentRequest/ViewIndentRequestDetails";
import AdminViewIndentRequest from "./pages/HR/IndentRequest/AdminViewIndentRequest";
import AdminViewIndentRequestDetails from "./pages/HR/IndentRequest/AdminViewIndentRequestDetails";
import LeaveRequestApproval from "./pages/LeaveManagement/Leave/LeaveRequestApproval";
import LeaveRequestDummy from "./pages/LeaveManagement/Leave/LeaveRequestDummy";

import DCOfficeExpenses from "./pages/admin/DCOfficeExpenses";
import DCTravelExpenses from "./pages/admin/DCTravelExpenses";
import ViewDCOfficeExpense from "./pages/admin/ViewDCOfficeExpense";
import ViewDCTravelExpense from "./pages/admin/ViewDCTravelExpense";
import DcForms from "./pages/admin/DcForms";
import ViewMyBookingsDummy from "./pages/LeaveManagement/essentialServices/Transport/ViewMyBookingDummy";
import ViewMyBookings from "./pages/LeaveManagement/essentialServices/Transport/ViewMyBookings";
// import ViewTransportBooking from "./pages/LeaveManagement/essentialServices/Transport/ViewTransportBooking";
// import TransportBooking from "./pages/LeaveManagement/essentialServices/Transport/TransportBooking";
// import ViewMyBookings from "./pages/LeaveManagement/essentialServices/Transport/ViewMyBookings";
//import ViewMyBookingsDummy from "./pages/LeaveManagement/essentialServices/Transport/ViewMyBookingDummy";
//import ApprovalBookingTransport from "./pages/LeaveManagement/essentialServices/Transport/TransportBookingApproval";
//import DummyTransportBooking from "./pages/LeaveManagement/essentialServices/Transport/bookingTransportdummy";
import EmployeeConfirmedBookings from "./pages/LeaveManagement/essentialServices/Transport/EmployeeConfirmedBookings";
import Empviewafterconfirmation from "./pages/LeaveManagement/essentialServices/Transport/Empviewafterconfirmation";

import TrackIndentRequestStatus from "./pages/HR/IndentRequest/TrackIndentRequestStatus";
import ManageStockRequestDetails from "./pages/HR/IndentStock/ManageStockRequestDetails";
import ManageStockRequests from "./pages/HR/IndentStock/ManageStockRequests";
import StockInbox from "./pages/HR/IndentStock/StockInbox";
import StockInboxDetails from "./pages/HR/IndentStock/StockInboxDetails";
import StockRequest from "./pages/HR/IndentStock/StockRequest";
import DummyTransportBooking from "./pages/LeaveManagement/essentialServices/Transport/bookingTransportdummy";
import ApprovalBookingTransport from "./pages/LeaveManagement/essentialServices/Transport/TransportBookingApproval";
import AssignedLeaves from "./pages/LeaveManagement/Leave/AssignedLeaves";
import LeaveApplicationCancel from "./pages/LeaveManagement/Leave/LeaveApplicationcancel";
import LeaveLedgerDummy from "./pages/LeaveManagement/Leave/LeaveLedgerDummy";
import ManagedLeave from "./pages/LeaveManagement/Leave/ManagedLeave";
import AdminLedger from "./pages/LeaveManagement/Leave/AdminLedger";

const UserRoleMapPage1 = lazy(() => import("./pages/UserRoleMapPage1"));
const UserRoleMapPage2 = lazy(() => import("./pages/UserRoleMapPage2"));
const HospitalMaster1 = lazy(() => import("./pages/HospitalMaster1"));
const HospitalMaster2 = lazy(() => import("./pages/HospitalMaster2"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const ManageEmployeeEnrollment = lazy(() =>
  import("./pages/ManageEmployeeEnrollment")
);
const DownloadButton = lazy(() =>
  import("./pages/BasicEmpView/DownloadButton")
);
const EmployeeEnrollmentView = lazy(() =>
  import("./pages/BasicEmpView/EmployeeEnrollmentView")
);
const EmployeeView = lazy(() => import("./pages/BasicEmpView/EmployeeView"));
/*****Basic EmploymentFormPages******/
const BasicEmploymentForm = lazy(() =>
  import("./pages/BasicEmp/BasicEmploymentform")
);
/*****Pages******/
const Home = lazy(() => import("./pages/Home"));
// const RegisteredPatient = lazy(() => import("./pages/RegisteredPatient"));
const Login = lazy(() => import("./pages/Login/Login"));
const ForgotPassword = lazy(() => import("./pages/Login/forgotPassword"));
const UserPage = lazy(() => import("./pages/UserCreation/UserPage"));
const RoleMenuRightMap = lazy(() => import("./pages/RoleMenuRightMap"));
const RoleMaster = lazy(() => import("./pages/RoleMaster"));
const BankMaster = lazy(() => import("./pages/BankMaster"));
const DesignationMaster = lazy(() => import("./pages/DesignationMaster"));
const DepartmentMaster = lazy(() => import("./pages/DepartmentMaster"));
const BranchMaster = lazy(() => import("./pages/BranchMaster"));
const Step3New = lazy(() => import("./pages/BasicEmp/Step3New"));
const EditBooking = lazy(() =>
  import("./pages/LeaveManagement/essentialServices/BoardRoom/EditBooking")
);

/*****Pages******/
const Payslip = lazy(() => import("./pages/selfservices/payslip"));

//BasicEmploymentForm

//Masters
const AsriDoctorMaster = lazy(() =>
  import("./pages/MasterScreens/AsriDoctorMaster")
);
const AsriAttachmentMaster = lazy(() =>
  import("./pages/MasterScreens/AsriAttachmentMaster")
);

const AsriChemicalSubGroupMaster = lazy(() =>
  import("./pages/MasterScreens/AsriChemicalSubGroupMaster")
);
const AsriChemicalSubstanceMaster = lazy(() =>
  import("./pages/MasterScreens/AsriChemicalSubstanceMaster")
);
const AsriExpertiseMaster = lazy(() =>
  import("./pages/MasterScreens/AsriExpertiseMaster")
);
const AsriGeneralMaster = lazy(() =>
  import("./pages/MasterScreens/AsriGeneralMaster")
);
const AsriGrievanceSourceRoleMappingMaster = lazy(() =>
  import("./pages/MasterScreens/AsriGrievanceSourceRoleMappingMaster")
);
const AsriInvDiaComMaster = lazy(() =>
  import("./pages/MasterScreens/AsriInvDiaComMaster")
);
const AsriMainGroupMaster = lazy(() =>
  import("./pages/MasterScreens/AsriMainGroupMaster")
);
const AsriMainRouteMaster = lazy(() =>
  import("./pages/MasterScreens/AsriMainRouteMaster")
);

const MenuMaster = lazy(() => import("./pages/MenuMaster"));
const SchemeDeptMapping = lazy(() => import("./pages/SchemeDeptDesgMapping"));

const AsriPharmacologicalSubgroupMaster = lazy(() =>
  import("./pages/MasterScreens/AsriPharmacologicalSubgroupMaster")
);
const AsriProcedureMaster = lazy(() =>
  import("./pages/MasterScreens/AsriProcedureMaster")
);
const AsriSpecialInvestigationMaster = lazy(() =>
  import("./pages/MasterScreens/AsriSpecialInvestigationMaster")
);
const AsriStrengthMaster = lazy(() =>
  import("./pages/MasterScreens/AsriStrengthMaster")
);
const AsriStrengthQuantityMaster = lazy(() =>
  import("./pages/MasterScreens/AsriStrengthQuantityMaster")
);
const AsriSubrouteMaster = lazy(() =>
  import("./pages/MasterScreens/AsriSubrouteMaster")
);
const AsriTherapeuticMainGroupMaster = lazy(() =>
  import("./pages/MasterScreens/AsriTherapeuticMainGroupMaster")
);
const AsriSubcategoryMaster = lazy(() =>
  import("./pages/MasterScreens/AsriSubcategoryMaster")
);
const MasterVillage = lazy(() => import("./pages/MasterScreens/MasterVillage"));

const YsrConstituencyMaster = lazy(() =>
  import("./pages/MasterScreens/YsrConstituencyMaster")
);

const YsrGeneralTypeMaster = lazy(() =>
  import("./pages/MasterScreens/YsrGeneralTypeMaster")
);
const YsrHealthCampMaster = lazy(() =>
  import("./pages/MasterScreens/YsrHealthCampMaster")
);
// const YsrMenuMaster = lazy(() => import("./pages/MasterScreens/YsrMenuMaster"));
const YsrNearestCityMaster = lazy(() =>
  import("./pages/MasterScreens/YsrNearestCityMaster")
);
const YsrPhcMaster = lazy(() => import("./pages/MasterScreens/YsrPhcMaster"));

const YsrSpecialitiesMaster = lazy(() =>
  import("./pages/MasterScreens/YsrSpecialitiesMaster")
);
// const YsrUserMaster = lazy(() => import("./pages/MasterScreens/YsrUserMaster"));

const YsrSchemeMaster = lazy(() =>
  import("./pages/MasterScreens/YsrSchemeMaster")
);
const MasterState = lazy(() => import("./pages/MasterScreens/Masterstate"));
const MasterDistrict = lazy(() =>
  import("./pages/MasterScreens/MasterDistrict")
);
const MasterMandal = lazy(() => import("./pages/MasterScreens/MasterMandal"));
const MasterHamlet = lazy(() => import("./pages/MasterScreens/MasterHamlet"));
const MasterSachiwalayam = lazy(() =>
  import("./pages/MasterScreens/MasterSachiwalayam")
);
const EmpanelmentAttachmentTypeMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlAttachmentTypeMaster")
);
const EmpanelmentDocumentTypeMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlDocumentTypeMaster")
);
const EmpanelmentHospitalInfraLabelMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlHospInfraLabelMaster")
);
const EmpanelmentLabelMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlLableMaster")
);
const EmpanelmentValueMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlValueMaster")
);
const EmpnlQstMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlQstMaster")
);
const EmpnlSpecialityQstMaster = lazy(() =>
  import("./pages/MasterScreens/EmpnlSpecialityQstMaster")
);
const Submitted = lazy(() => import("./pages/BasicEmp/Submited"));
const Preview = lazy(() => import("./pages/BasicEmp/Preview"));

//Job portal
const SearchApplications = lazy(() =>
  import("./pages/jobPortal/SearchManageApplications/SearchApplication")
);

const ExistingApplicantView = lazy(() =>
  import("./pages/jobPortal/ExistingEmpView/ExistingApplicantView")
);

const SlotBookingDashBoard = lazy(() =>
  import(
    "./pages/LeaveManagement/essentialServices/BoardRoom/SlotBookingsDashBoard"
  )
);

const BookingsInbox = lazy(() =>
  import("./pages/LeaveManagement/essentialServices/BoardRoom/BookingsInbox")
);

const Empviewtransportbookings = lazy(() =>
  import(
    "./pages/LeaveManagement/essentialServices/Transport/Empviewtransportdetails"
  )
);
const EmployeeEditTransportBooking = lazy(() =>
  import(
    "./pages/LeaveManagement/essentialServices/Transport/EmployeeEditTransportBooking"
  )
);
const OtherLevelApprovals = lazy(() =>
  import(
    "./pages/LeaveManagement/essentialServices/Transport/Otherlevelapprovals"
  )
);
const App = () => {
  // console.log = function () {};
  //console = {};
  // console.log = () => {};
  // console.debug = () => {};
  // console.info = () => {};
  // console.warn = () => {};
  //console.error = () => {};

  // const lightTheme = createTheme({
  //   palette: {
  //     mode: 'light',
  //     primary: {
  //       main: "#0d47a1",
  //       light: "#e6f4ff",
  //     },
  //     secondary: {
  //       main: "#1e4db7",
  //     },
  //   },
  // });
  // const darkTheme = createTheme({
  //   palette: {
  //     mode: 'dark',
  //   },
  // });

  return (
    <>
      <SnackbarProvider>
        <ColorModeContextProvider>
          {/* <AddBeneficiary /> */}
          <Provider store={store}>
            {/* <DDOBenefWorklist/> */}
            <AppRoutes />
          </Provider>
          {/* <BeneficiaryDetails /> */}
        </ColorModeContextProvider>
      </SnackbarProvider>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div />}>
      {/* <Router> */}
      <ScrollToTop />
      {/* <NavigateToTop /> */}
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route element={<Header />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/userpage" element={<UserPage />} />
            <Route path="/rolemenurightmap" element={<RoleMenuRightMap />} />
            <Route path="/rolemaster" element={<RoleMaster />} />
            <Route path="/BankMaster" element={<BankMaster />} />
            <Route path="/designationmaster" element={<DesignationMaster />} />
            <Route path="/departmentmaster" element={<DepartmentMaster />} />
            <Route path="/userRoleMapPage1" element={<UserRoleMapPage1 />} />
            <Route
              path="/userRoleMapPage2/:userId"
              element={<UserRoleMapPage2 />}
            />
            <Route path="/schemeDeptMapping" element={<SchemeDeptMapping />} />
            <Route path="/branchmaster" element={<BranchMaster />} />
            <Route path="/hospitalMaster1" element={<HospitalMaster1 />} />
            <Route path="/hospitalMaster2" element={<HospitalMaster2 />} />
            <Route path="/inbox" element={<UserDetails />} />
            <Route
              path="/employeeEnrollmentView/:userId"
              element={<EmployeeEnrollmentView />}
            />
            <Route path="/enrollmentStatus" element={<EnrollmentStatus />} />
            <Route
              path="/manage-employeeEnrollment"
              element={<EnrollmentInbox />}
            />
            <Route
              path="/employeeconfirmedbookings"
              element={<EmployeeConfirmedBookings />}
            />
            <Route
              path="/empviewafterconfirmation"
              element={<Empviewafterconfirmation />}
            />
            <Route path="/leave-ledgers" element={<LeaveLedgerDummy />} />
            <Route
              path="/employeeedittransportbooking"
              element={<EmployeeEditTransportBooking />}
            />

            <Route
              path="/BasicEmploymentForm"
              element={<BasicEmploymentForm />}
            />
            <Route path="/payslip" element={<Payslip />} />
            <Route path="/Submitted" element={<Submitted />} />
            {/* <Route path="/downloadButton" element={<DownloadButton />} /> */}
            <Route path="/BasicEmploymentFormPreview" element={<Preview />} />

            <Route path="/Page3" element={<Step3New />} />
            {/* Job Applications */}
            {/* <Route element={<PrivateRoutes />}> */}
            <Route
              path="/search-applications"
              element={<SearchApplications />}
            />
            <Route
              path="/job_application_view"
              element={<ExistingApplicantView />}
            />
            {/* </Route> */}

            {/* Master */}
            <Route path="/asri-doctor-master" element={<AsriDoctorMaster />} />
            <Route
              path="/asri-attachment-master"
              element={<AsriAttachmentMaster />}
            />
            <Route
              path="/asri-chemical-sub-group-master"
              element={<AsriChemicalSubGroupMaster />}
            />
            <Route
              path="/asri-chemical-substance-master"
              element={<AsriChemicalSubstanceMaster />}
            />
            <Route
              path="/asri-expertise-master"
              element={<AsriExpertiseMaster />}
            />
            <Route
              path="/asri-general-master"
              element={<AsriGeneralMaster />}
            />
            <Route
              path="/asri-grievance-source-role-mapping-master"
              element={<AsriGrievanceSourceRoleMappingMaster />}
            />
            <Route
              path="/asri-inv-dia-com-master"
              element={<AsriInvDiaComMaster />}
            />
            <Route
              path="/asri-mainroute-master"
              element={<AsriMainRouteMaster />}
            />
            <Route
              path="/asri-main-group-master"
              element={<AsriMainGroupMaster />}
            />
            <Route path="/menumaster" element={<MenuMaster />} />
            <Route
              path="/asri-subcategory-master"
              element={<AsriSubcategoryMaster />}
            />
            <Route
              path="/asri-pharmacological-sub-group-master"
              element={<AsriPharmacologicalSubgroupMaster />}
            />
            <Route
              path="/asri-procedure-master"
              element={<AsriProcedureMaster />}
            />
            <Route
              path="/asri-special-investigation-master"
              element={<AsriSpecialInvestigationMaster />}
            />
            <Route
              path="/asri-strength-master"
              element={<AsriStrengthMaster />}
            />
            <Route
              path="/asri-strength-quantity-master"
              element={<AsriStrengthQuantityMaster />}
            />
            <Route
              path="/asri-subroute-master"
              element={<AsriSubrouteMaster />}
            />
            <Route
              path="/asri-therapeutic-main-group-master"
              element={<AsriTherapeuticMainGroupMaster />}
            />
            <Route path="/ysr-village-master" element={<MasterVillage />} />
            <Route
              path="/ysr-constituency-master"
              element={<YsrConstituencyMaster />}
            />
            <Route
              path="/ysr-general-type-master"
              element={<YsrGeneralTypeMaster />}
            />
            <Route
              path="/ysr-healthcamp-master"
              element={<YsrHealthCampMaster />}
            />
            {/* <Route path="/YsrMenuMaster" element={<YsrMenuMaster />} /> */}
            <Route
              path="/ysr-nearest-city-master"
              element={<YsrNearestCityMaster />}
            />
            <Route path="/ysr-phc-master" element={<YsrPhcMaster />} />
            <Route path="/ysr-scheme-master" element={<YsrSchemeMaster />} />
            <Route
              path="/ysr-specialities-master"
              element={<YsrSpecialitiesMaster />}
            />
            {/* <Route path="/YsrUserMaster" element={<YsrUserMaster />} /> */}
            <Route path="/ysr-state-master" element={<MasterState />} />
            <Route path="/ysr-district-master" element={<MasterDistrict />} />
            <Route path="/ysr-mandal-master" element={<MasterMandal />} />
            <Route path="/ysr-hamlet-master" element={<MasterHamlet />} />
            <Route
              path="/ysr-sachivalayam-master"
              element={<MasterSachiwalayam />}
            />
            <Route
              path="/empnl-attachment-type-master"
              element={<EmpanelmentAttachmentTypeMaster />}
            />
            <Route
              path="/empnl-doc-type-master"
              element={<EmpanelmentDocumentTypeMaster />}
            />
            <Route
              path="/empnl-hosp-infra-label-master"
              element={<EmpanelmentHospitalInfraLabelMaster />}
            />
            <Route
              path="/empnl-lable-master"
              element={<EmpanelmentLabelMaster />}
            />
            <Route
              path="/empnl-value-master"
              element={<EmpanelmentValueMaster />}
            />
            <Route
              path="/empnl-speciality-qst-master"
              element={<EmpnlSpecialityQstMaster />}
            />
            <Route path="/empnl-qst-master" element={<EmpnlQstMaster />} />

            {/* HR and Admin Module Routes */}
            <Route path="/leave" element={<Leave />} />
            <Route path="/transportBooking" element={<TransportBooking />} />
            <Route path="/boardRoomBook" element={<BoardRoomBooking />} />
            <Route
              path="/conferenceRoomBook"
              element={<ConferenceRoomBooking />}
            />
            <Route path="/dcofficeexpense" element={<DCOfficeExpenses />} />
            <Route path="/dctravelexpense" element={<DCTravelExpenses />} />
            <Route path="/viewleave" element={<ViewLeaves />} />
            <Route
              path="/viewboardroombookings"
              element={<ViewBoardRoomBooking />}
            />
            <Route
              path="/viewtransportdetails"
              element={<ViewTransportBooking />}
            />
            <Route
              path="empviewtransportbookings"
              element={<Empviewtransportbookings />}
            />
            <Route
              path="hodapprovaltransportbookings"
              element={<Empviewtransportbookings />}
            />
            <Route
              path="otherLevelApprovals"
              element={<OtherLevelApprovals />}
            />

            <Route
              path="/viewconferenceroombookings"
              element={<ViewConferenceRoomBooking />}
            />
            <Route
              path="/viewdcofficeexpensedetails"
              element={<ViewDCOfficeExpense />}
            />
            <Route
              path="/viewdctravelexpenses"
              element={<ViewDCTravelExpense />}
            />
            <Route
              path="/approvedroombookings"
              element={<ApprovalBookingRoom />}
            />
            <Route path="/managebookings" element={<ApprovalBookingRoom />} />
            <Route
              path="/viewroombookingstatus"
              element={<ApprovalBookingRoom />}
            />
            <Route path="/bookingroomdetails" element={<DummyRoomBooking />} />
            <Route path="/indent-request" element={<IndentRequest />} />
            <Route
              path="/view-indent-requests"
              element={<ViewIndentDetails />}
            />
            <Route
              path="/view-indent-request-details"
              element={<ViewIndentRequestDetails />}
            />
            <Route
              path="/inbox-indent-request"
              element={<AdminViewIndentRequest />}
            />
            <Route
              path="/ar-indent-request-details"
              element={<AdminViewIndentRequestDetails />}
            />
            <Route path="/leave-account" element={<LeaveRequestApproval />} />
            <Route
              path="/leaverequestdetails"
              element={<LeaveRequestDummy />}
            />
            <Route
              path="/approvaltransportbookings"
              element={<ApprovalBookingTransport />}
            />
            <Route
              path="/bookingtransportdetails"
              element={<DummyTransportBooking />}
            />
            <Route
              path="/employee-leave-mapping"
              element={<AssignedLeaves />}
            />
            <Route
              path="/slotbookingDashboard"
              element={<SlotBookingDashBoard />}
            />

            <Route path="/dcofficeexpense" element={<DCOfficeExpenses />} />
            <Route path="/dctravelexpense" element={<DCTravelExpenses />} />
            <Route path="/viewleave" element={<ViewLeaves />} />

            <Route
              path="/track-indent-request-status"
              element={<TrackIndentRequestStatus />}
            />

            <Route path="/requisition-form" element={<StockRequest />} />
            <Route
              path="/view-requisitions"
              element={<ManageStockRequests />}
            />
            <Route
              path="/view-requisitions-request-details"
              element={<ManageStockRequestDetails />}
            />
            <Route path="/requisition-inbox" element={<StockInbox />} />
            <Route
              path="/requisition-inbox-details"
              element={<StockInboxDetails />}
            />

            <Route path="/manageLeave" element={<ManagedLeave />} />
            <Route
              path="/viewtransportdetails"
              element={<ViewTransportBooking />}
            />
            <Route path="/transportBooking" element={<TransportBooking />} />
            <Route path="/viewmybooking" element={<ViewMyBookings />} />
            <Route
              path="/viewmybookingdummy"
              element={<ViewMyBookingsDummy />}
            />
            <Route
              path="/approvaltransportbookings"
              element={<ApprovalBookingTransport />}
            />
            <Route
              path="/bookingtransportdetails"
              element={<DummyTransportBooking />}
            />
            <Route
              path="/employeeconfirmedbookings"
              element={<EmployeeConfirmedBookings />}
            />
            <Route
              path="/empviewafterconfirmation"
              element={<Empviewafterconfirmation />}
            />
            <Route
              path="/leaveapplicationview"
              element={<LeaveApplicationCancel />}
            />

            <Route path="/BookingsInbox" element={<BookingsInbox />} />
            <Route path="/dcofficeexpense" element={<DCOfficeExpenses />} />
            <Route path="/dctravelexpense" element={<DCTravelExpenses />} />
            <Route
              path="/viewdcofficeexpensedetails"
              element={<ViewDCOfficeExpense />}
            />
            <Route
              path="/viewdctravelexpenses"
              element={<ViewDCTravelExpense />}
            />
            <Route path="/dcforms" element={<DcForms />} />
            <Route
              path="/viewmybookingdummy"
              element={<ViewMyBookingsDummy />}
            />
            <Route path="/viewmybooking" element={<ViewMyBookings />} />

            <Route path="/editMeeting" element={<EditBooking />} />

            <Route path="/adminledger" element={<AdminLedger />} />
            {/* {menu.map((page, index) => {
            return (
              <Route
                exact
                element={page.pageLink}
                render={({match}) => <page.view /> }
                key={index}
              />
            );
          })} */}
            {/* <Navigate to="/" /> */}
          </Route>
        </Route>
      </Routes>
      {/* </Router> */}
    </Suspense>
  );
};

export default App;
