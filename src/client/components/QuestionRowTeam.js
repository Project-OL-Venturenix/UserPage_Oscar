import React, { useEffect, useState } from 'react';
import { getEventByid } from "../api/EventApi";
import {
    addEventGroupUserQuestionHandle,
    getEventGroupUserQuestionHandle,
    putEventGroupUserQuestionHandle
} from "../api/GroupQuestionHandleApi";
import { getQuestionsListByEventId } from "../api/QuestionApi";
import EditorTeam from "./EditorTeam";
import QuestionAreaTeam from "./QuestionAreaTeam";
import TopNavBarTeam from './TopNavBarTeam';

function QuestionRowTeam() {
    const storedUser = JSON.parse(localStorage.getItem('loginUser'));
    const loginUser = storedUser || null;
    const [eventQuestionList, setEventQuestionList] = useState([]);
    const selectedEventId = sessionStorage.getItem('selectedEventId');
    const questionIdMapString = sessionStorage.getItem('color');
    const questionIdMap = JSON.parse(questionIdMapString);

    const [team, setTeam] = useState([])

    const teamColors = {};
    const colorArray = ['red', 'blue', 'green', 'purple', 'orange', 'pink'];

    team.forEach((member, index) => {
        teamColors[member.id] = colorArray[index % colorArray.length];
    });

    const [focusedIndex, setFocusedIndex] = useState(null);
    const [userGroupIds, setUserGroupIds] = useState([]);

    // const getEventGroupUserList = async () => {
    //     try {
    //         await getEventById(selectedEventId);
    //         const response = await getEventGroups(loginUser.accessToken);
    //         const eventGroups = response.data;
    //         console.log(eventGroups);
    //
    //         const selectedEventGroups = eventGroups.filter(group => group.eventId === parseInt(selectedEventId, 10));
    //         console.log("Selected Event ID:", parseInt(selectedEventId, 10));
    //         console.log("Filtered groups:", selectedEventGroups);
    //
    //         const groupUserData = await getGroupUsers(loginUser.accessToken);
    //         const groupUsers = groupUserData.data;
    //         console.log("groupUsers:", groupUsers);
    //
    //         // Find the group IDs where loginUser is a member
    //         const userGroupIds = groupUsers
    //             .filter(user => user.userId === loginUser.id)
    //             .map(user => user.groupId);
    //         console.log("userGroupIds:", userGroupIds);
    //         setUserGroupIds(userGroupIds)
    //
    //         // Filter selectedEventGroups based on the user's group membership
    //         const userEventGroups = selectedEventGroups.filter(group => userGroupIds.includes(group.groupid));
    //         console.log("userEventGroups:", userEventGroups);
    //
    //
    //         // Get all users in the userEventGroups
    //         const userEventGroupUsers = groupUsers
    //             .filter(user => userEventGroups.some(group => group.groupId === user.groupid))
    //             .map(user => ({
    //                 userid: user.userId,
    //             }));
    //
    //         console.log("Users in user's groups:", userEventGroupUsers);
    //
    //         const updatedTeam = [];
    //         for (const user of userEventGroupUsers) {
    //             try {
    //                 const userDetails = await getUserById(loginUser.accessToken, user.userid);
    //                 const userToAdd = userDetails.data;
    //                 //       // Assuming 'team' is a state variable, you need to use setTeam to update it
    //                 updatedTeam.push(userToAdd);
    //                 console.log(updatedTeam)
    //             } catch (error) {
    //                 console.error('Failed to get user details:', error);
    //             }
    //         }
    //         setTeam(updatedTeam);
    //         console.log(team);
    //
    //     } catch (error) {
    //         console.error('Failed to get event group users:', error);
    //     }
    // };

    const getEventById = async (id) => {
        try {
            const response = await getEventByid(loginUser.accessToken, id);
            setEventName(response.data.name)
        } catch (error) {
            console.error('Failed to get events:', error);
        }
    };

    const getEventQuestionList = async () => {
        try {
            const response = await getQuestionsListByEventId(loginUser.accessToken, selectedEventId)
            setEventQuestionList(response.data);
            console.log(response)
        } catch (error) {
            console.error('Failed to get questions:', error);
        }
    };

    const getEventGroupUserQuestionHandleList = async () => {
        try {
            const response = await getEventGroupUserQuestionHandle(loginUser.accessToken);
            const data = response.data;

            // 将数据处理为以questionid为键的对象，值为userlist.id
            const questionIdMap = {};
            data.forEach(item => {
                const questionId = item.questionid;
                const userlistId = item.userid;
                questionIdMap[questionId] = userlistId;
            });

            // 保存映射到sessionStorage
            sessionStorage.setItem('color', JSON.stringify(questionIdMap));
            console.log(questionIdMap);
            // 在这里处理数据，可能设置到 state 中，方便后续渲染时使用
        } catch (error) {
            console.error('Failed to save response:', error);
        }
    };


    useEffect(() => {
        if (loginUser) {
            // getEventGroupUserList();
            getEventQuestionList();
            // getEventGroupUserQuestionHandleList();
        }

        // const intervalId = setInterval(() => {
        //     getEventQuestionList();
        //     getEventGroupUserQuestionHandleList();
        // }, 1000);
        //
        // // 在组件卸载时清除定时器，防止内存泄漏
        // return () => clearInterval(intervalId);
    }, []);


    const handleColorChange = async (index) => {
        setFocusedIndex(index);
        console.log(index)
        if (team.length > 0) {
            // Assuming 'eventQuestionList' and 'team' have the same length
            const question = eventQuestionList[index];

            // Save the user's response to the question
            await handleSaveResponse(question);
            console.log(question.id);


        }
    };

    const handleSaveResponse = async (question) => {
        try {
            const response = await getEventGroupUserQuestionHandle(loginUser.accessToken);
            if (response.status == 204){
                await createEventGroupUserQuestionHandle(question);
            }

            // Check if there is an existing record with the same eventId, questionid, and groupid
             const existingRecord = await checkExistingRecord(question.id, userGroupIds);
             console.log(existingRecord);
             if (existingRecord) {
                 // If exists, update user.id for the existing record
                 await updateEventGroupUserQuestionHandle(existingRecord.id, question);
             } else {
                 // If not exists, create a new record
                 await createEventGroupUserQuestionHandle(question);
             }

            console.log('Response saved successfully');
        } catch (error) {
            console.error('Failed to save response:', error);
        }
    };

    const checkExistingRecord = async (questionId, groupId) => {
        try {
            const response = await getEventGroupUserQuestionHandle(loginUser.accessToken);
            const questionHandles = response.data;
            console.log(questionHandles)
            return questionHandles.find(handle =>
                handle.eventId === parseInt(selectedEventId, 10) &&
                handle.questionid === questionId &&
                handle.groupid == groupId
            );
        } catch (error) {
            console.error('Failed to check existing record:', error);
            throw error;
        }
    };

    const updateEventGroupUserQuestionHandle = async (recordId, question) => {
        try {
            // Call the API to fetch the existing record
            const existingRecordResponse = await getEventGroupUserQuestionHandle(loginUser.accessToken);

            // Check if there is an existing record with the same userlist
            const recordWithSameUserlist = existingRecordResponse.data.find(data =>
                data.userid == loginUser.id && data.id != recordId
            );


            // If exists, update the existing record with userlist as 0
             if (recordWithSameUserlist) {
                 await putEventGroupUserQuestionHandle(loginUser.accessToken, recordWithSameUserlist.id, {
                     ...recordWithSameUserlist,
                     userid: 0,
                 });
             }


            // Update the current record with the new user.id
            const questionData = {
                eventId: parseInt(selectedEventId, 10),
                questionid: question.id,
                groupid: userGroupIds[0],
                userid: loginUser.id,
                response: question.response,
            };
            const updatedResponse = await putEventGroupUserQuestionHandle(loginUser.accessToken, recordId, questionData);
            console.log('Record updated:', updatedResponse.data);
        } catch (error) {
            console.error('Failed to update record:', error);
            throw error;
        }
    };

    const createEventGroupUserQuestionHandle = async (question) => {
        try {
            // Prepare the questionData object with necessary information
            console.log(userGroupIds)
            const questionData = {
                eventId: parseInt(selectedEventId, 10),
                questionid: question.id,
                groupid: userGroupIds[0],
                userid: loginUser.id,
                response: question.response,
            };

            // Call the API to create a new record
            const response = await addEventGroupUserQuestionHandle(loginUser.accessToken, questionData);
            console.log('New record created:', response.data);
        } catch (error) {
            console.error('Failed to create new record:', error);
            throw error;
        }
    };

    return (
        <>
            <TopNavBarTeam/>
            {Array.isArray(eventQuestionList) && eventQuestionList.map((question, index) => (
                <div
                    style={{
                        display: 'flex',
                        marginBottom: '100px',
                        marginLeft: '20px',
                    }}>

                    <div
                        style={{
                            marginLeft: '20px'
                        }}>
                        {questionIdMap && questionIdMap[question.id] ? (
                            <QuestionAreaTeam
                                question={question}
                                borderColor={focusedIndex === index ? teamColors[questionIdMap[question.id]] : teamColors[questionIdMap[question.id]]}
                            />
                        ) : (
                            <QuestionAreaTeam
                                question={question}
                                borderColor={focusedIndex === index ? teamColors[loginUser.id] : 'transparent'}
                            />
                        )}
                    </div>
                    <div style={{width: "100vw"}}>
                        <EditorTeam
                            question={question}
                            checked={focusedIndex === index}
                            handleColorChange={() => handleColorChange(index)}
                        />
                    </div>

                </div>


            ))}
        </>
    );
}

export default QuestionRowTeam;