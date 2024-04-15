import React, {useEffect, useState} from 'react';
import {Form, FormGroup, Col, Button, Grid} from 'react-bootstrap';
import LangSelector from './controls/LangSelector';
import CodeEditor from './controls/CodeEditor';
import AlertDismissable from './controls/AlertDismissable';
import OutputBox from './controls/OutputBox';
import StatusImage from './controls/StatusImage';
import CompilerApi from '../api/CompilerApi';
import {putUserTestCase} from "../api/UserTestCaseApi";
import {addUserScores, createUserScores} from "../api/UserScoresApi";
import {putUserQuestionSubmit} from "../api/UserQuestionSubmit";
import {putGroupQuestionSubmit} from "../api/GroupQuestionSubmit";
import {putGroupScores} from "../api/GroupScoresApi";

let languages = ['Java', 'Python', 'JavaScript', 'C', 'C++'];
const languagesProd = ['JavaScript', 'Python'];
const storedUser = JSON.parse(localStorage.getItem('loginUser'));
const loginUser = storedUser || null;
const selectedEventId = sessionStorage.getItem('selectedEventId');


class EditorTeam extends React.Component {
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
    }

    componentDidMount() {
        CompilerApi.getTask('java') //default load java file
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

        CompilerApi.run(task)
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
                CompilerApi.run(task)
                    .then(resolve)
                    .catch(reject);
            });

            // Append the new test case result to the existing message
            const endTime = new Date().getTime();
            const executionTime = endTime - startTime;
            this.setState({response: res, executionTime});

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
                                <Button bsStyle="success" type="button" style={{fontSize: '15px'}}
                                        onClick={this.handleSubmit}>
                                    Submit Code
                                </Button>
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

export default EditorTeam;