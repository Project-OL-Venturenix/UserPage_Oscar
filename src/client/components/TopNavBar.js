import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { getEventByid } from "../api/EventApi";
import { getEventUser } from "../api/EventUserApi";
import CountdownTimer from "./Timer";

export default function TopNavBar() {
    const storedUser = JSON.parse(localStorage.getItem('loginUser'));
    const loginUser = storedUser || null;
    const [eventUserList, setEventUserList] = useState([]);
    const selectedEventId = sessionStorage.getItem('selectedEventId');
    const [eventName, setEventName] = useState("");
    const [redirectToNext, setRedirectToNext] = useState(false);
    const [redirectToDash, setRedirectToDash] = useState(false);

    const getEventUserList = async () => {
        try {
            await getEventById(selectedEventId);
            const response = await getEventUser(loginUser.accessToken,selectedEventId)
            console.log(response.data)
            setEventUserList(response.data);
        } catch (error) {
            console.error('Failed to get questions:', error);
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
        if (loginUser) {
            getEventUserList()
        }
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
        return <Redirect to="/ranking"/>;
    }


    return (
        <>
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

                <div style={{display: 'flex', fontSize: "30px"}}>{eventName}</div>

                <div/>
                <div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <FontAwesomeIcon
                            icon={faCircleUser}
                            style={{
                                color: '#FFD43B',
                                marginRight: '10px',
                            }}
                            size="4x"
                        />
                        {loginUser && (
                            <div>
                                    <span style={{fontSize: '3em'}}>
                                    {eventUserList.firstName || "You are not in this content"}
                                    </span>
                            </div>
                        )}
                    </div>
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
        </>
    )
        ;
}
