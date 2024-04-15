import { faCircleCheck, faCircleXmark, faClock, faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getGroupScoresByEventId } from "../api/GroupScoresApi";

const Ranking = () => {

    const storedUser = JSON.parse(localStorage.getItem('loginUser'));
    const loginUser = storedUser || null;
    const [sortedData, setSortedData] = useState();
    const selectedEventId = sessionStorage.getItem('selectedEventId');
    const [userTestCaseDataList, setUserTestCaseDataList] = useState();

    const getUserTestCaseList = async () => {
        try {
            const response = await getGroupScoresByEventId(loginUser.accessToken, selectedEventId);
            const userTestCaseDataList = response.data.result
            setUserTestCaseDataList(userTestCaseDataList);
            console.log(userTestCaseDataList)


            const data = [];

            for (const userTestData of userTestCaseDataList) {
                const newDataEntry = {
                    name: userTestData.groupUserDTO.groupId,
                    Q1: userTestData.score.Q1 || 0,
                    Q2: userTestData.score.Q2 || 0,
                    Q3: userTestData.score.Q3 || 0,
                };

                data.push(newDataEntry);
            }

            console.log(data)


            const sortedData = data.slice().sort((a, b) => {
                const totalScoreA = a.Q1 + a.Q2 + a.Q3;
                const totalScoreB = b.Q1 + b.Q2 + b.Q3;

                return totalScoreB - totalScoreA;
            });

            setSortedData(sortedData);
            console.log(sortedData)

        } catch (error) {
            console.error('Failed to get events:', error);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            getUserTestCaseList();

        }, 1000);

        // 在组件卸载时清除定时器，防止内存泄漏
        return () => clearInterval(intervalId);
    }, []);


    const RoundedRectangle = (props) => {
        const {x, y, width, height, fill, radius} = props;

        return (
            <g>
                {/* 上面的矩形 */}
                <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius}/>
            </g>
        );
    };

    const CustomBar = (props) => {
        let {x, y, width, height, fill, iconRight, iconWrong, data} = props;
        const borderRadius = 0; // 設定圓角半徑，根據需要調整
        let filteredUserQuestionSubmit = null;

        if (Array.isArray(userTestCaseDataList) && userTestCaseDataList.length > 0) {
            filteredUserQuestionSubmit = userTestCaseDataList.find(
                item =>
                    item.groupUserDTO.groupId === data.name
            );
            console.log(filteredUserQuestionSubmit)
        }

        iconRight = Array.from({length: filteredUserQuestionSubmit.passingTestCaseNumber.Q1}, (_, index) => (
            <FontAwesomeIcon icon={faCircleCheck} style={{color: '#63E6BE',}}/>
        ));

        iconWrong = Array.from({length: (10 - (filteredUserQuestionSubmit.passingTestCaseNumber.Q1))}, (_, index) => (
            <FontAwesomeIcon icon={faCircleXmark} style={{color: '#c40808',}}/>
        ));

        console.log(data);
        let filteredUserRunTimeSubmit = null;


        return (
            <g>
                <>
                    {/* 背景矩形 */}
                    <RoundedRectangle x={x} y={y} width={width} height={height} fill={fill} radius={borderRadius}/>

                    {/* 內容 */}
                    <foreignObject x={x} y={y} width={parseFloat(width)} height={height}>
                        <div className="container"
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 position: 'relative',
                                 fontSize: 'auto'
                             }}
                        >
                            <Col>
                                {/*<h5 style={{marginBottom: '5px'}}>Test Case:</h5>*/}
                                <h5 style={{marginBottom: '5px'}}>{iconRight}{iconWrong}</h5>
                                {filteredUserQuestionSubmit.score.Q1 === 5 ? <><FontAwesomeIcon icon={faCrown}
                                                                                                style={{color: "#FFD43B",}}/><FontAwesomeIcon
                                    icon={faClock}
                                    style={{color: "#ffffff",}}/></> : filteredUserQuestionSubmit.score.Q1 === 4 ?
                                    <FontAwesomeIcon icon={faCrown} style={{color: "#FFD43B",}}/> : null}
                                {filteredUserQuestionSubmit && (
                                    <div style={{color: 'white'}}>
                                        Submittime: {filteredUserQuestionSubmit.submitTime.Q1}
                                        <br/>
                                        Runtime: {filteredUserQuestionSubmit.runtime.Q1}ms
                                        <br/>
                                    </div>
                                )}
                            </Col>
                        </div>
                    </foreignObject>
                </>

            </g>
        );
    };

    const CustomBar2 = (props) => {
        let {x, y, width, height, fill, iconRight, iconWrong, data} = props;
        const borderRadius = 0; // 設定圓角半徑，根據需要調整
        let filteredUserQuestionSubmit = null;

        if (Array.isArray(userTestCaseDataList) && userTestCaseDataList.length > 0) {
            filteredUserQuestionSubmit = userTestCaseDataList.find(
                item =>
                    item.groupUserDTO.groupId === data.name
            );
            console.log(filteredUserQuestionSubmit)
        }

        iconRight = Array.from({length: filteredUserQuestionSubmit.passingTestCaseNumber.Q2}, (_, index) => (
            <FontAwesomeIcon icon={faCircleCheck} style={{color: '#63E6BE',}}/>
        ));

        iconWrong = Array.from({length: (10 - (filteredUserQuestionSubmit.passingTestCaseNumber.Q2))}, (_, index) => (
            <FontAwesomeIcon icon={faCircleXmark} style={{color: '#c40808',}}/>
        ));

        console.log(data);


        return (
            <g>
                <>
                    {/* 背景矩形 */}
                    <RoundedRectangle x={x} y={y} width={width} height={height} fill={fill} radius={borderRadius}/>

                    {/* 內容 */}
                    <foreignObject x={x} y={y} width={parseFloat(width)} height={height}>
                        <div className="container"
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 position: 'relative',
                                 fontSize: 'auto'
                             }}
                        >
                            <Col>
                                {/*<h5 style={{marginBottom: '5px'}}>Test Case:</h5>*/}
                                <h5 style={{marginBottom: '5px'}}>{iconRight}{iconWrong}</h5>
                                {filteredUserQuestionSubmit.score.Q2 === 5 ? <><FontAwesomeIcon icon={faCrown}
                                                                                                style={{color: "#FFD43B",}}/><FontAwesomeIcon
                                    icon={faClock}
                                    style={{color: "#ffffff",}}/></> : filteredUserQuestionSubmit.score.Q2 === 4 ?
                                    <FontAwesomeIcon icon={faCrown} style={{color: "#FFD43B",}}/> : null}
                                {filteredUserQuestionSubmit && (
                                    <div style={{color: 'white'}}>
                                        Submittime: {filteredUserQuestionSubmit.submitTime.Q2}
                                        <br/>
                                        Runtime: {filteredUserQuestionSubmit.runtime.Q2}ms
                                        <br/>
                                    </div>
                                )}
                            </Col>
                        </div>
                    </foreignObject>
                </>

            </g>
        );
    };

    const CustomBar3 = (props) => {
        let {x, y, width, height, fill, iconRight, iconWrong, data} = props;
        const borderRadius = 0; // 設定圓角半徑，根據需要調整
        let filteredUserQuestionSubmit = null;

        if (Array.isArray(userTestCaseDataList) && userTestCaseDataList.length > 0) {
            filteredUserQuestionSubmit = userTestCaseDataList.find(
                item =>
                    item.groupUserDTO.groupId === data.name
            );
            console.log(filteredUserQuestionSubmit)
        }

        iconRight = Array.from({length: filteredUserQuestionSubmit.passingTestCaseNumber.Q3}, (_, index) => (
            <FontAwesomeIcon icon={faCircleCheck} style={{color: '#63E6BE',}}/>
        ));

        iconWrong = Array.from({length: (10 - (filteredUserQuestionSubmit.passingTestCaseNumber.Q3))}, (_, index) => (
            <FontAwesomeIcon icon={faCircleXmark} style={{color: '#c40808',}}/>
        ));

        console.log(data);


        return (
            <g>
                <>
                    {/* 背景矩形 */}
                    <RoundedRectangle x={x} y={y} width={width} height={height} fill={fill} radius={borderRadius}/>

                    {/* 內容 */}
                    <foreignObject x={x} y={y} width={parseFloat(width)} height={height}>
                        <div className="container"
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 position: 'relative',
                                 fontSize: 'auto'
                             }}
                        >
                            <Col>
                                {/*<h5 style={{marginBottom: '5px'}}>Test Case:</h5>*/}
                                <h5 style={{marginBottom: '5px'}}>{iconRight}{iconWrong}</h5>
                                {filteredUserQuestionSubmit.score.Q3 === 5 ? <><FontAwesomeIcon icon={faCrown}
                                                                                                style={{color: "#FFD43B",}}/><FontAwesomeIcon
                                    icon={faClock}
                                    style={{color: "#ffffff",}}/></> : filteredUserQuestionSubmit.score.Q3 === 4 ?
                                    <FontAwesomeIcon icon={faCrown} style={{color: "#FFD43B",}}/> : null}
                                {filteredUserQuestionSubmit && (
                                    <div style={{color: 'white'}}>
                                        Submittime: {filteredUserQuestionSubmit.submitTime.Q3}
                                        <br/>
                                        Runtime: {filteredUserQuestionSubmit.runtime.Q3}ms
                                        <br/>
                                    </div>
                                )}
                            </Col>
                        </div>
                    </foreignObject>
                </>

            </g>
        );
    };

    const handleDetailOnClick = () => {
        window.location.href = '/dashboardteam'
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#F2F0ED'
            }}
        >
            <ResponsiveContainer>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'black',
                    marginTop: ' 20px'
                }}>
                    <div/>
                    <div>
                        <h1>Ranking</h1>
                    </div>

                    <div>
                        <button
                            style={{
                                backgroundColor: '#198754',
                                marginLeft: '-200px'
                            }}
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={handleDetailOnClick}
                        >
                            Details
                        </button>
                    </div>
                </div>

                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{top: 20, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"/>
                    <YAxis dataKey="name" type="category"/>
                    <Tooltip/>
                    <Legend/>
                    {/*<Bar dataKey="Q1" stackId="stack" fill="#8884d8" shape={<CustomBar fill="#8884d8"/>}/>*/}
                    {/*<Bar dataKey="Q2" stackId="stack" fill="#82ca9d" shape={<CustomBar2 fill="#82ca9d"/>}/>*/}
                    {/*<Bar dataKey="Q3" stackId="stack" fill="#ffc658" shape={<CustomBar3 fill="#ffc658"/>}/>*/}
                    <Bar
                        dataKey="Q1"
                        stackId="stack"
                        fill="#DFC498"
                        shape={(props) => <CustomBar {...props} data={props.payload}/>}
                    />
                    <Bar
                        dataKey="Q2"
                        stackId="stack"
                        fill="#CB9D54"
                        shape={(props) => <CustomBar2 {...props} data={props.payload}/>}
                    />
                    <Bar
                        dataKey="Q3"
                        stackId="stack"
                        fill="#795E32"
                        shape={(props) => <CustomBar3 {...props} data={props.payload}/>}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Ranking;
