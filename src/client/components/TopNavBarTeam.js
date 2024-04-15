import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { getEventByid } from "../api/EventApi";
import { getGroupUsers } from "../api/GroupUserApi";
import CountdownTimer from "./Timer";

export default function TopNavBarTeam() {
    const storedUser = JSON.parse(localStorage.getItem('loginUser'));
    const loginUser = storedUser || null;

    const [team, setTeam] = useState([])
    const teamColors = {};
    const colorArray = ['red', 'blue', 'green', 'purple', 'orange', 'pink'];

    team.forEach((member, index) => {
        teamColors[member.id] = colorArray[index % colorArray.length];
    });

    // const [eventUserList, setEventUserList] = useState([]);
    const selectedEventId = sessionStorage.getItem('selectedEventId');
    const [eventName, setEventName] = useState("");
    const [redirectToNext, setRedirectToNext] = useState(false);
    const [redirectToDash, setRedirectToDash] = useState(false);

    const getEventGroupUserList = async () => {
        try {
            console.log("hi")
            await getEventById(selectedEventId);
            const response = await getGroupUsers(loginUser.accessToken, selectedEventId);
            const eventGroups = response.data.users;
            console.log(eventGroups);
            //
            // const selectedEventGroups = eventGroups.filter(group => group.eventId === parseInt(selectedEventId, 10));
            // console.log("Selected Event ID:", parseInt(selectedEventId, 10));
            // console.log("Filtered groups:", selectedEventGroups);
            //
            // const groupUserData = await getGroupUsers(loginUser.accessToken);
            // const groupUsers = groupUserData.data;
            // console.log("groupUsers:", groupUsers);
            //
            // // Find the group IDs where loginUser is a member
            // const userGroupIds = groupUsers
            //     .filter(user => user.userId === loginUser.id)
            //     .map(user => user.groupId);
            // console.log("userGroupIds:", userGroupIds);
            // localStorage.setItem("groupId",userGroupIds)
            //
            // // Filter selectedEventGroups based on the user's group membership
            // const userEventGroups = selectedEventGroups.filter(group => userGroupIds.includes(group.groupid));
            // console.log("userEventGroups:", userEventGroups);
            //
            //
            // // Get all users in the userEventGroups
            // const userEventGroupUsers = groupUsers
            //     .filter(user => userEventGroups.some(group => group.groupId === user.groupid))
            //     .map(user => ({
            //         userid: user.userId,
            //     }));
            //
            // console.log("Users in user's groups:", userEventGroupUsers);
            //
            const updatedTeam = [];
            for (const key in eventGroups) {
                if (Object.hasOwnProperty.call(eventGroups, key)) {
                    const member = { id: key, name: eventGroups[key] };
                    updatedTeam.push(member);
                }
            }

            setTeam(updatedTeam);
            console.log(team);

        } catch (error) {
            console.error('Failed to get event group users:', error);
        }
    };

    const getEventById = async (id) => {
        try {
            const response = await getEventByid(loginUser.accessToken, id);
            setEventName(response.data.name)
        } catch (error) {
            console.error('Failed to get events:', error);
        }
    };


    useEffect(() => {
        getEventGroupUserList()
        console.log('Team state has been updated:', team);
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem('loginUser');
            setRedirectToNext(true);
        } catch (error) {
            console.error('logout error', error);
        }
    };

    if (redirectToNext) {
        return <Redirect to="/login"/>;
    }

    const handleDashboard = () => {
        const confirmMessage = 'DO YOU FINISH YOU ANSWER ?';
        const userConfirmed = window.confirm(confirmMessage);
        if (userConfirmed) {
            setRedirectToDash(true);
        } else {

        }
    };

    if (redirectToDash) {
        return <Redirect to="/rankingteam"/>;
    }

    return (<>
        <Navbar
            style={{
                backgroundColor: '#8AC453',
                width: '100vw',
                height: '80px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 999,
            }}
        >

            <div style={{display: 'flex', fontSize: "30px"}}>
                {eventName}
            </div>

            <div style={{display: 'flex'}}>
                {team.length > 0 ?
                    (team.map((_, index) => (
                        <div
                            style={{
                                display: 'flex', alignItems: 'center', margin: '10px',
                            }}
                            key={index}>
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                style={{
                                    color: teamColors[team[index].id], marginRight: '10px',
                                }}
                                size="4x"
                            />

                            <span
                                style={{
                                    fontSize: '3em',
                                    fontWeight: team[index].id == loginUser.id ? 'bold' : 'normal',
                                    color: team[index].id == loginUser.id ? teamColors[team[index].id] : 'black',
                                }}>
                                        {team[index].name}
                                    </span>

                        </div>
                    ))) : (
                        <span style={{fontSize: '3em'}}>
                            You are not in this contest.
                        </span>)}
            </div>

            <CountdownTimer/>

            <div>
                <button
                    style={{backgroundColor: '#198754'}}
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleDashboard}
                >
                    Dashboard
                </button>

                <button
                    style={{
                        marginLeft: '2px',
                        backgroundColor: '#198754'
                    }}
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>


        </Navbar>
    </>);
}
