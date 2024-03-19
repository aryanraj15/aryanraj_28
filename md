const handleResetForm = () => {
        swal({
            title: "Do you want to reset the search?",
            buttons: { cancel: "Cancel", confirm: "Confirm" },
        }).then((userClickedConfirm) => {
            if (userClickedConfirm) {
                setSelectAllApplications(false);

                const updatedValues = { LeaveStartDate: null, LeaveEndDate: null }; // Assuming these are the initial form values
                formik.resetForm({ values: updatedValues });

                // Additional actions if needed
                // handleFetchData();
            }
        });
    };
