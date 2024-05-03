const fetchDataOnLeaveBalance = async () => {
    try {
        let payload = {};
        if (resetCheck.current) {
            // If resetCheck.current is true, omit the userId property from the payload
            payload = {};
        } else {
            // If resetCheck.current is false, include the userId property in the payload
            payload = {
                userId: formik.values.userName,
            };
        }

        const response = await axios.post(`http://141.148.194.18:8052/leavemanagement/leave-balance-dropdown`, payload, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        let sortedLeaveBallenceData = response.data.result.map((value) => {
            return value;
        });

        setLeaveBalalnce(sortedLeaveBallenceData);
        console.log(sortedLeaveBallenceData);
    } catch (error) {
        console.error(error);
    }
};
