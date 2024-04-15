import React, {useEffect, useState} from 'react';
import {Form, FormGroup, Col, Button, Grid} from 'react-bootstrap';
import LangSelector from './controls/LangSelector';
import CodeEditor from './controls/CodeEditor';
import AlertDismissable from './controls/AlertDismissable';
import OutputBox from './controls/OutputBox';
import StatusImage from './controls/StatusImage';
import CompilerApi from '../api/CompilerApi';
import {putUserTestCase} from "../api/UserTestCaseApi";
import {addUserScores, createUserScores, getUserScores, putUserScores, updateUserScores} from "../api/UserScoresApi";
import {createUserQuestionSubmit, getUserQuestionSubmit, putUserQuestionSubmit} from "../api/UserQuestionSubmit";
import {
    addEventGroupUserQuestionHandle,
    getEventGroupUserQuestionHandle,
    putEventGroupUserQuestionHandle
} from "../api/GroupQuestionHandleApi";

let languages = ['Java', 'Python', 'JavaScript', 'C', 'C++'];
const languagesProd = ['JavaScript', 'Python'];
const storedUser = JSON.parse(localStorage.getItem('loginUser'));
const loginUser = storedUser || null;
const selectedEventId = sessionStorage.getItem('selectedEventId');


class Editor extends React.Component {
    constructor(props) {
        super(props);
        const {question} = this.props;

        console.log(`env: ${process.env.NODE_ENV}`);
        if (process.env.NODE_ENV === 'production') {
            languages = languagesProd;
        }

        this.state = {
            selectedLang: 0, // JavaScript
            task: {
                lang: 'Java',
                code: '',
            },
            response: {
                status: '0',
                message: '',
            },
            executionTime: 0,
            output: '',
            submitTime:3,
        };

        this.handleRun = this.handleRun.bind(this);
        this.updateSolution = this.updateSolution.bind(this);
        this.handleLangChange = this.handleLangChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        // this.handleSaveUserScores = this.handleSaveUserScores.bind(this);
        // this.checkExistingRecord = this.checkExistingRecord.bind(this)
        // this.updateUserScores = this.updateUserScores.bind(this);
        // this.handleUserQuestionSubmit = this.handleUserQuestionSubmit.bind(this);
        // this.checkExistingUserQuestionSubmitRecord = this.checkExistingUserQuestionSubmitRecord.bind(this);
        // this.updateQuestionSubmit = this.updateQuestionSubmit.bind(this);
    }

    componentDidMount() {
        CompilerApi.getTask('java', this.props.question.questionId) //default load java file
            //  .then(res => res.json())
            .then((task) => {
                console.log(task);
                this.setState({task});
            });
    }

    handleCodeChange(code) {
        const {task} = this.state;
        task.code = code;
        console.log(code);
        return this.setState({task});
    }

    handleRun(event) {
        event.preventDefault();
        const {task} = this.state;
        const startTime = new Date().getTime();
        console.log('handleRun code: ' + task.code);
        console.log('handleRun lang: ' + task.lang);
        console.log('handleRun this.state.output: ' + this.state.output);

        CompilerApi.run(task,this.props.question.questionId)
            .then((res) => {
                // Append the new test case result to the existing message
                const endTime = new Date().getTime();
                const executionTime = endTime - startTime;
                this.setState({response: res, executionTime});

            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const {task} = this.state;
        const startTime = new Date().getTime();
        console.log('handleRun code: ' + task.code);
        console.log('handleRun lang: ' + task.lang);
        console.log('handleRun this.state.output: ' + this.state.output);

        try {
            const res = await new Promise((resolve, reject) => {
                CompilerApi.run(task, this.props.question.questionId)
                    .then(resolve)
                    .catch(reject);
            });

            // Append the new test case result to the existing message
            const endTime = new Date().getTime();
            const executionTime = endTime - startTime;
            this.setState({response: res, executionTime});

            console.log(this.props.question.questionId)

            const userScoreData = {
                eventId: selectedEventId,
                userid: loginUser.id,
                questionid: this.props.question.questionId,
                testcasePassTotal: localStorage.getItem('counter'),
            };

            const userQuestionData = {
                runTimeByMsec: executionTime,
                submitTime: new Date()
            }

            if(sessionStorage.getItem('eventStatus') != 'O'){
                alert("You can not submit")
            } else {
                    // Call the external putUserTestCase function
                    // await createUserScores(loginUser.accessToken, userScoreData);
                    await addUserScores(loginUser.accessToken, userScoreData, userQuestionData);
                    // await this.handleUserQuestionSubmit(userQuestionData);

                    let {submitTime} = this.state;
                    submitTime = submitTime - 1;
                    this.setState({submitTime});
            }

            // Continue with any other logic you want to execute after submitting the test case
        } catch (error) {
            console.error('Failed to submit test case:', error);
        }
    };

    // checkExistingRecord = async () => {
    //     try {
    //         const response = await getUserScores(loginUser.accessToken);
    //         const userScoreHandles = response.data;
    //         console.log(userScoreHandles)
    //
    //         return userScoreHandles.find(handle =>
    //             handle.event.id == parseInt(selectedEventId, 10) &&
    //             handle.question.questionId == this.props.question.questionId &&
    //             handle.user.id == loginUser.id
    //         );
    //     } catch (error) {
    //         console.error('Failed to check existing record:', error);
    //         throw error;
    //     }
    // };


    // handleSaveUserScores = async (userScoreData, userQuestionData) => {
    //     try {
    //         // const response = await getUserScores(loginUser.accessToken);
    //         // console.log(response);
    //         // if (response.status == 204){
    //             await addUserScores(loginUser.accessToken, userScoreData, userQuestionData);
    //         // }
    //
    //         // Check if there is an existing record with the same eventId, questionid, and groupid
    //         // const existingRecord =  await this.checkExistingRecord();
    //         // console.log(existingRecord);
    //         // if (existingRecord) {
    //         //     // If exists, update user.id for the existing record
    //         //     await this.updateUserScores(userScoreData, userQuestionData);
    //         // }
    //         //  else {
    //         //     // If not exists, create a new record
    //         //     await createUserScores(loginUser.accessToken, userScoreData);
    //         // }
    //
    //         console.log('Response saved successfully');
    //     } catch (error) {
    //         console.error('Failed to save response:', error);
    //     }
    // };



    // updateUserScores = async (userScoreData, userQuestionData) => {
    //     try {
    //         const updatedResponse = await updateUserScores(loginUser.accessToken, userScoreData, userQuestionData);
    //         console.log('Record updated:', this.props.question);
    //     } catch (error) {
    //         console.error('Failed to update record:', error);
    //         throw error;
    //     }
    // };

    // checkExistingUserQuestionSubmitRecord = async () => {
    //     try {
    //         const response = await getUserQuestionSubmit(loginUser.accessToken);
    //         const userScoreHandles = response.data;
    //         console.log(response)
    //         return userScoreHandles.find(handle =>
    //             handle.eventId == parseInt(selectedEventId, 10) &&
    //             handle.questionid === this.props.question.id &&
    //             handle.userid === loginUser.id
    //         );
    //     } catch (error) {
    //         console.error('Failed to check existing record:', error);
    //         throw error;
    //     }
    // };
    //
    // handleUserQuestionSubmit = async (userQuestionData) => {
    //     try {
    //         const response = await getUserQuestionSubmit(loginUser.accessToken);
    //         console.log(response);
    //         if (response.status == 204){
    //             await createUserQuestionSubmit(loginUser.accessToken, userQuestionData);
    //         }
    //
    //         //  Check if there is an existing record with the same eventId, questionid, and groupid
    //         const existingRecord =  await this.checkExistingUserQuestionSubmitRecord();
    //         console.log(existingRecord);
    //         if (existingRecord) {
    //             // If exists, update user.id for the existing record
    //             await this.updateQuestionSubmit(existingRecord.id, userQuestionData);
    //         }
    //         else {
    //             // If not exists, create a new record
    //             await createUserQuestionSubmit(loginUser.accessToken, userQuestionData);
    //         }
    //
    //         console.log('Response saved successfully');
    //     } catch (error) {
    //         console.error('Failed to save response:', error);
    //     }
    // };
    //
    // updateQuestionSubmit = async (recordId, userScoreData) => {
    //     try {
    //         const updatedResponse = await putUserQuestionSubmit(loginUser.accessToken, recordId, userScoreData);
    //         console.log('Record updated:', updatedResponse);
    //     } catch (error) {
    //         console.error('Failed to update record:', error);
    //         throw error;
    //     }
    // };


    updateSolution(event) {
        // event.preventDefault();
        console.log(this.state.task);
        const field = event.target.name;
        const {task} = this.state;
        task[field] = event.target.value;
        return this.setState({task});
    }

    handleLangChange(event) {
        const index = parseInt(event.target.value, 10);
        CompilerApi.getTask(languages[index]).then((task) => {
            console.log(task);
            this.setState({task});
        });
        const response = {status: '0', message: ''};
        this.setState({response});
        return this.setState({selectedLang: index});
    }


    render() {
        return (
            <div className="container">
                <Form horizontal>
                    <FormGroup controlId="code">
                        <Col sm={12}>
                            <LangSelector
                                langs={languages}
                                selectedIndex={this.state.selectedLang}
                                onChange={this.handleLangChange}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="code">
                        <Col sm={12}>
                            <CodeEditor
                                onChange={(code) => {
                                    this.handleCodeChange(code);
                                }}
                                onFocus={this.props.handleColorChange}
                                code={this.state.task.code}
                                question={this.props.question}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={5}>
                            <Grid className="col-md-6">
                                <Button bsStyle="primary" type="button" style={{fontSize: '15px'}}
                                        onClick={this.handleRun}>
                                    Run Code
                                </Button>
                            </Grid>
                            <Grid className="col-md-6">
                                {this.state.submitTime === 0 ? (
                                    <Button bsStyle="success" type="button" style={{fontSize: '15px'}} onClick={this.handleSubmit} disabled>
                                        Submit Code {this.state.submitTime}/3
                                    </Button>
                                ) : (
                                    <Button bsStyle="success" type="button" style={{fontSize: '15px'}} onClick={this.handleSubmit}>
                                        Submit Code {this.state.submitTime}/3
                                    </Button>
                                )}
                            </Grid>
                            <Grid className="col-md-6">
                                <StatusImage
                                    hasError={this.state.response.status !== '0'}
                                    message={this.state.response.message}
                                />
                                <div>Run Time: {this.state.executionTime}</div>
                            </Grid>
                        </Col>
                        <Col sm={10}/>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={12}>
                            <AlertDismissable
                                show={this.state.response.status !== '0'}
                                message={this.state.response.message}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={12}>
                            <OutputBox
                                question={this.props.question}
                                executionTime={this.state.executionTime}
                                show={this.state.response.status === '0'}
                                message={this.state.response.message}
                            />
                            {/* <OutputBox show={true} message={this.state.output} /> */}
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default Editor;