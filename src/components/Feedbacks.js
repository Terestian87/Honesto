import React, { useEffect, useState } from 'react'
import '../styles/feedback.css'
const Feedbacks = ({ getStore, users, questions }) => {
    // useEffect
    // leggere dati nel database
    // prendere feedback dati agli utenti e salvare quelli completati

    const [feedbackData, setFeedbackData] = useState({})
    const [chosenUser, setChosenUser] = useState('')

    useEffect(() => {
        getStore('feedback', async (store) => {
            // Crea un cursore che serve per poter iterare la collezione
            let cursor = await store.openCursor();
            // Oggetto che conterra' i feedback che troveremo
            const newFeedbacks = {}

            // Serve per iterare
            while (cursor) {
                // Prende la chiave
                const { key } = cursor
                // Setta nel nuovo oggetto newFeedbacks il valore di cursor 
                // con chiave key
                // Gia filtrati per isSubmitted true
                if (cursor.value.isSubmitted) {
                    newFeedbacks[key] = cursor.value
                }
                // Passa al prossimo elemento
                // Quando finiscono gli elementi, cursor diventa null
                cursor = await cursor.continue();
            }
            setFeedbackData(newFeedbacks)
        })
    }, [getStore])

    const Choice = ({ value }) => {

        const arr = [...Array(3)].map((e, i) => <div className="box" key={i}></div>)

        return <div className='daffuq'>{arr}</div>
    }
    const Scale = ({ value }) => {
        return <progress min="1" max="10" value={value} className="value-box">{value}</progress>
    }
    const Text = ({ value }) => {
        return <div className="text-box">{value}</div>
    }

    const handleAnswer = {
        multipleChoice: ({ value }) => <Choice value={value} />,
        scale: ({ value }) => <Scale value={value} />,
        text: ({ value }) => <Text value={value} />
    }

    return (
        <div className="feedback-list-container">
            <div className="completed-user-list">
                {
                    users
                        .filter(({ id }) => feedbackData[id]?.isSubmitted)
                        .map(({ firstName, avatar, id, lastName }) => (
                            <button key={id} className="user" onClick={e => { setChosenUser(id) }}>
                                <img src={avatar} alt="avatar of user" className="avatar" />
                                <div className="fullName">{firstName} {lastName}</div>
                            </button>
                        ))
                }
            </div>
            <div className="answers-container">
                {questions.map((question, index) => {
                    const value = feedbackData[chosenUser]?.answers[index]
                    return (
                        <div className="answer-wrapper" key={index}>
                            <div className="label-wrapper">{question.label}</div>
                            <div className="bar-wrapper">
                                <div className="box-wrapper">
                                    {/* {console.log(handleAnswer[question.type])} */}
                                    {handleAnswer[question.type]({ value })}
                                </div>
                            </div>
                        </div>
                    )
                }
                )}
            </div>
        </div>
    )
}

export default Feedbacks





//Object.keys(newFeedbacks)      ritorna array con keys come elementi ['asfdad', 'asdfasf'] 
// Object.values(newFeedbacks)   stessa cosa con valori 
// Object.entries(newFeedbacks)  ritorna un array di array [value, key]
// console.log(users)
/* prova di asnwerlist {answerList(chosenUser)} */
/* {console.log(chosenUser)} */
/* {console.log(feedbackData)} */
/* {<div>{feedbackData[chosenUser]}</div>} */
/* {feedbackData.find(chosenUser => feedbackData.key === chosenUser).answers} */
