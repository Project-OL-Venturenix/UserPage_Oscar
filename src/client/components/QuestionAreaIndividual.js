import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 样式
import React from 'react';
import ReactMarkdown from 'react-markdown';


function QuestionAreaIndividual({question}) {
    return (
        <>
            <div
                style={{
                    width: '45vw',
                    maxHeight: '75vh',
                    overflow: 'auto',
                    color: 'black',
                    fontSize: 20
                }}
            >
                {/*<ReactMarkdown rehypePlugins={[rehypeRaw]} children={question.question}/>*/}
                <ReactMarkdown>{question.question}</ReactMarkdown>
            </div>

        </>
    );
}

export default QuestionAreaIndividual;