The above error occurred in the <ForwardRef(DateField)> component:

    at DateField (http://localhost:3000/payroll-app/static/js/vendors-node_modules_mui_x-date-pickers_AdapterDayjs_AdapterDayjs_js-node_modules_mui_x-date--aa8c8c.chunk.js:3543:86)
    at LocalizationProvider (http://localhost:3000/payroll-app/static/js/vendors-node_modules_mui_x-date-pickers_AdapterDayjs_AdapterDayjs_js-node_modules_mui_x-date--aa8c8c.chunk.js:5075:19)
    at MobileDatePicker (http://localhost:3000/payroll-app/static/js/vendors-node_modules_mui_x-date-pickers_AdapterDayjs_AdapterDayjs_js-node_modules_mui_x-date--aa8c8c.chunk.js:5253:79)
    at DatePicker (http://localhost:3000/payroll-app/static/js/vendors-node_modules_mui_x-date-pickers_AdapterDayjs_AdapterDayjs_js-node_modules_mui_x-date--aa8c8c.chunk.js:3997:81)
    at LocalizationProvider (http://localhost:3000/payroll-app/static/js/vendors-node_modules_mui_x-date-pickers_AdapterDayjs_AdapterDayjs_js-node_modules_mui_x-date--aa8c8c.chunk.js:5075:19)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Grid (http://localhost:3000/payroll-app/static/js/bundle.js:301650:87)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Grid (http://localhost:3000/payroll-app/static/js/bundle.js:301650:87)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Grid (http://localhost:3000/payroll-app/static/js/bundle.js:301650:87)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Grid (http://localhost:3000/payroll-app/static/js/bundle.js:301650:87)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at CardContent (http://localhost:3000/payroll-app/static/js/src_pages_Home_js.chunk.js:475:82)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Paper (http://localhost:3000/payroll-app/static/js/bundle.js:304237:83)
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Card (http://localhost:3000/payroll-app/static/js/src_pages_Home_js.chunk.js:607:82)
    at form
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at CardContent (http://localhost:3000/payroll-app/static/js/src_pages_Home_js.chunk.js:475:82)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Paper (http://localhost:3000/payroll-app/static/js/bundle.js:304237:83)
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Card (http://localhost:3000/payroll-app/static/js/src_pages_Home_js.chunk.js:607:82)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Grid (http://localhost:3000/payroll-app/static/js/bundle.js:301650:87)
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Grid (http://localhost:3000/payroll-app/static/js/bundle.js:301650:87)
    at PersonalDetails (http://localhost:3000/payroll-app/src_pages_Manage_Service_Book_ManageServiceBook_js.e4739377a3cf5f576d57.hot-update.js:181:5)
    at div
    at ManageServiceBook (http://localhost:3000/payroll-app/static/js/src_pages_Manage_Service_Book_ManageServiceBook_js.chunk.js:4198:74)
    at RenderedRoute (http://localhost:3000/payroll-app/static/js/bundle.js:357066:5)
    at Outlet (http://localhost:3000/payroll-app/static/js/bundle.js:357446:26)
    at PrivateRoutes (http://localhost:3000/payroll-app/static/js/bundle.js:5212:72)
    at RenderedRoute (http://localhost:3000/payroll-app/static/js/bundle.js:357066:5)
    at Outlet (http://localhost:3000/payroll-app/static/js/bundle.js:357446:26)
    at main
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at div
    at http://localhost:3000/payroll-app/static/js/bundle.js:6399:66
    at Box (http://localhost:3000/payroll-app/static/js/bundle.js:309503:72)
    at PersistentDrawerLeft (http://localhost:3000/payroll-app/static/js/bundle.js:1827:72)
    at RenderedRoute (http://localhost:3000/payroll-app/static/js/bundle.js:357066:5)
    at Routes (http://localhost:3000/payroll-app/static/js/bundle.js:357531:5)
    at Suspense
    at AppRoutes
    at Provider (http://localhost:3000/payroll-app/static/js/bundle.js:352894:5)
    at RtlProvider (http://localhost:3000/payroll-app/static/js/bundle.js:309015:7)
    at ThemeProvider (http://localhost:3000/payroll-app/static/js/bundle.js:307975:5)
    at ThemeProvider (http://localhost:3000/payroll-app/static/js/bundle.js:309100:5)
    at ThemeProvider (http://localhost:3000/payroll-app/static/js/bundle.js:306381:14)
    at ColorModeContextProvider (http://localhost:3000/payroll-app/static/js/bundle.js:5314:5)
    at SnackbarProvider (http://localhost:3000/payroll-app/static/js/bundle.js:487:5)
    at App
    at PersistGate (http://localhost:3000/payroll-app/static/js/bundle.js:363939:5)
    at Provider (http://localhost:3000/payroll-app/static/js/bundle.js:352894:5)
    at Router (http://localhost:3000/payroll-app/static/js/bundle.js:357469:15)
    at HashRouter (http://localhost:3000/payroll-app/static/js/bundle.js:355698:5)
    at TitleContextProvider (http://localhost:3000/payroll-app/static/js/bundle.js:632:5)
    at Suspense

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
