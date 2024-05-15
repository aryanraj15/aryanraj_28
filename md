import React, { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import axios from 'axios';
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

const Calendar = () => {
  const calendarRef = useRef();
  const user = useSelector((state) => state.loginReducer);
  
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    headerDateFormat: "dd/M/yyyy",
    onBeforeEventRender: args => {
      args.data.areas = [];
    }
  });

  const [events, setEvents] = useState([]);

  const fetchCalendarData = async () => {
    try {
      const response = await axios.post(
        "http://141.148.194.18:8095/leavemanagement/calendar-view",
        { userId: user.data.userdetails.user.userId },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );

      if (response.data.statusCode === 200) {
        setEvents(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const startDate = DayPilot.Date.today();
      calendarRef.current.control.update({ startDate, events });
    }
  }, [events]);

  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Week"}
          onTimeRangeSelected={args => {
            calendarRef.current.control.update({ startDate: args.day });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
};

export default Calendar;




import React, { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import axios from 'axios';
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

const Calendar = () => {
  const calendarRef = useRef()

//   const editEvent = async (e) => {
//     const dp = calendarRef.current.control;
//     const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
//     if (!modal.result) { return; }
//     e.data.text = modal.result;
//     dp.events.update(e);
//   };

  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    // EventHoverHandling:"Bubble",
    // eventMoving:false,
    // useEventBoxes : "Always",
    headerDateFormat : "dd/M/yyyy",
    // onTimeRangeSelected: async args => {
    //   const dp = calendarRef.current.control;
    //   const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    //   dp.clearSelection();
    //   if (!modal.result) { return; }
    //   dp.events.add({
    //     start: args.start,
    //     end: args.end,
    //     id: DayPilot.guid(),
    //     text: modal.result
    //   });
    // },
    // onEventClick: async args => {
    //   await editEvent(args.e);
    // },
    // contextMenu: new DayPilot.Menu({
    //   items: [
    //     {
    //       text: "Delete",
    //       onClick: async args => {
    //         const dp = calendarRef.current.control;
    //         dp.events.remove(args.source);
    //       },
    //     },
    //     {
    //       text: "-"
    //     },
    //     {
    //       text: "Edit...",
    //       onClick: async args => {
    //         await editEvent(args.source);
    //       }
    //     }
    //   ]
    // }),
    onBeforeEventRender: args => {
      args.data.areas = [
        // {
        //   top: 3,
        //   right: 3,
        //   width: 20,
        //   height: 20,
        //   symbol: "icons/daypilot.svg#minichevron-down-2",
        //   fontColor: "#fff",
        //   toolTip: "Show context menu",
        //   action: "ContextMenu",
        // },
        // {
        //   top: 3,
        //   right: 25,
        //   width: 20,
        //   height: 20,
        //   symbol: "icons/daypilot.svg#x-circle",
        //   fontColor: "#fff",
        //   action: "None",
        //   toolTip: "Delete event",
        //   onClick: async args => {
        //     const dp = calendarRef.current.control;
        //     dp.events.remove(args.source);
        //   }
        // }
      ];


    //   const participants = args.data.participants;
    //   if (participants > 0) {
    //     // show one icon for each participant
    //     for (let i = 0; i < participants; i++) {
    //       args.data.areas.push({
    //         bottom: 5,
    //         right: 5 + i * 30,
    //         width: 24,
    //         height: 24,
    //         action: "None",
    //         image: `https://picsum.photos/24/24?random=${i}`,
    //         style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
    //       });
    //     }
    //   }
    }
  });
  
   
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.loginReducer);
  const fetchCalendarData = async () => {
    try {
      const response = await axios.post(
        "http://141.148.194.18:8095/leavemanagement/calendar-view",
        {
          userId: user.data.userdetails.user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }
      );
      // Handle the response data as needed
      console.log(response.data.result);
      if (response.data.statusCode === 200) {
        setEvents(response.data.result);

      }

    } catch (error) {
      // Handle errors
    
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    fetchCalendarData();
    // const events = [
    //   {
    //     id: 1,
    //     text: "Event 1",
        
    //     start: "2024-05-16T12:30:00.000+00:00",
    //     end: "2024-05-16T15:30:00.000+00:00",
        
        
    //   },
    //   {
    //     id: 2,
    //     text: "Event 2",
    //     start: "2024-05-13T10:00:00",
    //     end: "2024-05-13T18:00:00",
    //     backColor: "#6aa84f",
    //     participants: 1,
    //   },
    //   {
    //     id: 3,
    //     text: "Event 3",
    //     start: "2024-05-14T12:00:00",
    //     end: "2024-05-14T15:00:00",
    //     backColor: "#f1c232",
    //     participants: 3,
    //   },
    //   {
    //     id: 4,
    //     text: "Event 4",
    //     start: "2024-05-12T11:30:00",
    //     end: "2024-05-12T14:30:00",
    //     backColor: "#cc4125",
    //     participants: 4,
    //   },
    // ];

    const startDate = DayPilot.Date.today();
    calendarRef.current.control.update({startDate, events});
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Week"}
        //   showMonths={3}
        //   skipMonths={3}
        //   startDate={"2023-10-02"}
        //   selectionDay={"2023-10-02"}
          onTimeRangeSelected={ args => {
            calendarRef.current.control.update({
              startDate: args.day
            });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default Calendar;
